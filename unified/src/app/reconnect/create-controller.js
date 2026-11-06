import axios from 'axios';
/* eslint-disable import/prefer-default-export */
/**
 * Reconnect Controller — unified state machine for the legacy
 * reconnect/upgrade/mode-switch probe flow.
 *
 * Legacy behaviour (m6s/src/main.js:31-138):
 *   - reconnect(options): 1s tick; decrement count; probe every 5s once
 *     delayTime has elapsed; timeout when count hits 0.
 *   - upgrade(options): setTimeout(20s) then reconnect({timeout: 600}).
 *   - mode.vue (m6s): this.$reconnect({timeout:120, delayTime:30}) on
 *     confirmUpdateMeshMode success.
 *
 * Unified behaviour — driven by Model Profile `behavior`:
 *   - reconnect({ timeout, delayMs, onSuccess, onTimeout }):
 *       timeout: seconds, total (includes delay)
 *       delayMs: ms before first probe (0 → probe immediately)
 *       probe call: http.getRouter(undefined, { isReconnect: true })
 *       probes every 5s after the first; when operation is supplied, HTTP
 *       reachability is followed by confirmation of that exact request id;
 *       onTimeout fires when `timeout` seconds elapse without success.
 *   - upgrade({ onSuccess, onTimeout }):
 *       delays behavior.upgradeProbeStartDelayMs before reconnecting with
 *       timeout = behavior.reconnectProbeTimeoutMs / 1000.
 *   - mode-switch caller: reconnect({ timeout: 120,
 *       delayMs: runtimeContext.behavior.modeSwitchProbeStartDelayMs }).
 *
 * State machine:
 *   idle → delaying → probing → success | timeout
 *   idle → probing → confirming → success | unconfirmed | timeout
 *   (confirming is used only with an explicitly supplied operation receipt)
 *
 * `scheduler` is injectable. Default uses the host's setTimeout/setInterval
 * so production code can call without a scheduler. Tests inject a fake
 * scheduler so time can be advanced deterministically.
 *
 * `store` is accepted for parity with the legacy `if (isDelay &&
 * store.state.changeMode === false) return` guard, but the unified controller
 * intentionally does NOT read store.state.changeMode: that flag was a
 * defensive cross-component channel that the new state machine replaces with
 * an explicit `dispose()` call. Callers that abort the flow (e.g. on a
 * subsequent error) must call `dispose()`.
 */
const PROBE_INTERVAL_MS = 5000;

function defaultScheduler() {
  return {
    setTimeout: (cb, delay) => setTimeout(cb, delay),
    clearTimeout: (id) => clearTimeout(id),
    setInterval: (cb, delay) => setInterval(cb, delay),
    clearInterval: (id) => clearInterval(id),
  };
}

/**
 * @param {Object} opts
 * @param {Object} opts.http  Http instance (must expose getRouter)
 * @param {Object} opts.behavior  Model Profile behavior bag
 * @param {Object} [opts.scheduler]  Injectable scheduler (defaults to host)
 * @param {Object} [opts.store]  Vuex store (unused; reserved for parity)
 * @returns {Object} controller: { reconnect, upgrade, dispose, getState }
 */
