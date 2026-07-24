/* eslint-disable import/prefer-default-export */
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
 *   - path: application-relative path; Vue Router's `/web/` base supplies
 *     the browser-facing prefix
 *   - meta: { layout, hasAside, ... } UI metadata (preserved on output)
 *   - config (optional): { auth: [Role...], mode: [RouterMode...] } — when
 *     present, the route is guarded by installGuards; when absent, the route
 *     is public (login, dashboard, error pages, etc.)
 *   - requiresCapability (optional): semantic Model Profile capability
 *   - requiresCustomerPolicy (optional): 'allowTelnet' | 'allow2LevelAdmin'
 *     — route is included only when policy[flag] === true
 *   - redirect (optional): application-relative redirect path
 *   - children (optional): nested routes
 *   - component: lazy loader for a real, supported page
 *
 * Customer-policy-gated routes: setting.super (allow2LevelAdmin),
 * advance.telnet (allowTelnet).
 * Hardware-gated routes: setting.sfp, setting.powersupply, setting.fan,
 * advance.frozen-config.
 *
 * Role auth is a simple array check (auth.includes(role)) — NO DSL.
 */
import { Role, RouterMode } from 'base/util/constant';

// Lazy imports preserve the legacy per-route code splitting.
const LoginPage = () => import('../../../../m6s/src/pages/login/index.vue');
const DashboardPage = () => import('base/pages/bussiness/dashboard/index.vue');
const WlanPage = () => import('@/pages/wlan/index.vue');
const UnconnectPage = () => import('@/pages/error/unconnect/index.vue');
const ModePage = () => import('@/pages/advance/mode.vue');
const DevicePage = () => import('base/pages/bussiness/dashboard/device.vue');
const MeshPage = () => import('base/pages/bussiness/dashboard/mesh.vue');
const MeshAddPage = () => import('../../../../m6s/src/pages/bussiness/mesh/add.vue');
const InternetPage = () => import('base/pages/bussiness/dashboard/internet.vue');
const DeviceLimitPage = () => import('base/pages/bussiness/dashboard/limit/index.vue');
const DeviceLimitTimePage = () => import('base/pages/bussiness/dashboard/limit/time.vue');
const DeviceLimitUrlPage = () => import('base/pages/bussiness/dashboard/limit/blacklist.vue');
const WifiPage = () => import('base/pages/bussiness/setting/wifi.vue');
const WanPage = () => import('base/pages/bussiness/setting/wan.vue');
const Ipv6Page = () => import('base/pages/bussiness/setting/ipv6.vue');
const SafePage = () => import('base/pages/bussiness/setting/safe.vue');
const SuperPage = () => import('base/pages/bussiness/setting/super.vue');
const BlacklistPage = () => import('base/pages/bussiness/setting/blacklist.vue');
const TimezonePage = () => import('base/pages/bussiness/setting/timezone.vue');
const RegionPage = () => import('base/pages/bussiness/setting/region.vue');
const GuestPage = () => import('base/pages/bussiness/setting/guest.vue');
const UpnpPage = () => import('base/pages/bussiness/setting/upnp.vue');
const LedPage = () => import('base/pages/bussiness/setting/led.vue');
const SchedulePage = () => import('base/pages/bussiness/setting/wifi-schedule.vue');
const WpsPage = () => import('base/pages/bussiness/setting/wps.vue');
const SfpPage = () => import('../../../../m6s/src/pages/bussiness/setting/sfp.vue');
const PowerSupplyPage = () => import('../../../../m6s_poe/src/pages/bussiness/setting/powersupply.vue');
const FanPage = () => import('../../../../nano/src/pages/bussiness/setting/fan.vue');
const PortForwardingPage = () => import('base/pages/bussiness/advance/port/index.vue');
const DmzPage = () => import('base/pages/bussiness/advance/dmz.vue');
const DhcpPage = () => import('base/pages/bussiness/advance/dhcp.vue');
const ReservedIpPage = () => import('base/pages/bussiness/advance/rsvdip/index.vue');
const MacPage = () => import('base/pages/bussiness/advance/mac.vue');
const DdnsPage = () => import('base/pages/bussiness/advance/ddns.vue');
const VpnPage = () => import('base/pages/bussiness/advance/vpn/index.vue');
const DiagnosisPage = () => import('base/pages/bussiness/advance/diagnosis.vue');
const LogPage = () => import('base/pages/bussiness/advance/log.vue');
const FirewallPage = () => import('base/pages/bussiness/advance/firewall.vue');
const WwaPage = () => import('base/pages/bussiness/advance/wwa.vue');
const Tr069Page = () => import('base/pages/bussiness/advance/tr069.vue');
const TelnetPage = () => import('base/pages/bussiness/advance/telnet.vue');
const BackupPage = () => import('base/pages/bussiness/advance/backup.vue');
const FrozenConfigPage = () => import('../../../../m6a/src/pages/bussiness/advance/frozen-config/index.vue');
const OnlineUpgradePage = () => import('base/pages/bussiness/upgrade/online.vue');
const OfflineUpgradePage = () => import('base/pages/bussiness/upgrade/offline.vue');
const AutoUpgradePage = () => import('base/pages/bussiness/upgrade/auto.vue');

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
const primaryLayoutOnly = { layout: 'primary' };

