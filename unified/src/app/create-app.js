/* eslint-disable no-use-before-define */
/** Wire and mount the profile-driven Vue application. */
import Vue from 'vue';
import VueRouter from 'vue-router';

import toast from 'base/component/toast/index';
import dialog from 'base/component/dialog/index';
import loading from 'base/component/loading/index';
import registerComponents from './register-components';
import { installBasePageFormatters } from './base-page-formatters';

import { createStore } from './store';
import { createHttp } from './http';
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
        if (!opts.hideToast) toast(i18nInstance.translate(error.code));
      } else if (!opts.isReconnect) {
        if (process.env.VUE_APP_OFFLINE_PREVIEW !== '1') {
          router.push({ path: '/unconnect' });
        }
      }
      throw data;
    }
    // No response (timeout / network error) — redirect to unconnect page
    if (!opts.isReconnect && process.env.VUE_APP_OFFLINE_PREVIEW !== '1') {
      router.push({ path: '/unconnect' });
    }
    throw err;
  });

  Vue.prototype.$loading = loading;
  Vue.prototype.$toast = toast;
  Vue.prototype.$dialog = dialog;
  Vue.prototype.$http = http;
  Vue.prototype.changeLanguage = i18nInstance.changeLanguage.bind(i18nInstance);
  Vue.prototype.$reconnect = (opts = {}) => (
    reconnectController.reconnect(adaptReconnectOpts(opts))
  );
  Vue.prototype.$upgrade = (opts = {}) => (
    reconnectController.upgrade(adaptReconnectOpts(opts))
  );
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
 * `{ timeout, delayMs, onSuccess, onTimeout }` contract.
 *
 * Legacy callers use `delayTime` in seconds and lower-case callback names.
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
  };
}

function redirectToLogin() {
  if (typeof window === 'undefined' || !window.location) return;
  if (!window.location.href.includes('login')) {
    window.location.href = '/';
  }
}

export default createApp;
