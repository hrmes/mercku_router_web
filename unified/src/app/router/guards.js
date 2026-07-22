/**
 * installGuards(router, runtimeContext, getCurrentRole, getCurrentMode)
 *
 * Installs a `router.beforeEach` guard that re-checks capability, customer
 * policy, role and mode on EVERY navigation. This is defence-in-depth: even
 * if a user types a capability-gated URL directly, the guard redirects them
 * to a safe default.
 *
 * The guard reads filtering metadata from `to.meta`:
 *   - meta.capability (optional): one of CAPABILITY_KEYS
 *   - meta.requiresCustomerPolicy (optional): 'allowTelnet' | 'allow2LevelAdmin'
 *   - meta.auth (optional): [Role...] — checked only when allow2LevelAdmin is true
 *   - meta.mode (optional): [RouterMode...] — current mode must be in this list
 *
 * Routes WITHOUT meta.auth / meta.mode (public routes like login, dashboard,
 * unconnect, wlan, device, mesh, etc.) are NOT guarded — the guard calls
 * next() immediately. This matches create-router.js which omits `config`
 * for public routes.
 *
 * `getCurrentRole` and `getCurrentMode` are injectable getters so Task 7
 * can wire them to Store getters (role / mode may change at runtime when
 * the user logs in as a different role or switches router mode). Tests
 * pass simple closures returning fixed values.
 *
 * When a check fails, the guard redirects to GUARD_REDIRECT_TO
 * ('/web/dashboard'). The dashboard is a public route so the redirect
 * cannot itself be blocked.
 */

export const GUARD_REDIRECT_TO = '/web/dashboard';

function isPublicRoute(to) {
  // Public routes have no auth/mode in meta (create-router.js omits `config`
  // for public routes, so meta.auth and meta.mode are undefined).
  if (!to.meta) return true;
  const m = to.meta;
  return !m.auth && !m.mode && !m.capability && !m.requiresCustomerPolicy;
}

function checkCapability(to, runtimeContext) {
  if (!to.meta.capability) return true;
  return runtimeContext.effectiveCapabilities[to.meta.capability] === true;
}

function checkCustomerPolicy(to, runtimeContext) {
  if (!to.meta.requiresCustomerPolicy) return true;
  return runtimeContext.policy[to.meta.requiresCustomerPolicy] === true;
}

function checkRole(to, role, policy) {
  // Role check applies only when the customer enables 2-level admin.
  if (policy.allow2LevelAdmin !== true) return true;
  if (!to.meta.auth) return true;
  return Array.isArray(to.meta.auth) && to.meta.auth.includes(role);
}

function checkMode(to, mode) {
  if (!to.meta.mode) return true;
  return Array.isArray(to.meta.mode) && to.meta.mode.includes(mode);
}

export function installGuards(router, runtimeContext, getCurrentRole, getCurrentMode) {
  if (!router || typeof router.beforeEach !== 'function') {
    throw new TypeError('installGuards: router must have a beforeEach function');
  }
  if (!runtimeContext) {
    throw new TypeError('installGuards: runtimeContext is required');
  }
  if (typeof getCurrentRole !== 'function') {
    throw new TypeError('installGuards: getCurrentRole must be a function');
  }
  if (typeof getCurrentMode !== 'function') {
    throw new TypeError('installGuards: getCurrentMode must be a function');
  }

  router.beforeEach((to, from, next) => {
    // Public routes (login, dashboard, unconnect, etc.) skip the guard.
    if (isPublicRoute(to)) {
      next();
      return;
    }

    const role = getCurrentRole();
    const mode = getCurrentMode();

    if (!checkCapability(to, runtimeContext)) {
      next(GUARD_REDIRECT_TO);
      return;
    }
    if (!checkCustomerPolicy(to, runtimeContext)) {
      next(GUARD_REDIRECT_TO);
      return;
    }
    if (!checkRole(to, role, runtimeContext.policy)) {
      next(GUARD_REDIRECT_TO);
      return;
    }
    if (!checkMode(to, mode)) {
      next(GUARD_REDIRECT_TO);
      return;
    }

    next();
  });

  return router;
}
