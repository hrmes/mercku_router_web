/**
 * createRouteConfig(runtimeContext) filters static route definitions by
 * customer policy, then returns Vue Router 3.x config.
 *
 * Role and mode are intentionally checked by navigation guards, because both
 * are unknown before login.
 *
 * Route paths stay application-relative (`/dashboard`, `/setting/wifi`).
 * create-app.js configures Vue Router with base `/web/`, which preserves the
 * established browser URL while keeping legacy page navigation compatible.
 *
 * Guard metadata is merged into `meta` for navigation-time checks.
 */
import { routeDefinitions } from './definitions';

export const ROUTER_BASE = '/web/';

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    Object.getOwnPropertyNames(value).forEach((name) => {
      // Vue 2 lazily adds a `_Ctor` cache to component option objects the
      // first time a route is rendered. Route metadata can be immutable,
      // but component definitions are framework-owned mutable objects.
      if (name === 'component') return;
      deepFreeze(value[name]);
    });
  }
  return value;
}

function isCustomerPolicyAllowed(route, policy) {
  if (!route.requiresCustomerPolicy) return true;
  return policy[route.requiresCustomerPolicy] === true;
}

function shouldIncludeRoute(route, runtimeContext) {
  if (
    route.requiresCapability &&
    runtimeContext.effectiveCapabilities[route.requiresCapability] !== true
  ) return false;
  if (!isCustomerPolicyAllowed(route, runtimeContext.policy)) return false;
  return true;
}

/**
 * Build a Vue Router route config entry from a static definition, merging
 * guard metadata into `meta`.
 */
function buildRouteConfig(route, runtimeContext) {
  const cfg = {
    path: route.path,
    component: route.component,
  };
  if (route.name) cfg.name = route.name;
  if (route.redirect) cfg.redirect = route.redirect;

  const meta = { ...(route.meta || {}) };
  if (route.config) {
    meta.auth = route.config.auth;
    meta.mode = route.config.mode;
  }
  if (route.requiresCustomerPolicy) meta.requiresCustomerPolicy = route.requiresCustomerPolicy;
  if (route.requiresCapability) meta.requiresCapability = route.requiresCapability;
  cfg.meta = meta;

  if (Array.isArray(route.children)) {
    cfg.children = route.children
      .filter((child) => shouldIncludeRoute(child, runtimeContext))
      .map((child) => buildRouteConfig(child, runtimeContext));
  }

  return cfg;
}

export function createRouteConfig(runtimeContext) {
  const routes = routeDefinitions
    .filter((route) => shouldIncludeRoute(route, runtimeContext))
    .map((route) => buildRouteConfig(route, runtimeContext));

  routes.push({ path: '*', redirect: '/wlan' });
  routes.push({ path: '/', redirect: '/login' });

  deepFreeze(routes);
  return routes;
}
