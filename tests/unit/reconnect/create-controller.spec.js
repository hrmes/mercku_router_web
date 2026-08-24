/**
 * Reconnect controller unit tests.
 *
 * Uses a fake scheduler so the tests can advance time deterministically and
 * assert the state-machine transitions, callback timing and timer cleanup
 * without waiting for real setInterval/setTimeout.
 */
const { expect } = require('chai');

const {
  createReconnectController,
} = require('../../../unified/src/app/reconnect/create-controller.js');

const DEFAULT_BEHAVIOR = Object.freeze({
  upgradeProbeStartDelayMs: 20000,
  modeSwitchProbeStartDelayMs: 30000,
  reconnectProbeTimeoutMs: 600000,
});

/**
 * Minimal fake scheduler that mimics setTimeout/setInterval/clearTimeout/
 * clearInternval. `tick(ms)` fires every due callback in chronological order,
 * including callbacks scheduled DURING a previous callback (re-entrant safe).
 *
 * Times are tracked in milliseconds. Each `setInterval` fires once per tick
 * that covers its interval window (so advancing 5s on a 5s interval fires
 * it once; advancing 12s fires it twice).
 */
function createFakeScheduler() {
  const timeouts = new Map(); // id -> { fireAt, cb, kind, period? }
  let nextId = 1;
  let now = 0;

  function schedule(cb, delay, kind, period) {
    const id = nextId++;
    timeouts.set(id, {
      fireAt: now + Math.max(0, delay),
      cb,
      kind,
      period,
    });
    return id;
  }

  function clear(id) {
    if (id == null) return;
    timeouts.delete(id);
  }

  function tick(ms) {
    const target = now + ms;
    // Fire callbacks in chronological order. Re-check the queue after each
    // fire because a callback may schedule new timers (or clear existing
    // ones). Stop as soon as the next due timer is past `target`.
    // For intervals, re-schedule with `period` and re-evaluate.
    // We loop until no timer is due before `target`.
    /* eslint-disable no-constant-condition */
    while (true) {
      let due = null;
      let dueId = -1;
      for (const [id, t] of timeouts) {
        if (t.fireAt <= target) {
          if (due === null || t.fireAt < due.fireAt) {
            due = t;
            dueId = id;
          }
        }
      }
      if (due === null) break;
      // Advance now to the timer's fire time so newly scheduled timers
      // are relative to the right base.
      now = due.fireAt;
      if (due.kind === 'interval') {
        // Re-schedule before invoking so the callback can clear itself.
        const next = {
          ...due,
          fireAt: due.fireAt + due.period,
        };
        timeouts.set(dueId, next);
        due.cb();
      } else {
        timeouts.delete(dueId);
        due.cb();
      }
    }
    now = target;
  }

  return {
    setTimeout: (cb, delay) => schedule(cb, delay, 'timeout'),
    clearTimeout: clear,
    setInterval: (cb, delay) => schedule(cb, delay, 'interval', delay),
    clearInterval: clear,
    now: () => now,
    tick,
    pendingCount: () => timeouts.size,
  };
}

function createMockHttp({ getRouterResult } = {}) {
  const calls = [];
  let nextResult = getRouterResult;
  const http = {
    getRouter(_params, opts) {
      calls.push({ opts });
      if (typeof nextResult === 'function') return nextResult();
      return nextResult;
    },
    _calls: calls,
    _setResult(r) { nextResult = r; },
  };
  return http;
}

function behavior() {
  return { ...DEFAULT_BEHAVIOR };
}

/**
 * Drain the microtask queue. The reconnect controller's promise chain
 * (.then + .catch + .catch) settles across multiple microtask rounds; using
 * `setImmediate` ensures all currently-queued microtasks have run before the
 * test continues. This mirrors real Node.js event-loop semantics where
 * microtasks run between macrotasks (timers).
 *
 * Without this drain, a fake-scheduler `tick(ms)` that fires several timer
 * callbacks synchronously would observe `probeInFlight === true` for every
 * callback after the first, because the first probe's `.catch` (which resets
 * the flag) hasn't run yet.
 */
function drainMicrotasks() {
  return new Promise((resolve) => setImmediate(resolve));
}

