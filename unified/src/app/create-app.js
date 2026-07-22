/**
 * createApp(runtimeContext) — wire the profile-driven Vue application.
 *
 * Called exactly once by `bootstrap({ createApp })` after identity/profiles
 * have been composed into a frozen AppRuntimeContext. This function owns the
 * Vue side of the wiring: store, http, i18n, reconnect controller, router,
 * guards, branding, global components and the mounted Vue instance.
 *
 * §1.3: This module lives under `unified/src/app/` and therefore MUST NOT
 * reference concrete model/customer identifier strings or import `Customers`
 * / `Models` from `base/util/constant`. `Role` and `RouterMode` (non-id
 * enums) are allowed.
 *
 * §3.4: backend capability/permission gating is the suite's responsibility;
 * the client only performs UX-layer gating (menu visibility, route guards,
 * reconnect behaviour driven by `runtimeContext.behavior`).
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import { RouterMode } from 'base/util/constant';

import toast from 'base/component/toast/index';
import dialog from 'base/component/dialog/index';
import loading from 'base/component/loading/index';
import registerComponents from 'base/register-components';

import { createStore } from './store';
import { createHttp } from './http';
import { UnifiedI18n } from './i18n';
import { createReconnectController } from './reconnect/create-controller';
import { createRouteConfig } from './router/create-router';
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

  // --- Store -----------------------------------------------------------
  const store = overrides.store || createStore();
  store.commit('setRuntimeContext', runtimeContext);

  // --- HTTP -------------------------------------------------------------
  const http = overrides.http || createHttp({ store });
  const i18nInstance = overrides.i18n || new UnifiedI18n(runtimeContext);
  const router = overrides.router || buildRouter(runtimeContext, store);

  // --- Reconnect controller (uses behavior from Model Profile) ---------
  const reconnectController = createReconnectController({
    http,
    behavior: runtimeContext.behavior,
    store,
  });

  // --- HTTP exception handler ------------------------------------------
  // Mirrors the legacy m6s exception handler with a simplified surface:
  //   401 / token-expiry → redirect to login
  //   network error (no response) → redirect to /unconnect (unless isReconnect)
  //   other → toast the error code
  // TODO(Task 9): re-introduce 600402 (upgrade), 200202/200203 (mode
  // mismatch) once the upgrade/mode-switch UI is migrated.
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
        router.push({ path: '/unconnect' });
      }
      throw data;
    }
    throw err;
  });

  // --- Vue prototype assignments (mirror legacy main.js) ---------------
  Vue.prototype.$loading = loading;
  Vue.prototype.$toast = toast;
  Vue.prototype.$dialog = dialog;
  Vue.prototype.$http = http;
  Vue.prototype.changeLanguage = i18nInstance.changeLanguage.bind(i18nInstance);
  Vue.prototype.$reconnect = (opts = {}) => reconnectController.reconnect(adaptReconnectOpts(opts, i18nInstance));
  Vue.prototype.$upgrade = (opts = {}) => reconnectController.upgrade(adaptReconnectOpts(opts, i18nInstance));

  registerComponents(Vue);

  // --- Branding ---------------------------------------------------------
  // `customerProfile` shape: branding lives on the Customer Profile, which
  // compose.js folds into `runtimeContext.branding`. applyBranding accepts a
  // Customer-Profile-shaped object, so we wrap the branding block.
  applyBranding({ branding: runtimeContext.branding }, typeof document !== 'undefined' ? document : undefined);

  // --- Mount ------------------------------------------------------------
  const app = new Vue({
    el: '#web',
    i18n: i18nInstance.i18n,
    router,
    store,
    render: (h) => h(App),
  });
  return app;
}

/**
 * Build the Vue Router instance from the runtime context + current store
 * state. The route table is filtered once at creation time using the current
 * role/mode; navigation-time re-checking is done by `installGuards`.
 *
 * When `store.state.mode` is empty (user not logged in yet) we default to
 * `RouterMode.router` for route-table construction so that mode-gated routes
 * exist in the table. The guard still blocks direct access until a real mode
 * is set via `setMode`.
 */
function buildRouter(runtimeContext, store) {
  const initialRole = store.state.role || '';
  const initialMode = store.state.mode || RouterMode.router;
  const routes = createRouteConfig(runtimeContext, initialRole, initialMode);
  const router = new VueRouter({ mode: 'history', routes });
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
 * Legacy callers (wlan.vue, mode.vue) pass `{ timeout, delayTime,
 * onsuccess, ontimeout, showLoading, text }`. The unified controller uses
 * camelCase callbacks and explicit `delayMs` (milliseconds, not seconds).
 */
function adaptReconnectOpts(opts, i18nInstance) {
  void i18nInstance; // reserved for future progress dialog wiring
  return {
    timeout: opts.timeout,
    delayMs: typeof opts.delayMs === 'number' ? opts.delayMs : 0,
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
