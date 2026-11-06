/* eslint-disable no-use-before-define */
/** Wire and mount the profile-driven Vue application. */
import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';

import toast from 'base/component/toast/index';
import dialog from 'base/component/dialog/index';
import loading from 'base/component/loading/index';
import registerComponents from './register-components';
import { installBasePageFormatters } from './base-page-formatters';

import { createStore } from './store';
import { createHttp } from './http';
import { operationError } from './http/operations';
import { errorMessageKey, isPasswordRejection } from './http/error-message';
import { UnifiedI18n } from './i18n';
import { setCurrentI18n } from '../i18n';
import { setCurrentStore } from '../store';
import { createReconnectController } from './reconnect/create-controller';
import { createRouteConfig, ROUTER_BASE } from './router/create-router';
import { installGuards } from './router/guards';
import { applyBranding } from './branding/apply-branding';
import App from './App.vue';

Vue.use(VueRouter);

/**
 * Build the unified Vue application and mount it on `#web`.
 *
 * @param {Object} runtimeContext  frozen AppRuntimeContext (from bootstrap)
 * @param {Object} [overrides]     test-only overrides (store/router/etc.)
 * @returns {Object} the mounted Vue instance
 */
export function createApp(runtimeContext, overrides = {}) {
  if (!runtimeContext || !Object.isFrozen(runtimeContext)) {
    throw new TypeError('createApp: expected a frozen AppRuntimeContext');
  }

  const store = overrides.store || createStore();
  store.commit('setRuntimeContext', runtimeContext);
  setCurrentStore(store);

  const http = overrides.http || createHttp({ store });
  const i18nInstance = overrides.i18n || new UnifiedI18n(runtimeContext);
  setCurrentI18n(i18nInstance);
  const router = overrides.router || buildRouter(runtimeContext, store);

  const reconnectController = createReconnectController({
    http,
    behavior: runtimeContext.behavior,
    store,
  });

  const translate = key => i18nInstance.translate(key);
  function showOperationError(data) {
    const error = data.error || {};
    const operation = data.async;
    if (error.reason === 'outcome-unknown' && operation) {
      dialog.confirm({
        message: translate(errorMessageKey(error)),
        okText: translate('operation.check'),
        cancelText: translate('trans0025'),
        callback: {
          ok: () => {
            const stop = http.onOperationWaiting(operation.id);
            http.waitForOperation(operation.id)
              .then(() => toast(translate('operation.completed'), 2000, 'success'))
              .catch(err => {
                if (!axios.isCancel(err)) {
                  showOperationError((err.response && err.response.data) || data);
                }
              })
              .finally(stop);
          },
        },
      });
    } else toast(translate(errorMessageKey(error)));
  }
  let waiting = 0;
  let loadingGeneration = 0;
  http.onOperationWaiting = () => {
    const generation = loadingGeneration;
    waiting += 1;
    loading.open({ title: translate('operation.applying') });
    if (loading.instance) loading.instance.title = translate('operation.applying');
    let stopped = false;
    return () => {
      if (stopped || generation !== loadingGeneration) return;
      stopped = true;
      waiting = Math.max(0, waiting - 1);
      if (!waiting) loading.close();
    };
  };

  http.setExHandler((err, options) => {
    const opts = options || {};
    const { response } = err;
    if (response) {
      const { status, data } = response;
      if (status === 401) {
        redirectToLogin();
        throw data;
      }
      const { error } = data || {};
      if (error) {
        const passwordError = opts.data && opts.data.method === 'router.login' &&
          isPasswordRejection(data);
        if (!opts.hideToast && !passwordError) showOperationError(data);
      } else if (!opts.isReconnect) {
        if (process.env.VUE_APP_OFFLINE_PREVIEW !== '1') {
          router.push({ path: '/unconnect' });
        }
      }
      throw data;
    }
    // A transport failure is not evidence of a wrong password.
    if (opts.data && opts.data.method === 'router.login') {
      const data = { error: { code: 109999, reason: 'unavailable' } };
      if (!opts.hideToast) showOperationError(data);
      throw data;
    }
    // No response (timeout / network error) — redirect to unconnect page
    if (!opts.isReconnect && process.env.VUE_APP_OFFLINE_PREVIEW !== '1') {
      router.push({ path: '/unconnect' });
    }
    throw err;
  });

  Vue.prototype.$loading = {
    ...loading,
    open: options => loading.open(options),
    close: () => { if (!waiting) loading.close(); },
  };
  Vue.prototype.$toast = toast;
  Vue.prototype.$dialog = dialog;
  Vue.prototype.$http = http;
  Vue.prototype.changeLanguage = i18nInstance.changeLanguage.bind(i18nInstance);
  let stopReconnectLoading = () => {};
  Vue.prototype.$reconnect = (opts = {}) => {
    stopReconnectLoading();
    const adapted = adaptReconnectOpts(opts);
    const stop = opts.operation && opts.showLoading !== false
      ? http.onOperationWaiting(opts.operation.id) : () => {};
    stopReconnectLoading = stop;
    reconnectController.reconnect({
      ...adapted,
      operation: opts.operation,
      onSuccess: () => { stop(); adapted.onSuccess(); },
      onTimeout: () => {
        stop(); adapted.onTimeout();
      },
      onError: error => {
        stop(); adapted.onError(error);
        const data = (error.response && error.response.data) ||
          operationError(opts.operation.id).response.data;
        showOperationError(data);
      },
    });
  };
  Vue.prototype.$upgrade = (opts = {}) => (
    reconnectController.upgrade(adaptReconnectOpts(opts))
  );
  router.beforeEach((to, from, next) => {
    store.commit('clearToken');
    reconnectController.cancel();
    stopReconnectLoading();
    loadingGeneration += 1;
    waiting = 0; loading.close();
    next();
  });
  installBasePageFormatters(Vue, i18nInstance);

  registerComponents(Vue);

  let removeViewportListener = () => {};
  if (typeof window !== 'undefined') {
    const updateViewport = () => store.commit('setIsMobile', window.innerWidth <= 768);
    updateViewport();
    window.addEventListener('resize', updateViewport);
    removeViewportListener = () => window.removeEventListener('resize', updateViewport);
  }

  applyBranding(
    { branding: runtimeContext.branding },
    typeof document !== 'undefined' ? document : undefined
  );

  const app = new Vue({
    el: '#web',
    i18n: i18nInstance.i18n,
    router,
    store,
    beforeDestroy() {
      removeViewportListener();
      reconnectController.dispose();
      stopReconnectLoading();
    },
    render: (h) => h(App),
  });
  return app;
}

