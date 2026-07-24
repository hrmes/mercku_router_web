/* eslint-env mocha */
const { expect } = require('chai');

const { routeDefinitions } = require('../../../unified/src/app/router/definitions.js');

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

  it('loads the existing M6s login page instead of a unified copy', async () => {
    const loginRoute = routeDefinitions.find(route => route.name === 'login');
    const module = await loginRoute.component();
    expect(module.default.__file).to.match(/m6s\/src\/pages\/login\/index\.vue$/);
  });

  describe('common routes are present', () => {
    const all = flattenRoutes(routeDefinitions);
    const names = all.map((r) => r.name).filter(Boolean);

    [
      'login', 'dashboard', 'wlan', 'unconnect',
      'device', 'mesh', 'mesh-add', 'internet',
      'device-limit', 'device-limit-time', 'device-limit-url',
      'wifi', 'wan', 'wanping', 'ipv6', 'safe', 'super', 'blacklist',
      'timezone', 'region', 'guest', 'upnp', 'led', 'schedule', 'wps',
      'portforwarding', 'dmz', 'dhcp', 'rsvdip', 'mac', 'ddns', 'vpn',
      'mode', 'diagnosis', 'log', 'firewall', 'wwa', 'tr069', 'telnet',
      'backup',
      'sfp', 'powersupply', 'fan', 'frozen-config',
      'online', 'offline', 'auto',
    ].forEach((name) => {
      it(`includes route named "${name}"`, () => {
        expect(names, `route "${name}" must be in definitions`).to.include(name);
      });
    });
  });

  describe('capability routes reuse existing model pages', () => {
    const all = flattenRoutes(routeDefinitions);

    [
      ['mesh-add', /m6s\/src\/pages\/bussiness\/mesh\/add\.vue$/],
      ['sfp', /m6s\/src\/pages\/bussiness\/setting\/sfp\.vue$/],
      ['powersupply', /m6s_poe\/src\/pages\/bussiness\/setting\/powersupply\.vue$/],
      ['fan', /nano\/src\/pages\/bussiness\/setting\/fan\.vue$/],
      ['frozen-config', /m6a\/src\/pages\/bussiness\/advance\/frozen-config\/index\.vue$/],
    ].forEach(([name, filePattern]) => {
      it(`${name} loads its existing implementation`, async () => {
        const route = all.find(candidate => candidate.name === name);
        expect(route, `${name} route`).to.exist;
        const module = await route.component();
        expect(module.default.__file).to.match(filePattern);
      });
    });

    it('declares the hardware capability required by each optional route', () => {
      expect(all.find(route => route.name === 'sfp').requiresCapability).to.equal('sfp');
      expect(all.find(route => route.name === 'powersupply').requiresCapability).to.equal('poeControl');
      expect(all.find(route => route.name === 'fan').requiresCapability).to.equal('fanControl');
      expect(all.find(route => route.name === 'frozen-config').requiresCapability).to.equal('frozenConfig');
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