export const routeDefinitions = [
  // --- public routes (no guard) ---
  { name: 'login', path: '/login', meta: {}, component: LoginPage },
  { name: 'dashboard', path: '/dashboard', meta: primaryLayoutOnly, component: DashboardPage },
  { name: 'wlan', path: '/wlan', meta: {}, component: WlanPage },
  { name: 'unconnect', path: '/unconnect', meta: {}, component: UnconnectPage },
  {
    name: 'device',
    path: '/dashboard/device/:id?',
    component: DevicePage,
    meta: { text: 'trans0235', ...primaryLayoutOnly, parentPath: '/dashboard' },
  },
  {
    name: 'mesh',
    path: '/dashboard/mesh',
    component: MeshPage,
    meta: { text: 'trans0312', ...primaryLayoutOnly, parentPath: '/dashboard' },
  },
  {
    name: 'mesh-add',
    path: '/mesh/add',
    component: MeshAddPage,
    meta: { text: 'trans1117', ...primaryLayoutOnly },
  },
  {
    name: 'internet',
    path: '/dashboard/internet',
    component: InternetPage,
    meta: { text: 'trans0366', ...primaryLayoutOnly, parentPath: '/dashboard' },
  },
  {
    name: 'device-limit',
    path: '/limit/:mac',
    component: DeviceLimitPage,
    redirect: '/limit/:mac/time',
    meta: {},
    children: [
      {
        name: 'device-limit-time',
        path: '/limit/:mac/time',
        component: DeviceLimitTimePage,
        meta: { text: 'trans0075', parentPath: '/dashboard/device/primary' },
      },
      {
        name: 'device-limit-url',
        path: '/limit/:mac/url',
        component: DeviceLimitUrlPage,
        meta: { text: 'trans0076', parentPath: '/dashboard/device/primary' },
      },
    ],
  },

  // --- setting routes ---
  { name: 'wifi', path: '/setting/wifi', component: WifiPage, meta: primaryMeta, config: bothAllModes() },
  { name: 'wan', path: '/setting/wan', component: WanPage, meta: primaryMeta, config: bothRouterOnly() },
  { name: 'wanping', path: '/setting/wanping', component: DiagnosisPage, meta: { ...primaryMeta, diagnosisMode: 'wanping' }, config: bothRouterOnly() },
  { name: 'ipv6', path: '/setting/ipv6', component: Ipv6Page, meta: primaryMeta, config: bothRouterOnly() },
  { name: 'safe', path: '/setting/safe', component: SafePage, meta: primaryMeta, config: bothAllModes() },
  {
    name: 'super',
    path: '/setting/super',
    component: SuperPage,
    meta: primaryMeta,
    config: bothAllModes(),
    requiresCustomerPolicy: 'allow2LevelAdmin',
  },
  { name: 'blacklist', path: '/setting/blacklist', component: BlacklistPage, meta: primaryMeta, config: bothRouterOnly() },
  { name: 'timezone', path: '/setting/timezone', component: TimezonePage, meta: primaryMeta, config: bothAllModes() },
  { name: 'region', path: '/setting/region', component: RegionPage, meta: primaryMeta, config: bothAllModes() },
  { name: 'guest', path: '/setting/guest', component: GuestPage, meta: primaryMeta, config: bothRouterOnly() },
  { name: 'upnp', path: '/setting/upnp', component: UpnpPage, meta: primaryMeta, config: bothRouterOnly() },
  { name: 'led', path: '/setting/led', component: LedPage, meta: primaryMeta, config: bothAllModes() },
  { name: 'schedule', path: '/setting/schedule', component: SchedulePage, meta: primaryMeta, config: bothAllModes() },
  { name: 'wps', path: '/setting/wps', component: WpsPage, meta: primaryMeta, config: bothAllModes() },
  {
    name: 'sfp',
    path: '/setting/sfp',
    component: SfpPage,
    meta: primaryMeta,
    config: bothAllModes(),
    requiresCapability: 'sfp',
  },
  {
    name: 'powersupply',
    path: '/setting/powersupply',
    component: PowerSupplyPage,
    meta: primaryMeta,
    config: bothAllModes(),
    requiresCapability: 'poeControl',
  },
  {
    name: 'fan',
    path: '/setting/fan',
    component: FanPage,
    meta: primaryMeta,
    config: bothAllModes(),
    requiresCapability: 'fanControl',
  },
  // --- advance routes ---
  { name: 'portforwarding', path: '/advance/portforwarding', component: PortForwardingPage, meta: primaryMeta, config: bothRouterOnly() },
  { name: 'dmz', path: '/advance/dmz', component: DmzPage, meta: primaryMeta, config: bothRouterOnly() },
  { name: 'dhcp', path: '/advance/dhcp', component: DhcpPage, meta: primaryMeta, config: bothRouterOnly() },
  { name: 'rsvdip', path: '/advance/rsvdip', component: ReservedIpPage, meta: primaryMeta, config: bothRouterOnly() },
  { name: 'mac', path: '/advance/mac', component: MacPage, meta: primaryMeta, config: bothRouterOnly() },
  { name: 'ddns', path: '/advance/ddns', component: DdnsPage, meta: primaryMeta, config: bothRouterOnly() },
  { name: 'vpn', path: '/advance/vpn', component: VpnPage, meta: primaryMeta, config: bothRouterOnly() },
  { name: 'mode', path: '/advance/mode', meta: primaryMeta, config: bothAllModes(), component: ModePage },
  { name: 'diagnosis', path: '/advance/diagnosis', component: DiagnosisPage, meta: primaryMeta, config: bothRouterOnly() },
  { name: 'log', path: '/advance/log', component: LogPage, meta: primaryMeta, config: bothAllModes() },
  { name: 'firewall', path: '/advance/firewall', component: FirewallPage, meta: primaryMeta, config: bothRouterOnly() },
  { name: 'wwa', path: '/advance/wwa', component: WwaPage, meta: primaryMeta, config: bothRouterOnly() },
  { name: 'tr069', path: '/advance/tr069', component: Tr069Page, meta: primaryMeta, config: superAllModes() },
  {
    name: 'telnet',
    path: '/advance/telnet',
    component: TelnetPage,
    meta: primaryMeta,
    config: superRouterOnly(),
    requiresCustomerPolicy: 'allowTelnet',
  },
  { name: 'backup', path: '/advance/backup', component: BackupPage, meta: primaryMeta, config: bothAllModes() },
  {
    name: 'frozen-config',
    path: '/advance/frozen-config',
    component: FrozenConfigPage,
    meta: primaryMeta,
    config: bothAllModes(),
    requiresCapability: 'frozenConfig',
  },
  // --- upgrade routes ---
  { name: 'online', path: '/upgrade/online', component: OnlineUpgradePage, meta: primaryMeta, config: bothAllModes() },
  { name: 'offline', path: '/upgrade/offline', component: OfflineUpgradePage, meta: primaryMeta, config: bothAllModes() },
  { name: 'auto', path: '/upgrade/auto', component: AutoUpgradePage, meta: primaryMeta, config: bothAllModes() },
];
