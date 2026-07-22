/**
 * Unified Vuex Store.
 *
 * Holds the runtime-reactive UI state (mode, role, theme, device color,
 * connectivity flags, in-flight cancel tokens) plus a non-reactive reference
 * to the frozen AppRuntimeContext composed by bootstrap → compose.
 *
 * §3.4: identity / modelProfile / customerProfile / runtimeContext are
 * READ-ONLY. They are attached via `setRuntimeContext`, which validates the
 * payload is frozen before storing it on a non-reactive slot so Vue cannot
 * accidentally mutate it.
 *
 * Unlike the legacy per-model stores, this file MUST NOT read
 * `process.env.MODEL_CONFIG` or `process.env.CUSTOMER_CONFIG` (those are
 * compile-time literals that violate the single-artifact boundary). All
 * identity-derived data arrives via `setRuntimeContext` at runtime.
 *
 * The legacy `deviceColor` localStorage key was prefixed with the lowercased
 * model id (e.g. `m11r4_deviceColor`). The unified build ships one bundle for
 * every model, so the key is the plain `deviceColor` — model-specific
 * partitioning was never load-bearing, it was a side-effect of per-model
 * stores.
 */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const DEVICE_COLOR_KEY = 'deviceColor';

function readLocalStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (err) {
    // localStorage may be disabled (private mode, SSR); fall back to defaults.
    return null;
  }
}

function writeLocalStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    // Ignore — persistence is best-effort.
  }
}

export function createStore() {
  const store = new Vuex.Store({
    state: {
      mode: readLocalStorage('mode') || '',
      role: readLocalStorage('role') || '',
      isMobile: true,
      hasTransition: true,
      isConnected: '',
      theme: readLocalStorage('theme') || 'light',
      changeMode: true,
      cancelTokenArr: [],
      deviceColor: readLocalStorage(DEVICE_COLOR_KEY) || 'black',
      modelVersion: '',
      modules: {
        limits: {},
        portfw: {},
        rsvdip: {},
        vpn: {},
      },
    },
    getters: {
      role: (state) => state.role,
      mode: (state) => state.mode,
      runtimeContext: (state) => state._runtimeContext,
      effectiveCapabilities: (state) => {
        const ctx = state._runtimeContext;
        return ctx ? ctx.effectiveCapabilities : {};
      },
      behavior: (state) => {
        const ctx = state._runtimeContext;
        return ctx ? ctx.behavior : {};
      },
      branding: (state) => {
        const ctx = state._runtimeContext;
        return ctx ? ctx.branding : {};
      },
      policy: (state) => {
        const ctx = state._runtimeContext;
        return ctx ? ctx.policy : {};
      },
    },
    mutations: {
      setRuntimeContext(state, runtimeContext) {
        if (
          !runtimeContext
          || typeof runtimeContext !== 'object'
          || !Object.isFrozen(runtimeContext)
        ) {
          throw new TypeError(
            'setRuntimeContext: expected a frozen AppRuntimeContext'
          );
        }
        // Store on a non-reactive slot so Vue does not attempt to wrap the
        // frozen object in a reactive proxy. `_runtimeContext` is read via
        // the `runtimeContext` getter, which returns the same reference.
        Vue.set(state, '_runtimeContext', runtimeContext);
      },
      setMode(state, mode) {
        state.mode = mode;
        writeLocalStorage('mode', mode);
      },
      setRole(state, role) {
        state.role = role;
        writeLocalStorage('role', role);
      },
      setTheme(state, theme) {
        state.theme = theme;
        writeLocalStorage('theme', theme);
      },
      setDeviceColor(state, color) {
        state.deviceColor = color;
        writeLocalStorage(DEVICE_COLOR_KEY, color);
      },
      setIsConnected(state, isConnected) {
        state.isConnected = isConnected;
      },
      setModelVersion(state, modelVersion) {
        state.modelVersion = modelVersion;
      },
      pushToken(state, payload) {
        state.cancelTokenArr.push(payload.cancelToken);
      },
      clearToken(state) {
        state.cancelTokenArr.forEach((cancel) => {
          if (typeof cancel === 'function') cancel('route-change-cancel');
        });
        state.cancelTokenArr = [];
      },
    },
  });
  return store;
}

export default createStore;
