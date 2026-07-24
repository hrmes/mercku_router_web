/* eslint-disable import/prefer-default-export */
/**
 * Static menu definitions — the complete menu tree with NO filtering applied.
 *
 * §1.3: This file lives under unified/src/app/menu/ and therefore MUST NOT
 * reference concrete model/customer identifier strings. It must NOT import
 * `Customers` or `Models` from base/util/constant (those carry concrete
 * identifiers). Only `Role` and `RouterMode` (non-id enums) are imported.
 *
 * Each leaf item carries:
 *   - text: i18n key (transNNNN) matching the existing menu.js files
 *   - name: route name (matches router/definitions.js)
 *   - url: application-relative path; Vue Router's base supplies `/web/`
 *   - config: { auth: [Role...], mode: [RouterMode...] }
 *   - requiresCapability (optional): semantic Model Profile capability
 *   - requiresCustomerPolicy (optional): 'allowTelnet' | 'allow2LevelAdmin' —
 *     item is shown only when customerProfile.policy[flag] === true
 *
 * Customer-policy-gated items: setting.super (allow2LevelAdmin),
 * advance.telnet (allowTelnet).
 * Hardware-gated items: setting.sfp, setting.powersupply, setting.fan,
 * advance.frozen-config.
 *
 * Role auth is a simple array check (auth.includes(role)) — NO DSL.
 * The check is applied only when customerProfile.policy.allow2LevelAdmin
 * is true, preserving the existing menu.js behaviour.
 */
import { Role, RouterMode } from 'base/util/constant';

const allModes = [
  RouterMode.router,
  RouterMode.bridge,
  RouterMode.wirelessBridge,
];

const routerModeOnly = [RouterMode.router];

const bothRoles = [Role.admin, Role.super];
const superOnly = [Role.super];

/**
 * Default config for items visible to both roles in all modes.
 */
function bothAllModes() {
  return { auth: bothRoles, mode: allModes };
}

/**
 * Strategy A from the legacy menu.js: both roles, router mode only.
 */
function bothRouterOnly() {
  return { auth: bothRoles, mode: routerModeOnly };
}

/**
 * Super-only auth, all modes.
 */
function superAllModes() {
  return { auth: superOnly, mode: allModes };
}

/**
 * Super-only auth, router mode only.
 */
function superRouterOnly() {
  return { auth: superOnly, mode: routerModeOnly };
}

export const menuDefinitions = [
  {
    icon: 'ic_home_light',
    selectedIcon: 'ic_home_selected',
    text: 'trans0173',
    name: 'dashboard',
    url: '/dashboard',
    children: [],
  },
  {
    icon: 'ic_home_settings_light',
    selectedIcon: 'ic_home_settings_selected',
    text: 'trans0019',
    name: 'setting',
    url: '/setting/wifi',
    children: [
      { text: 'trans0103', name: 'wifi', url: '/setting/wifi', config: bothAllModes() },
      { text: 'trans0142', name: 'wan', url: '/setting/wan', config: bothRouterOnly() },
      { text: 'trans0434', name: 'wanping', url: '/setting/wanping', config: bothRouterOnly() },
      { text: 'trans0620', name: 'ipv6', url: '/setting/ipv6', config: bothRouterOnly() },
      { text: 'trans0561', name: 'safe', url: '/setting/safe', config: bothAllModes() },
      {
        text: 'trans0576',
        name: 'super',
        url: '/setting/super',
        config: bothAllModes(),
        requiresCustomerPolicy: 'allow2LevelAdmin',
      },
      { text: 'trans0020', name: 'blacklist', url: '/setting/blacklist', config: bothRouterOnly() },
      { text: 'trans0272', name: 'timezone', url: '/setting/timezone', config: bothAllModes() },
      { text: 'trans0639', name: 'region', url: '/setting/region', config: bothAllModes() },
      { text: 'trans0538', name: 'guest', url: '/setting/guest', config: bothRouterOnly() },
      { text: 'trans0644', name: 'upnp', url: '/setting/upnp', config: bothRouterOnly() },
      { text: 'trans0779', name: 'led', url: '/setting/led', config: bothAllModes() },
      { text: 'trans0962', name: 'schedule', url: '/setting/schedule', config: bothAllModes() },
      { text: 'trans1168', name: 'wps', url: '/setting/wps', config: bothAllModes() },
      { text: 'SFP', name: 'sfp', url: '/setting/sfp', config: bothAllModes(), requiresCapability: 'sfp' },
      { text: 'trans1239', name: 'powersupply', url: '/setting/powersupply', config: bothAllModes(), requiresCapability: 'poeControl' },
      { text: 'trans1222', name: 'fan', url: '/setting/fan', config: bothAllModes(), requiresCapability: 'fanControl' },
    ],
  },
  {
    icon: 'ic_advanced_settings_light',
    selectedIcon: 'ic_advanced_settings_selected',
    text: 'trans0416',
    name: 'advance',
    url: '/advance/portforwarding',
    children: [
      { text: 'trans0422', name: 'portforwarding', url: '/advance/portforwarding', config: bothRouterOnly() },
      { text: 'trans0420', name: 'dmz', url: '/advance/dmz', config: bothRouterOnly() },
      { text: 'trans0417', name: 'dhcp', url: '/advance/dhcp', config: bothRouterOnly() },
      { text: 'trans0444', name: 'rsvdip', url: '/advance/rsvdip', config: bothRouterOnly() },
      { text: 'trans0474', name: 'mac', url: '/advance/mac', config: bothRouterOnly() },
      { text: 'trans0418', name: 'ddns', url: '/advance/ddns', config: bothRouterOnly() },
      { text: 'trans0402', name: 'vpn', url: '/advance/vpn', config: bothRouterOnly() },
      { text: 'trans0539', name: 'mode', url: '/advance/mode', config: bothAllModes() },
      { text: 'trans0419', name: 'diagnosis', url: '/advance/diagnosis', config: bothRouterOnly() },
      { text: 'trans0421', name: 'log', url: '/advance/log', config: bothAllModes() },
      { text: 'trans0424', name: 'firewall', url: '/advance/firewall', config: bothRouterOnly() },
      { text: 'trans0511', name: 'wwa', url: '/advance/wwa', config: bothRouterOnly() },
      { text: 'trans0499', name: 'tr069', url: '/advance/tr069', config: superAllModes() },
      {
        text: 'trans0497',
        name: 'telnet',
        url: '/advance/telnet',
        config: superRouterOnly(),
        requiresCustomerPolicy: 'allowTelnet',
      },
      { text: 'trans1019', name: 'backup', url: '/advance/backup', config: bothAllModes() },
      { text: 'trans1186', name: 'frozen-config', url: '/advance/frozen-config', config: bothAllModes(), requiresCapability: 'frozenConfig' },
    ],
  },
  {
    icon: 'ic_upgrade_firmware_light',
    selectedIcon: 'ic_upgrade_firmware_selected',
    text: 'trans0197',
    name: 'upgrade',
    url: '/upgrade/online',
    children: [
      { text: 'trans0204', name: 'offline', url: '/upgrade/offline', config: bothAllModes() },
      { text: 'trans0202', name: 'online', url: '/upgrade/online', config: bothAllModes() },
      { text: 'trans0743', name: 'auto', url: '/upgrade/auto', config: bothAllModes() },
    ],
  },
  {
    icon: 'ic_theme_light',
    text: 'trans1119',
    name: 'theme',
    children: [],
  },
];
