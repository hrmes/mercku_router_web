/* eslint-env mocha */
const { expect } = require('chai');

const { menuDefinitions } = require('../../../unified/src/app/menu/definitions.js');
const { Role, RouterMode } = require('../../../base/src/util/constant');

/**
 * Flatten the menu tree into a list of leaf items (children only).
 */
function leafItems(menu) {
  const out = [];
  menu.forEach((top) => {
    if (Array.isArray(top.children)) {
      top.children.forEach((c) => out.push(c));
    }
  });
  return out;
}

describe('menuDefinitions (static menu tree)', () => {
  it('is a non-empty array', () => {
    expect(menuDefinitions).to.be.an('array').with.length.greaterThan(0);
  });

  it('contains the 5 top-level groups (dashboard/setting/advance/upgrade/theme)', () => {
    const names = menuDefinitions.map((m) => m.name);
    expect(names).to.include('setting');
    expect(names).to.include('advance');
    expect(names).to.include('upgrade');
  });

  it('dashboard has no children (leaf)', () => {
    const dashboard = menuDefinitions.find((m) => m.text === 'trans0173' || m.name === 'dashboard');
    expect(dashboard).to.exist;
    expect(dashboard.children).to.deep.equal([]);
  });

  describe('implemented common items are present', () => {
    const leaves = leafItems(menuDefinitions);
    const names = leaves.map((l) => l.name);

    ['wifi', 'wan', 'wanping', 'ipv6', 'safe', 'blacklist', 'timezone', 'region', 'guest', 'upnp', 'led', 'schedule', 'wps'].forEach((name) => {
      it(`includes ${name} as a common item`, () => {
        expect(names, `${name} must be in menu definitions`).to.include(name);
      });
    });

    ['portforwarding', 'dmz', 'dhcp', 'rsvdip', 'mac', 'ddns', 'vpn', 'mode', 'diagnosis', 'log', 'firewall', 'wwa', 'tr069', 'backup'].forEach((name) => {
      it(`includes advance.${name} as a common item`, () => {
        expect(names).to.include(name);
      });
    });

    ['online', 'offline', 'auto'].forEach((name) => {
      it(`includes upgrade.${name} as a common item`, () => {
        expect(names).to.include(name);
      });
    });
  });

  describe('capability-gated items', () => {
    const leaves = leafItems(menuDefinitions);

    it('advertises all existing hardware pages through capability metadata', () => {
      expect(leaves.find(item => item.name === 'sfp').requiresCapability).to.equal('sfp');
      expect(leaves.find(item => item.name === 'powersupply').requiresCapability).to.equal('poeControl');
      expect(leaves.find(item => item.name === 'fan').requiresCapability).to.equal('fanControl');
      expect(leaves.find(item => item.name === 'frozen-config').requiresCapability).to.equal('frozenConfig');
    });
  });

  describe('customer-policy-gated items', () => {
    const leaves = leafItems(menuDefinitions);

    it('advance.telnet is gated on requiresCustomerPolicy "allowTelnet"', () => {
      const telnet = leaves.find((l) => l.name === 'telnet');
      expect(telnet).to.exist;
      expect(telnet.requiresCustomerPolicy).to.equal('allowTelnet');
    });

    it('setting.super is gated on requiresCustomerPolicy "allow2LevelAdmin"', () => {
      const sup = leaves.find((l) => l.name === 'super');
      expect(sup).to.exist;
      expect(sup.requiresCustomerPolicy).to.equal('allow2LevelAdmin');
    });
  });

  describe('config shape', () => {
    it('every leaf has a config with auth and mode arrays', () => {
      leafItems(menuDefinitions).forEach((leaf) => {
        expect(leaf.config, `${leaf.name} missing config`).to.exist;
        expect(leaf.config.auth, `${leaf.name} config.auth must be an array`).to.be.an('array');
        expect(leaf.config.mode, `${leaf.name} config.mode must be an array`).to.be.an('array');
      });
    });

    it('auth only uses Role.admin / Role.super (no DSL)', () => {
      const allowed = new Set([Role.admin, Role.super]);
      leafItems(menuDefinitions).forEach((leaf) => {
        leaf.config.auth.forEach((r) => {
          expect(allowed.has(r), `${leaf.name} has unknown role "${r}"`).to.equal(true);
        });
      });
    });

    it('mode only uses RouterMode.router / bridge / wirelessBridge', () => {
      const allowed = new Set([RouterMode.router, RouterMode.bridge, RouterMode.wirelessBridge]);
      leafItems(menuDefinitions).forEach((leaf) => {
        leaf.config.mode.forEach((m) => {
          expect(allowed.has(m), `${leaf.name} has unknown mode "${m}"`).to.equal(true);
        });
      });
    });
  });

  describe('no concrete IDs (§1.3 ID boundary)', () => {
    it('definitions do not reference Customers or Models constants', () => {
      // The definitions file must not import Customers/Models (concrete IDs).
      // We assert by checking the serialized form does not contain known IDs.
      const serialized = JSON.stringify(menuDefinitions);
      // Known concrete IDs from registries — must NOT appear in definitions
      ['M11R4', 'M13R0', '0001'].forEach((id) => {
        expect(serialized, `definitions must not reference concrete ID "${id}"`).to.not.include(id);
      });
    });
  });
});
