/**
 * Static route definitions — the complete route tree with NO filtering applied.
 *
 * §1.3: This file lives under unified/src/app/router/ and therefore MUST NOT
 * reference concrete model/customer identifier strings. It must NOT import
 * `Customers` or `Models` from base/util/constant. Only `Role` and
 * `RouterMode` (non-id enums) are imported.
 *
 * Each route carries:
 *   - name: Vue Router named route (used for programmatic navigation)
 *   - path: in-app path WITHOUT the /web prefix (prefix is applied by
 *     create-router.js so definitions stay prefix-free and testable)
 *   - meta: { layout, hasAside, ... } UI metadata (preserved on output)
 *   - config (optional): { auth: [Role...], mode: [RouterMode...] } — when
 *     present, the route is guarded by installGuards; when absent, the route
 *     is public (login, dashboard, error pages, etc.)
 *   - capability (optional): one of CAPABILITY_KEYS — route is included only
 *     when effectiveCapabilities[capability] === true
 *   - requiresCustomerPolicy (optional): 'allowTelnet' | 'allow2LevelAdmin'
 *     — route is included only when policy[flag] === true
 *   - redirect (optional): redirect path (prefix applied at creation time)
 *   - children (optional): nested routes
 *   - component (optional): lazy loader `() => import('@/pages/...')` for
 *     routes whose page has been migrated to unified/src/pages. Routes
 *     without `component` fall back to `Placeholder` in create-router.js
 *     (Task 9 will migrate the remaining pages).
 *
 * §3.1 / A.3: Schedule, WPS, WAN Ping, Device Limit, LED are common
 * functions — present unconditionally, NOT capability-gated.
 *
 * Capability-gated routes (v1): setting.sfp, setting.powersupply,
 * setting.fan, advance.frozen-config. frozen-config has NO menu entry
 * (A.3) but the route/page exists (A.5) — only models with
 * effectiveCapabilities.frozenConfig can access it.
 *
 * Customer-policy-gated routes: setting.super (allow2LevelAdmin),
 * advance.telnet (allowTelnet).
 *
 * Role auth is a simple array check (auth.includes(role)) — NO DSL.
 */
import { Role, RouterMode } from 'base/util/constant';

// Task 7 sample-chain page loaders. Routes without a `component` field stay
// on the `Placeholder` defined in create-router.js until Task 9 migrates
// the remaining pages. Lazy import keeps each page in its own webpack
// chunk, matching the legacy per-route code-splitting.
const LoginPage = () => import('@/pages/login/index.vue');
const DashboardPage = () => import('@/pages/dashboard/index.vue');
const WlanPage = () => import('@/pages/wlan/index.vue');
const UnconnectPage = () => import('@/pages/error/unconnect/index.vue');
const ModePage = () => import('@/pages/advance/mode.vue');

const allModes = [
  RouterMode.router,
  RouterMode.bridge,
  RouterMode.wirelessBridge,
];

const routerModeOnly = [RouterMode.router];

const bothRoles = [Role.admin, Role.super];
const superOnly = [Role.super];

function bothAllModes() {
  return { auth: bothRoles, mode: allModes };
}

function bothRouterOnly() {
  return { auth: bothRoles, mode: routerModeOnly };
}

function superAllModes() {
  return { auth: superOnly, mode: allModes };
}

function superRouterOnly() {
  return { auth: superOnly, mode: routerModeOnly };
}

const primaryMeta = { layout: 'primary', hasAside: true };