describe('createReconnectController', () => {
  describe('reconnect({ timeout, delayMs, onSuccess, onTimeout })', () => {
    it('uses behavior.reconnectProbeTimeoutMs/1000 as default timeout when none passed', () => {
      const scheduler = createFakeScheduler();
      const http = createMockHttp({ getRouterResult: Promise.resolve({}) });
      const ctrl = createReconnectController({
        http,
        behavior: behavior(),
        scheduler,
      });

      let succeeded = false;
      ctrl.reconnect({
        onSuccess: () => { succeeded = true; },
        onTimeout: () => {},
      });

      // First probe at delayMs=0 → fires immediately at t=0
      // Resolve the promise, then onSuccess should fire.
      // Note: Promise resolution is async; we use a microtask flush.
      return Promise.resolve()
        .then(() => {
          expect(succeeded).to.equal(true);
          expect(http._calls.length).to.equal(1);
          expect(http._calls[0].opts).to.deep.equal({ isReconnect: true });
        });
    });

    it('honours custom timeout (seconds) and fires onTimeout when no probe succeeds', () => {
      const scheduler = createFakeScheduler();
      // Probes always reject → we expect the timeout to fire.
      const http = createMockHttp({
        getRouterResult: Promise.reject(new Error('router still down')),
      });
      const ctrl = createReconnectController({
        http,
        behavior: behavior(),
        scheduler,
      });

      let timedOut = false;
      let succeeded = false;
      ctrl.reconnect({
        timeout: 60,
        delayMs: 0,
        onSuccess: () => { succeeded = true; },
        onTimeout: () => { timedOut = true; },
      });

      // t=0: first probe fires (rejects)
      // Probes every 5s: t=5, 10, 15, ..., 55
      // Timeout at t=60
      return Promise.resolve()
        .then(() => {
          // After the first probe rejects, no other timers should fire yet.
          expect(timedOut).to.equal(false);
          expect(succeeded).to.equal(false);
          // advance to t=59 (just before timeout)
          scheduler.tick(59 * 1000);
          return null; // let microtasks flush
        })
        .then(() => {
          expect(timedOut).to.equal(false);
          scheduler.tick(1000); // t=60
          return null;
        })
        .then(() => {
          expect(timedOut).to.equal(true);
          expect(succeeded).to.equal(false);
        });
    });

    it('delays the first probe by delayMs (mode-switch scenario)', () => {
      const scheduler = createFakeScheduler();
      const http = createMockHttp({ getRouterResult: Promise.resolve({}) });
      const ctrl = createReconnectController({
        http,
        behavior: behavior(),
        scheduler,
      });

      let succeeded = false;
      ctrl.reconnect({
        timeout: 120,
        delayMs: 30000, // modeSwitchProbeStartDelayMs
        onSuccess: () => { succeeded = true; },
        onTimeout: () => {},
      });

      // No probe should fire during the 30s delay window.
      scheduler.tick(29 * 1000);
      return Promise.resolve()
        .then(() => {
          expect(http._calls.length, 'no probe during delay window').to.equal(0);
          expect(succeeded).to.equal(false);
          scheduler.tick(1000); // t=30 → delay elapsed → first probe fires
          return null;
        })
        .then(() => {
          expect(http._calls.length, 'first probe after delay').to.equal(1);
          expect(succeeded).to.equal(true);
        });
    });

    it('retries every 5s after delay until success', async () => {
      const scheduler = createFakeScheduler();
      const http = createMockHttp();
      // First two probes fail, third succeeds.
      http._setResult(() => Promise.reject(new Error('down')));
      const ctrl = createReconnectController({
        http,
        behavior: behavior(),
        scheduler,
      });

      let succeeded = false;
      ctrl.reconnect({
        timeout: 60,
        delayMs: 0,
        onSuccess: () => { succeeded = true; },
        onTimeout: () => {},
      });

      // Drain microtasks so the first probe's .catch resets probeInFlight
      // before we advance time.
      await drainMicrotasks();

      expect(http._calls.length, 'initial probe at t=0').to.equal(1);
      expect(succeeded).to.equal(false);

      http._setResult(() => Promise.reject(new Error('still down')));
      scheduler.tick(5000);
      await drainMicrotasks();

      expect(http._calls.length, 'second probe at t=5s').to.equal(2);
      expect(succeeded).to.equal(false);

      http._setResult(() => Promise.resolve({ data: { result: { mode: 'router' } } }));
      scheduler.tick(5000);
      await drainMicrotasks();

      expect(http._calls.length, 'third probe at t=10s').to.equal(3);
      expect(succeeded, 'third probe resolves → onSuccess').to.equal(true);
    });

    it('dispose() clears all timers and prevents future callbacks', () => {
      const scheduler = createFakeScheduler();
      const http = createMockHttp({
        getRouterResult: Promise.reject(new Error('down')),
      });
      const ctrl = createReconnectController({
        http,
        behavior: behavior(),
        scheduler,
      });

      let timedOut = false;
      let succeeded = false;
      ctrl.reconnect({
        timeout: 60,
        delayMs: 0,
        onSuccess: () => { succeeded = true; },
        onTimeout: () => { timedOut = true; },
      });

      return Promise.resolve()
        .then(() => {
          // After the first probe rejects, dispose() should prevent the
          // timeout from firing even if we advance time.
          ctrl.dispose();
          // Sanity: no callbacks have fired yet.
          expect(timedOut).to.equal(false);
          expect(succeeded).to.equal(false);
          // pendingCount==0 because dispose cleared everything.
          expect(scheduler.pendingCount()).to.equal(0);
          scheduler.tick(120 * 1000); // past the timeout
          return null;
        })
        .then(() => {
          expect(timedOut, 'no onTimeout after dispose').to.equal(false);
          expect(succeeded, 'no onSuccess after dispose').to.equal(false);
        });
    });

    it('dispose() during delayMs cancels the pending first probe', () => {
      const scheduler = createFakeScheduler();
      const http = createMockHttp({ getRouterResult: Promise.resolve({}) });
      const ctrl = createReconnectController({
        http,
        behavior: behavior(),
        scheduler,
      });

      let succeeded = false;
      ctrl.reconnect({
        timeout: 120,
        delayMs: 30000,
        onSuccess: () => { succeeded = true; },
        onTimeout: () => {},
      });

      // Dispose during the delay window — first probe should never fire.
      ctrl.dispose();
      scheduler.tick(60 * 1000);
      return Promise.resolve()
        .then(() => {
          expect(http._calls.length, 'no probe after dispose during delay').to.equal(0);
          expect(succeeded).to.equal(false);
        });
    });
  });

  describe('upgrade({ onSuccess, onTimeout })', () => {
    it('uses behavior.upgradeProbeStartDelayMs before the first probe', () => {
      const scheduler = createFakeScheduler();
      const http = createMockHttp({ getRouterResult: Promise.resolve({}) });
      const ctrl = createReconnectController({
        http,
        behavior: behavior(),
        scheduler,
      });

      let succeeded = false;
      ctrl.upgrade({
        onSuccess: () => { succeeded = true; },
        onTimeout: () => {},
      });

      // Probes must not start until behavior.upgradeProbeStartDelayMs elapses.
      scheduler.tick(19 * 1000);
      return Promise.resolve()
        .then(() => {
          expect(http._calls.length, 'no probe during upgrade delay').to.equal(0);
          expect(succeeded).to.equal(false);
          scheduler.tick(1000); // t=20s → first probe fires
          return null;
        })
        .then(() => {
          expect(http._calls.length, 'first probe after upgradeProbeStartDelayMs').to.equal(1);
          expect(succeeded).to.equal(true);
        });
    });

    it('uses behavior.reconnectProbeTimeoutMs/1000 as the timeout', () => {
      const scheduler = createFakeScheduler();
      // Probes always reject.
      const http = createMockHttp({
        getRouterResult: Promise.reject(new Error('still upgrading')),
      });
      const ctrl = createReconnectController({
        http,
        behavior: behavior(), // reconnectProbeTimeoutMs = 600000 ms = 600s
        scheduler,
      });

      let timedOut = false;
      ctrl.upgrade({
        onSuccess: () => {},
        onTimeout: () => { timedOut = true; },
      });

      return Promise.resolve()
        .then(() => {
          // Should NOT timeout before the full 20s delay + 600s probing.
          scheduler.tick(19 * 1000);
          return null;
        })
        .then(() => {
          expect(timedOut).to.equal(false);
          scheduler.tick(1 * 1000); // t=20s → first probe
          return null;
        })
        .then(() => {
          expect(timedOut).to.equal(false);
          // t=20s + 599s = 619s — still within timeout
          scheduler.tick(599 * 1000);
          return null;
        })
        .then(() => {
          expect(timedOut, 'still probing at t=619s').to.equal(false);
          scheduler.tick(1000); // t=620s → timeout fires
          return null;
        })
        .then(() => {
          expect(timedOut, 'onTimeout fires at 20s + 600s').to.equal(true);
        });
    });

    it('upgrade disposes cleanly', () => {
      const scheduler = createFakeScheduler();
      // Use the function form so the rejected promise is created lazily —
      // otherwise Node.js treats the eagerly-created rejected promise as an
      // unhandled rejection because dispose() prevents getRouter from ever
      // being called.
      const http = createMockHttp({
        getRouterResult: () => Promise.reject(new Error('down')),
      });
      const ctrl = createReconnectController({
        http,
        behavior: behavior(),
        scheduler,
      });

      let timedOut = false;
      ctrl.upgrade({
        onSuccess: () => {},
        onTimeout: () => { timedOut = true; },
      });

      return Promise.resolve()
        .then(() => {
          ctrl.dispose();
          expect(scheduler.pendingCount()).to.equal(0);
          scheduler.tick(700 * 1000); // way past timeout
          return null;
        })
        .then(() => {
          expect(timedOut).to.equal(false);
        });
    });
  });

  describe('mode-switch scenario (caller passes delayMs)', () => {
    it('passes behavior.modeSwitchProbeStartDelayMs as delayMs', () => {
      const scheduler = createFakeScheduler();
      const http = createMockHttp({ getRouterResult: Promise.resolve({}) });
      const b = behavior();
      const ctrl = createReconnectController({
        http,
        behavior: b,
        scheduler,
      });

      let succeeded = false;
      // This mirrors what mode.vue does on confirmUpdateMeshMode:
      ctrl.reconnect({
        timeout: 120,
        delayMs: b.modeSwitchProbeStartDelayMs, // 30000ms = 30s
        onSuccess: () => { succeeded = true; },
        onTimeout: () => {},
      });

      scheduler.tick(29 * 1000);
      return Promise.resolve()
        .then(() => {
          expect(http._calls.length).to.equal(0);
          scheduler.tick(1000); // t=30s
          return null;
        })
        .then(() => {
          expect(http._calls.length).to.equal(1);
          expect(succeeded).to.equal(true);
        });
    });
  });

  describe('state machine', () => {
    it('exposes getState() reflecting idle → delaying → probing → success', () => {
      const scheduler = createFakeScheduler();
      const http = createMockHttp({ getRouterResult: Promise.resolve({}) });
      const ctrl = createReconnectController({
        http,
        behavior: behavior(),
        scheduler,
      });

      expect(ctrl.getState(), 'initial state is idle').to.equal('idle');

      ctrl.reconnect({
        timeout: 120,
        delayMs: 30000,
        onSuccess: () => {},
        onTimeout: () => {},
      });

      expect(ctrl.getState(), 'in delay phase').to.equal('delaying');

      scheduler.tick(30 * 1000);
      expect(ctrl.getState(), 'first probe in flight').to.equal('probing');

      return Promise.resolve()
        .then(() => {
          expect(ctrl.getState(), 'success after probe resolves').to.equal('success');
        });
    });

    it('exposes getState() reflecting timeout path', () => {
      const scheduler = createFakeScheduler();
      const http = createMockHttp({
        getRouterResult: Promise.reject(new Error('down')),
      });
      const ctrl = createReconnectController({
        http,
        behavior: behavior(),
        scheduler,
      });

      expect(ctrl.getState()).to.equal('idle');

      ctrl.reconnect({
        timeout: 60,
        delayMs: 0,
        onSuccess: () => {},
        onTimeout: () => {},
      });

      expect(ctrl.getState()).to.equal('probing');

      return Promise.resolve()
        .then(() => {
          scheduler.tick(60 * 1000);
          return null;
        })
        .then(() => {
          expect(ctrl.getState()).to.equal('timeout');
        });
    });

    it('dispose() resets state to idle', () => {
      const scheduler = createFakeScheduler();
      const http = createMockHttp({
        getRouterResult: Promise.reject(new Error('down')),
      });
      const ctrl = createReconnectController({
        http,
        behavior: behavior(),
        scheduler,
      });

      ctrl.reconnect({
        timeout: 60,
        delayMs: 0,
        onSuccess: () => {},
        onTimeout: () => {},
      });

      return Promise.resolve()
        .then(() => {
          ctrl.dispose();
          expect(ctrl.getState()).to.equal('idle');
        });
    });
  });
});