function buildRouter(runtimeContext, store) {
  const routes = createRouteConfig(runtimeContext);
  const router = new VueRouter({ mode: 'history', base: ROUTER_BASE, routes });
  installGuards(
    router,
    runtimeContext,
    () => store.state.role,
    () => store.state.mode
  );
  return router;
}

/**
 * Adapt legacy reconnect/upgrade option shape to the controller's
 * `{ timeout, delayMs, onSuccess, onTimeout, onError }` contract.
 *
 * Legacy callers use `delayTime` in seconds and lower-case callback names.
 * onerror only cleans page-local UI; the public layer owns operation messages.
 */
function adaptReconnectOpts(opts) {
  const hasExplicitDelayMs = typeof opts.delayMs === 'number';
  let delayMs = hasExplicitDelayMs ? opts.delayMs : 0;
  if (!hasExplicitDelayMs && typeof opts.delayTime === 'number') {
    delayMs = opts.delayTime * 1000;
  }
  return {
    timeout: opts.timeout,
    delayMs,
    onSuccess: typeof opts.onsuccess === 'function' ? opts.onsuccess : () => {},
    onTimeout: typeof opts.ontimeout === 'function' ? opts.ontimeout : () => {},
    onError: typeof opts.onerror === 'function' ? opts.onerror : () => {},
  };
}

function redirectToLogin() {
  if (typeof window === 'undefined' || !window.location) return;
  if (!window.location.href.includes('login')) {
    window.location.href = '/';
  }
}

export default createApp;