export const routeDefinitions = [
  // --- public routes (no guard) ---
  { name: 'login', path: '/login', meta: {}, component: LoginPage },
  { name: 'dashboard', path: '/dashboard', meta: {}, component: DashboardPage },
  { name: 'wlan', path: '/wlan', meta: {}, component: WlanPage },
  { name: 'unconnect', path: '/unconnect', meta: {}, component: UnconnectPage },
  {
    name: 'device',
    path: '/dashboard/device/:id?',
    meta: { text: 'trans0235', layout: 'primary', parentPath: '/dashboard' },
  },
  {
    name: 'mesh',
    path: '/dashboard/mesh',
    meta: { text: 'trans0312', layout: 'primary', parentPath: '/dashboard' },
  },
  {
    name: 'internet',
    path: '/dashboard/internet',
    meta: { text: 'trans0366', layout: 'primary', parentPath: '/dashboard' },
  },
  {
    name: 'mesh-add',
    path: '/mesh/add',
    meta: { text: 'trans1117', layout: 'primary' },
  },
  {
    name: 'device-limit',
    path: '/limit/:mac',
    redirect: '/limit/:mac/time',
    meta: {},
    children: [
      {
        name: 'device-limit-time',
        path: '/limit/:mac/time',
        meta: { text: 'trans0075', parentPath: '/dashboard/device/primary' },
      },
      {
        name: 'device-limit-url',
        path: '/limit/:mac/url',
        meta: { text: 'trans0076', parentPath: '/dashboard/device/primary' },
      },
    ],
  },

  // --- setting routes ---
  { name: 'wifi', path: '/setting/wifi', meta: primaryMeta, config: bothAllModes() },
  { name: 'wan', path: '/setting/wan', meta: primaryMeta, config: bothRouterOnly() },
  { name: 'wanping', path: '/setting/wanping', meta: { ...primaryMeta, diagnosisMode: 'wanping' }, config: bothRouterOnly() },
  { name: 'ipv6', path: '/setting/ipv6', meta: primaryMeta, config: bothRouterOnly() },
  { name: 'safe', path: '/setting/safe', meta: primaryMeta, config: bothAllModes() },
  {
    name: 'super',
    path: '/setting/super',
    meta: primaryMeta,
    config: bothAllModes(),
    requiresCustomerPolicy: 'allow2LevelAdmin',
  },
  { name: 'blacklist', path: '/setting/blacklist', meta: primaryMeta, config: bothRouterOnly() },
  { name: 'timezone', path: '/setting/timezone', meta: primaryMeta, config: bothAllModes() },
  { name: 'region', path: '/setting/region', meta: primaryMeta, config: bothAllModes() },
  { name: 'guest', path: '/setting/guest', meta: primaryMeta, config: bothRouterOnly() },
  { name: 'upnp', path: '/setting/upnp', meta: primaryMeta, config: bothRouterOnly() },
  // §3.1: LED is a common function (not capability-gated)
  { name: 'led', path: '/setting/led', meta: primaryMeta, config: bothAllModes() },
  // §3.1: Schedule is a common function (not capability-gated)
  { name: 'schedule', path: '/setting/schedule', meta: primaryMeta, config: bothAllModes() },
  // §3.1: WPS is a common function (not capability-gated)
  { name: 'wps', path: '/setting/wps', meta: primaryMeta, config: bothAllModes() },
  // Capability-gated
  { name: 'sfp', path: '/setting/sfp', meta: primaryMeta, config: bothAllModes(), capability: 'sfp' },
  { name: 'powersupply', path: '/setting/powersupply', meta: primaryMeta, config: bothAllModes(), capability: 'poeControl' },
  { name: 'fan', path: '/setting/fan', meta: primaryMeta, config: bothAllModes(), capability: 'fanControl' },

  // --- advance routes ---
  { name: 'portforwarding', path: '/advance/portforwarding', meta: primaryMeta, config: bothRouterOnly() },
  { name: 'dmz', path: '/advance/dmz', meta: primaryMeta, config: bothRouterOnly() },
  { name: 'dhcp', path: '/advance/dhcp', meta: primaryMeta, config: bothRouterOnly() },
  { name: 'rsvdip', path: '/advance/rsvdip', meta: primaryMeta, config: bothRouterOnly() },
  { name: 'mac', path: '/advance/mac', meta: primaryMeta, config: bothRouterOnly() },
  { name: 'ddns', path: '/advance/ddns', meta: primaryMeta, config: bothRouterOnly() },
  { name: 'vpn', path: '/advance/vpn', meta: primaryMeta, config: bothRouterOnly() },
  { name: 'mode', path: '/advance/mode', meta: primaryMeta, config: bothAllModes(), component: ModePage },
  { name: 'diagnosis', path: '/advance/diagnosis', meta: primaryMeta, config: bothRouterOnly() },
  { name: 'log', path: '/advance/log', meta: primaryMeta, config: bothAllModes() },
  { name: 'firewall', path: '/advance/firewall', meta: primaryMeta, config: bothRouterOnly() },
  { name: 'wwa', path: '/advance/wwa', meta: primaryMeta, config: bothRouterOnly() },
  { name: 'tr069', path: '/advance/tr069', meta: primaryMeta, config: superAllModes() },
  {
    name: 'telnet',
    path: '/advance/telnet',
    meta: primaryMeta,
    config: superRouterOnly(),
    requiresCustomerPolicy: 'allowTelnet',
  },
  { name: 'backup', path: '/advance/backup', meta: primaryMeta, config: bothAllModes() },
  // frozen-config: route only, NO menu entry (A.3/A.5); capability-gated.
  { name: 'frozen-config', path: '/advance/frozen-config', meta: primaryMeta, config: bothAllModes(), capability: 'frozenConfig' },

  // --- upgrade routes ---
  { name: 'online', path: '/upgrade/online', meta: primaryMeta, config: bothAllModes() },
  { name: 'offline', path: '/upgrade/offline', meta: primaryMeta, config: bothAllModes() },
  { name: 'auto', path: '/upgrade/auto', meta: primaryMeta, config: bothAllModes() },
];