export function createReconnectController({
  http,
  behavior,
  scheduler,
} = {}) {
  if (!http || typeof http.getRouter !== 'function') {
    throw new TypeError('createReconnectController: http.getRouter is required');
  }
  if (!behavior || typeof behavior !== 'object') {
    throw new TypeError('createReconnectController: behavior is required');
  }
  const sched = scheduler || defaultScheduler();

  let state = 'idle';
  // Whether a probe Promise is in flight. Legacy used a `responsed` flag to
  // avoid overlapping HTTP calls — we preserve that semantics.
  let probeInFlight = false;
  let disposed = false;
  let generation = 0;
  let observation = null;

  function setState(next) {
    if (disposed) return;
    state = next;
  }

  // Wrap timer handles in refs so we can mutate them from inside callbacks
  // without re-declaring `let` everywhere.
  const timeoutHandle = { value: null };
  const delayHandle = { value: null };
  const probeHandle = { value: null };

  function clearTimer(handleRef, clearer) {
    if (handleRef.value != null) {
      clearer.call(sched, handleRef.value);
      handleRef.value = null;
    }
  }

  function cleanup() {
    generation += 1;
    if (observation) { observation.cancel('reconnect-ended'); observation = null; }
    clearTimer(timeoutHandle, sched.clearTimeout);
    clearTimer(delayHandle, sched.clearTimeout);
    clearTimer(probeHandle, sched.clearInterval);
    probeInFlight = false;
  }

  function cancel() {
    cleanup(); state = 'idle';
  }

  function dispose() {
    disposed = true;
    cleanup();
    state = 'idle';
  }

  function fireProbe(opts) {
    if (disposed) return;
    if (probeInFlight) return; // legacy `responsed` guard
    probeInFlight = true;
    const run = generation;
    setState('probing');
    Promise.resolve(
      http.getRouter(undefined, { isReconnect: true })
    )
      .then(async () => {
        if (disposed || run !== generation) return;
        if (opts.operation) {
          observation = axios.CancelToken.source();
          setState('confirming');
          try {
            await http.waitForOperation(opts.operation.id, { cancelToken: observation.token,
              timeoutMs: opts.timeoutMs });
          } catch (error) {
            if (disposed || run !== generation) return;
            cleanup(); setState('unconfirmed');
            if (typeof opts.onError === 'function') opts.onError(error);
            return;
          }
        }
        if (disposed || run !== generation) return;
        cleanup();
        setState('success');
        if (typeof opts.onSuccess === 'function') opts.onSuccess();
      })
      .catch(() => {
        if (disposed || run !== generation) return;
        probeInFlight = false;
        // The interval will fire the next probe.
      })
      .catch(() => {
        // Defensive: onSuccess/onTimeout user callbacks should not break the
        // state machine. Swallow any secondary error so a thrown callback
        // cannot leave the controller in a half-cleaned state.
      });
  }

  function startProbing(opts) {
    if (disposed) return;
    // First probe fires immediately.
    fireProbe(opts);
    // Subsequent probes every PROBE_INTERVAL_MS. The legacy code probes at
    // count%5==0 (after the first tick), which approximates to one probe
    // every 5s — setInterval matches that directly.
    probeHandle.value = sched.setInterval(() => {
      if (disposed) return;
      fireProbe(opts);
    }, PROBE_INTERVAL_MS);
  }

  function reconnect(opts = {}) {
    if (disposed) return;
    // Reset any previous run — calling reconnect twice on the same controller
    // is supported by the legacy code (each invocation sets up a new timer).
    cleanup();
    setState('delaying');
    probeInFlight = false;

    const timeoutSec = typeof opts.timeout === 'number'
      ? opts.timeout
      : Math.floor((behavior.reconnectProbeTimeoutMs || 0) / 1000);
    const delayMs = typeof opts.delayMs === 'number' ? opts.delayMs : 0;
    const onSuccess = typeof opts.onSuccess === 'function' ? opts.onSuccess : () => {};
    const onTimeout = typeof opts.onTimeout === 'function' ? opts.onTimeout : () => {};
    const wrapped = {
      onSuccess,
      onTimeout,
      onError: opts.onError,
      operation: opts.operation,
      timeoutMs: timeoutSec * 1000,
    };

    // Total timeout is measured from reconnect() invocation — matches legacy
    // semantics where `count` starts at `timeout` and decrements every tick.
    timeoutHandle.value = sched.setTimeout(() => {
      if (disposed) return;
      cleanup();
      setState('timeout');
      onTimeout(opts.operation ? { reason: 'outcome-unknown', id: opts.operation.id } : undefined);
    }, timeoutSec * 1000);

    if (delayMs > 0) {
      delayHandle.value = sched.setTimeout(() => {
        if (disposed) return;
        startProbing(wrapped);
      }, delayMs);
    } else {
      // No delay — go straight to probing.
      setState('probing');
      startProbing(wrapped);
    }
  }

  function upgrade(opts = {}) {
    if (disposed) return;
    const upgradeDelayMs = behavior.upgradeProbeStartDelayMs || 0;
    const upgradeTimeoutSec = Math.floor(
      (behavior.reconnectProbeTimeoutMs || 0) / 1000
    );
    const onSuccess = typeof opts.onSuccess === 'function' ? opts.onSuccess : () => {};
    const onTimeout = typeof opts.onTimeout === 'function' ? opts.onTimeout : () => {};

    setState('delaying');
    delayHandle.value = sched.setTimeout(() => {
      if (disposed) return;
      reconnect({
        timeout: upgradeTimeoutSec,
        delayMs: 0,
        onSuccess,
        onTimeout,
      });
    }, upgradeDelayMs);
  }

  function getState() {
    return state;
  }

  return {
    reconnect,
    upgrade,
    dispose,
    cancel,
    getState,
  };
}
