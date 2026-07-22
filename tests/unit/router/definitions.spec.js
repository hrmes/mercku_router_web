const { expect } = require('chai');

const { routeDefinitions } = require('../../../unified/src/app/router/definitions.js');
const { Role, RouterMode } = require('../../../base/src/util/constant');
const { CAPABILITY_KEYS } = require('../../../unified/src/app/profiles/capabilities.js');

/**
 * Flatten route definitions, including children, into a single list.
 */
function flattenRoutes(routes) {
  const out = [];
  routes.forEach((r) => {
    out.push(r);
    if (Array.isArray(r.children)) {
      r.children.forEach((c) => out.push(c));
    }
  });
  return out;
}

describe('routeDefinitions (static route tree)', () => {
  it('is a non-empty array', () => {
    expect(routeDefinitions).to.be.an('array').with.length.greaterThan(0);
  });

  describe('common routes are present', () => {
    const all = flattenRoutes(routeDefinitions);
    const names = all.map((r) => r.name).filter(Boolean);

    [
      'login', 'dashboard', 'wlan', 'unconnect',
      'device', 'mesh', 'internet', 'mesh-add',
      'device-limit', 'device-limit-time', 'device-limit-url',
      'wifi', 'wan', 'wanping', 'ipv6', 'safe', 'super', 'blacklist',
      'timezone', 'region', 'guest', 'upnp', 'led', 'schedule', 'wps',
      'sfp', 'powersupply', 'fan',
      'portforwarding', 'dmz', 'dhcp', 'rsvdip', 'mac', 'ddns', 'vpn',
      'mode', 'diagnosis', 'log', 'firewall', 'wwa', 'tr069', 'telnet',
      'backup', 'frozen-config',
      'online', 'offline', 'auto',
    ].forEach((name) => {
      it(`includes route named "${name}"`, () => {
        expect(names, `route "${name}" must be in definitions`).to.include(name);
      });
    });
  });

  describe('capability-gated routes', () => {
    const all = flattenRoutes(routeDefinitions);

    it('setting.sfp route is gated on capability "sfp"', () => {
      const r = all.find((x) => x.name === 'sfp');
      expect(r.capability).to.equal('sfp');
    });

    it('setting.powersupply route is gated on capability "poeControl"', () => {
      const r = all.find((x) => x.name === 'powersupply');
      expect(r.capability).to.equal('poeControl');
    });

    it('setting.fan route is gated on capability "fanControl"', () => {
      const r = all.find((x) => x.name === 'fan');
      expect(r.capability).to.equal('fanControl');
    });

    it('advance.frozen-config route is gated on capability "frozenConfig"', () => {
      const r = all.find((x) => x.name === 'frozen-config');
      expect(r).to.exist;
      expect(r.capability).to.equal('frozenConfig');
    });

    it('all capability keys used are in CAPABILITY_KEYS (no aliasing)', () => {
      const used = new Set();
      flattenRoutes(routeDefinitions).forEach((r) => {
        if (r.capability) used.add(r.capability);
      });
      used.forEach((cap) => {
        expect(CAPABILITY_KEYS, `unknown capability "${cap}"`).to.include(cap);
      });
    });
  });

  describe('customer-policy-gated routes', () => {
    const all = flattenRoutes(routeDefinitions);

    it('advance.telnet is gated on requiresCustomerPolicy "allowTelnet"', () => {
      const r = all.find((x) => x.name === 'telnet');
      expect(r.requiresCustomerPolicy).to.equal('allowTelnet');
    });

    it('setting.super is gated on requiresCustomerPolicy "allow2LevelAdmin"', () => {
      const r = all.find((x) => x.name === 'super');
      expect(r.requiresCustomerPolicy).to.equal('allow2LevelAdmin');
    });
  });

  describe('no concrete IDs (§1.3 ID boundary)', () => {
    it('definitions do not reference concrete model/customer IDs', () => {
      const serialized = JSON.stringify(routeDefinitions);
      ['M11R4', 'M13R0', '0001'].forEach((id) => {
        expect(serialized, `must not reference "${id}"`).to.not.include(id);
      });
    });
  });
});
