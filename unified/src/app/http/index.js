/**
 * Unified HTTP layer.
 *
 * Extends the base Http class (`base/http`) with the cross-cutting axios
 * interceptors that the legacy per-model http modules installed at import
 * time: a request interceptor that attaches a CancelToken tracked by the
 * Vuex store, and a response interceptor that swallows cancellation errors
 * so a route change can abort in-flight requests without surfacing an
 * unhandled rejection.
 *
 * Backend permission gating belongs to suite. This module has no model or
 * customer branches.
 *
 * The store is injected explicitly (`createHttp({ store })`) instead of
 * imported, so tests can swap in a fake store and so the http module does
 * not pin a single store instance at module load time (the legacy
 * `m6s/src/http/index.js` imported the store eagerly, which made it
 * impossible to test in isolation).
 */
import axios from 'axios';
import Http, { createMethod } from 'base/http';
import { createOperationTracker, operationPolicy } from './operations';

axios.defaults.timeout = 60000;

let interceptorsInstalled = false;

const unifiedMethods = {
  startMeshApclientScan: createMethod('mesh.apclient.scan'),
  getMeshApclientScanList: createMethod('mesh.apclient.get'),
  getNewMeshNodeInfo: createMethod('mesh.node.new.info'),
  getMeshWps: createMethod('mesh.wps.get'),
  updateMeshWps: createMethod('mesh.wps.update'),
  getMeshWanIntf: createMethod('mesh.wan.intf.get'),
  updateMeshWanIntf: createMethod('mesh.wan.intf.update'),
  getMeshPowerSupplyMode: createMethod('mesh.poe.mode.get'),
  updateMeshPowerSupplyMode: createMethod('mesh.poe.mode.update'),
  getMeshFanMode: createMethod('mesh.fan.mode.get'),
  updateMeshFanMode: createMethod('mesh.fan.mode.update'),
  getRouterFrozenConfig: createMethod('router.config.frozen.get'),
  updateRouterFrozenConfig: createMethod('router.config.frozen.update'),
};

class UnifiedHttp extends Http {
  constructor(store) {
    super();
    this.store = store;
    this.operations = createOperationTracker({
      query: (id, cancelToken) => axios({
        url: '/app',
        method: 'post',
        data: { method: 'router.operation.query', params: { id } },
        timeout: 10000,
        cancelToken,
        operationQuery: true,
        hideToast: true,
      }).then(response => response.data.result),
    });
    this.onOperationWaiting = () => {};
  }

  waitForOperation(id, options = {}) {
    if (options.cancelToken) return this.operations.wait(id, options);
    const source = axios.CancelToken.source();
    this.store.commit('pushToken', { cancelToken: source.cancel });
    return this.operations.wait(id, { ...options, cancelToken: source.token });
  }

  request(config, params, options = {}) {
    return super.request(config, params, {
      ...options,
      registerCancel: cancel => this.store.commit('pushToken', { cancelToken: cancel }),
    });
  }

  async onResponse(response, options) {
    const { method } = options.data;
    const operation = response.data && response.data.async;
    if (!operation || method === 'router.operation.query' || operationPolicy(method) !== 'wait') {
      return response;
    }
    const source = axios.CancelToken.source();
    this.store.commit('pushToken', { cancelToken: source.cancel });
    if (options.cancelToken) options.cancelToken.promise.then(source.cancel);
    const stopLoading = this.onOperationWaiting(operation.id);
    try {
      await this.waitForOperation(operation.id, { cancelToken: source.token });
      return response;
    } catch (error) {
      if (axios.isCancel(error)) return new Promise(() => {});
      throw error;
    } finally {
      if (typeof stopLoading === 'function') stopLoading();
    }
  }
}

Object.keys(unifiedMethods).forEach((methodName) => {
  UnifiedHttp.prototype[methodName] = function requestUnifiedMethod(params, httpConfig) {
    return this.request(unifiedMethods[methodName], params, httpConfig);
  };
});

/**
 * Install the CancelToken request interceptor and the cancellation response
 * interceptor on the global axios instance. Idempotent — repeated calls are
 * no-ops — so multiple `createHttp` invocations (e.g. in tests) do not stack
 * interceptors.
 *
 * The request interceptor reads `store.commit('pushToken', ...)` so every
 * in-flight request can be cancelled by `store.commit('clearToken')` on a
 * route change. The response interceptor returns a never-resolving Promise
 * for cancelled requests, which terminates the downstream `.then` chain
 * without surfacing the cancellation as an error.
 */
function installCancelTokenInterceptors(store) {
  if (interceptorsInstalled) return;
  interceptorsInstalled = true;

  axios.interceptors.request.use((config) => {
    if (!config.cancelToken) {
      config.cancelToken = new axios.CancelToken((cancel) => {
        if (config.registerCancel) config.registerCancel(cancel);
        else store.commit('pushToken', { cancelToken: cancel });
      });
    }
    if (config.operationQuery && config.cancelToken) {
      config.cancelToken.promise.then(error => { error.operationQuery = true; });
    }
    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isCancel(error) && !error.operationQuery) {
        // Cancelled by a route change — terminate the Promise chain without
        // surfacing an error to the page component.
        return new Promise(() => {});
      }
      return Promise.reject(error);
    }
  );
}

/**
 * Build a unified Http instance bound to the given Vuex store.
 *
 * The base class exposes common API methods through `Http.prototype`.
 *
 * @param {Object} opts
 * @param {Object} opts.store  Vuex store used to track cancel tokens.
 */
export function createHttp({ store } = {}) {
  if (!store || typeof store.commit !== 'function') {
    throw new TypeError('createHttp: store with commit() is required');
  }
  installCancelTokenInterceptors(store);
  const http = new UnifiedHttp(store);
  return http;
}

export default createHttp;
