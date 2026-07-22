/**
 * createRouteConfig(runtimeContext, role, mode) — filter the static
 * routeDefinitions based on the composed AppRuntimeContext, the current
 * role and the current router mode, then return a Vue Router 3.x route
 * config array (with placeholder components, /web prefix and guard metadata
 * baked into `meta`).
 *
 * Task 7's createApp will pass this array to `new VueRouter({ routes })`.
 * Task 6 deliberately does NOT instantiate Vue Router (that needs Vue, which
 * is Task 7's responsibility) — returning the config keeps this file
 * Vue-free and unit-testable in isolation.
 *
 * Filtering rules mirror createMenu:
 *   1. Capability gate: route with `capability: <key>` is included only when
 *      effectiveCapabilities[<key>] === true.
 *   2. Customer-policy gate: route with `requiresCustomerPolicy: <flag>` is
 *      included only when policy[<flag>] === true.
 *   3. Role gate: when policy.allow2LevelAdmin === true, route must satisfy
 *      config.auth.includes(role). When allow2LevelAdmin === false, role
 *      check is skipped (legacy semantics).
 *   4. Mode gate: routes whose config.mode does not include the current
 *      mode are DROPPED from the config (unlike menu, where they are kept
 *      visible-but-disabled). Direct URL access to a mode-incompatible
 *      route is also blocked by installGuards. Dropping the route here is
 *      defence-in-depth: even without the guard, the route is unreachable.
 *
 * Routes WITHOUT `config` (login, dashboard, wlan, unconnect, device, mesh,
 * etc.) are public — they are always included and the guard skips them.
 *
 * The /web prefix is applied to every path and redirect (including
 * children) so the runtime route table matches the legacy m6s router
 * which monkey-patches Router.prototype.push/replace to add the prefix.
 *
 * Guard metadata (capability, requiresCustomerPolicy, auth, mode) is
 * merged into `meta` so installGuards can re-check it on every navigation
 * without re-deriving the filter.
 */
import { routeDefinitions } from './definitions';

export const ROUTE_PREFIX = '/web';

/**
 * Placeholder component for Task 6. Task 7's createApp will replace this
 * with real `() => import('pages/...')` lazy imports. Using a named object
 * keeps Vue Router 3.x happy (it accepts a component options object) and
 * makes test assertions readable.
 */
export const Placeholder = { name: 'RoutePlaceholder' };

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    Object.getOwnPropertyNames(value).forEach((name) => {
      deepFreeze(value[name]);
    });
  }
  return value;
}

function isCapabilityAllowed(route, effectiveCapabilities) {
  if (!route.capability) return true;
  return effectiveCapabilities[route.capability] === true;
}

function isCustomerPolicyAllowed(route, policy) {
  if (!route.requiresCustomerPolicy) return true;
  return policy[route.requiresCustomerPolicy] === true;
}

function isRoleAllowed(route, role, policy) {
  // Public routes (no config) skip the role check entirely.
  if (!route.config) return true;
  if (policy.allow2LevelAdmin !== true) return true;
  return Array.isArray(route.config.auth) && route.config.auth.includes(role);
}

function isModeAllowed(route, mode) {
  // Public routes (no config) skip the mode check.
  if (!route.config) return true;
  return Array.isArray(route.config.mode) && route.config.mode.includes(mode);
}

function shouldIncludeRoute(route, runtimeContext, role, mode) {
  if (!isCapabilityAllowed(route, runtimeContext.effectiveCapabilities)) return false;
  if (!isCustomerPolicyAllowed(route, runtimeContext.policy)) return false;
  if (!isRoleAllowed(route, role, runtimeContext.policy)) return false;
  if (!isModeAllowed(route, mode)) return false;
  return true;
}

function prefixPath(path) {
  if (!path || typeof path !== 'string') return path;
  return ROUTE_PREFIX + path;
}

/**
 * Build a Vue Router route config entry from a static definition, merging
 * guard metadata into `meta`, applying the /web prefix and attaching the
 * placeholder component.
 */
function buildRouteConfig(route, runtimeContext, role, mode) {
  const cfg = {
    path: prefixPath(route.path),
    // Routes with a migrated page use its lazy loader; others stay on the
    // Placeholder until Task 9 migrates them.
    component: route.component || Placeholder,
  };
  if (route.name) cfg.name = route.name;
  if (route.redirect) cfg.redirect = prefixPath(route.redirect);

  // Merge UI meta with guard metadata so installGuards can read everything
  // from `to.meta` without re-deriving the filter.
  const meta = { ...(route.meta || {}) };
  if (route.config) {
    meta.auth = route.config.auth;
    meta.mode = route.config.mode;
  }
  if (route.capability) meta.capability = route.capability;
  if (route.requiresCustomerPolicy) meta.requiresCustomerPolicy = route.requiresCustomerPolicy;
  cfg.meta = meta;

  if (Array.isArray(route.children)) {
    cfg.children = route.children
      .filter((child) => shouldIncludeRoute(child, runtimeContext, role, mode))
      .map((child) => buildRouteConfig(child, runtimeContext, role, mode));
  }

  return cfg;
}

export function createRouteConfig(runtimeContext, role, mode) {
  const routes = routeDefinitions
    .filter((route) => shouldIncludeRoute(route, runtimeContext, role, mode))
    .map((route) => buildRouteConfig(route, runtimeContext, role, mode));

  // Catch-all routes (mirror the legacy m6s router).
  routes.push({ path: '*', redirect: `${ROUTE_PREFIX}/wlan` });
  // Legacy uses unprefixed '/' so that visits to the host root reach login
  // (prefixing would turn '/' into '/web/' and fall through to '*' → wlan).
  routes.push({ path: '/', redirect: `${ROUTE_PREFIX}/login` });

  deepFreeze(routes);
  return routes;
}
