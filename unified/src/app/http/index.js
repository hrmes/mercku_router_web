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

axios.defaults.timeout = 60000;

let interceptorsInstalled = false;

const unifiedMethods = {
  getNewMeshNodeInfo: createMethod('mesh.node.new.info'),
  getMeshWanIntf: createMethod('mesh.wan.intf.get'),
  updateMeshWanIntf: createMethod('mesh.wan.intf.update'),
  getMeshPowerSupplyMode: createMethod('mesh.poe.mode.get'),
  updateMeshPowerSupplyMode: createMethod('mesh.poe.mode.update'),
  getMeshFanMode: createMethod('mesh.fan.mode.get'),
  updateMeshFanMode: createMethod('mesh.fan.mode.update'),
  getRouterFrozenConfig: createMethod('router.config.frozen.get'),
  updateRouterFrozenConfig: createMethod('router.config.frozen.update'),
};

class UnifiedHttp extends Http {}

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
    config.cancelToken = new axios.CancelToken((cancel) => {
      store.commit('pushToken', { cancelToken: cancel });
    });
    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isCancel(error)) {
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
  const http = new UnifiedHttp();
  return http;
}

export default createHttp;
