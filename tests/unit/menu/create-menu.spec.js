const { expect } = require('chai');

const { compose } = require('../../../unified/src/app/profiles/compose.js');
const {
  createNeutralCustomerProfile,
} = require('../../../unified/src/app/profiles/load.js');
const { CAPABILITY_KEYS } = require('../../../unified/src/app/profiles/capabilities.js');
const { createMenu } = require('../../../unified/src/app/menu/create-menu.js');
const { menuDefinitions } = require('../../../unified/src/app/menu/definitions.js');
const { Role, RouterMode } = require('../../../base/src/util/constant');

const m11r4Profile = require('../../../unified/src/profiles/models/M11R4/profile.json');
const m13r0Profile = require('../../../unified/src/profiles/models/M13R0/profile.json');
const customer0001 = require('../../../unified/src/profiles/customers/0001/profile.json');

/**
 * Build a runtime context from a Model Profile + Customer Profile using the
 * real compose() pipeline. Identity is a minimal valid v1 shape — concrete
 * IDs are intentional here (this is a test fixture, not unified/src code,
 * so §1.3 ID boundaries do not apply).
 */
function composeFixture(modelProfile, customerProfile, detectedCapabilities = {}) {
  const identity = {
    schemaVersion: 1,
    revision: '2026-07-21T10:00:00Z-1',
    modelId: 'TEST_MODEL',
    customerId: 'TEST_CUSTOMER',
    backend: 'mercku_mtk7621',
    detectedCapabilities,
  };
  return compose(identity, modelProfile, customerProfile);
}

function findItem(menu, name) {
  for (const top of menu) {
    if (top.name === name) return top;
    if (Array.isArray(top.children)) {
      const child = top.children.find((c) => c.name === name);
      if (child) return child;
    }
  }
  return null;
}

function isPresent(menu, name) {
  return findItem(menu, name) !== null;
}

function isDisabled(menu, name) {
  const item = findItem(menu, name);
  if (!item) return null;
  return item.disabled === true;
}

/**
 * Customer profile that enables both allowTelnet and allow2LevelAdmin, used
 * to exercise the customer-policy-gated menu items (super, telnet).
 */
function customerWithAllPolicies() {
  return {
    ...customer0001,
    policy: {
      disabledCapabilities: [],
      allow2LevelAdmin: true,
      allowTelnet: true,
    },
  };
}

describe('createMenu(runtimeContext, role, mode)', () => {
  describe('table-driven: model + customer + role + mode combinations', () => {
    const cases = [
      {
        label: 'M11R4+0001 admin/router: no caps, no telnet, no super',
        model: m11r4Profile,
        customer: customer0001,
        role: Role.admin,
        mode: RouterMode.router,
        expected: {
          sfp: false,
          fan: false,
          powersupply: false,
          telnet: false,
          super: false,
          wifi: true,
          wps: true,
          led: true,
          schedule: true,
          wanping: true,
          tr069: true,
        },
      },
      {
        label: 'M11R4+0001 super/router: tr069 visible, super still hidden by policy',
        model: m11r4Profile,
        customer: customer0001,
        role: Role.super,
        mode: RouterMode.router,
        expected: {
          tr069: true,
          telnet: false,
          super: false,
          fan: false,
        },
      },
      {
        label: 'M13R0+0001 admin/router: fan shown (M13R0 fanControl, 0001 no disable)',
        model: m13r0Profile,
        customer: customer0001,
        role: Role.admin,
        mode: RouterMode.router,
        expected: {
          sfp: false,
          fan: true,
          powersupply: false,
          telnet: false,
          super: false,
        },
      },
      {
        label: 'M13R0+neutral admin/router: fan hidden (neutral disables fanControl)',
        model: m13r0Profile,
        customer: createNeutralCustomerProfile(),
        role: Role.admin,
        mode: RouterMode.router,
        expected: {
          sfp: false,
          fan: false,
          powersupply: false,
          telnet: false,
          super: false,
        },
      },
      {
        label: 'M11R4+neutral admin/router: all capability-gated items hidden',
        model: m11r4Profile,
        customer: createNeutralCustomerProfile(),
        role: Role.admin,
        mode: RouterMode.router,
        expected: {
          sfp: false,
          fan: false,
          powersupply: false,
          telnet: false,
          super: false,
        },
      },
      {
        label: 'M11R4+allPolicies admin/router: super+telnet shown, telnet admin-hidden',
        model: m11r4Profile,
        customer: customerWithAllPolicies(),
        role: Role.admin,
        mode: RouterMode.router,
        expected: {
          super: true,
          telnet: false,
          tr069: false,
          fan: false,
        },
      },
      {
        label: 'M11R4+allPolicies super/router: super+telnet+tr069 all shown',
        model: m11r4Profile,
        customer: customerWithAllPolicies(),
        role: Role.super,
        mode: RouterMode.router,
        expected: {
          super: true,
          telnet: true,
          tr069: true,
          fan: false,
        },
      },
    ];

    cases.forEach(({ label, model, customer, role, mode, expected }) => {
      it(label, () => {
        const ctx = composeFixture(model, customer);
        const menu = createMenu(ctx, role, mode);
        Object.entries(expected).forEach(([itemName, shouldPresent]) => {
          const present = isPresent(menu, itemName);
          expect(
            present,
            `${itemName} should be ${shouldPresent ? 'present' : 'absent'}`
          ).to.equal(shouldPresent);
        });
      });
    });
  });

  describe('mode disables (item visible but disabled=true)', () => {
    it('marks router-only items as disabled in bridge mode', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const menu = createMenu(ctx, Role.admin, RouterMode.bridge);
      // wan is strategyA (router-only) — present but disabled
      expect(isPresent(menu, 'wan')).to.equal(true);
      expect(isDisabled(menu, 'wan')).to.equal(true);
      // wifi is all-modes — present and not disabled
      expect(isPresent(menu, 'wifi')).to.equal(true);
      expect(isDisabled(menu, 'wifi')).to.equal(false);
    });

    it('marks router-only items as disabled in wirelessBridge mode', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const menu = createMenu(ctx, Role.admin, RouterMode.wirelessBridge);
      expect(isDisabled(menu, 'wan')).to.equal(true);
      expect(isDisabled(menu, 'wifi')).to.equal(false);
    });

    it('keeps router-only items enabled in router mode', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const menu = createMenu(ctx, Role.admin, RouterMode.router);
      expect(isDisabled(menu, 'wan')).to.equal(false);
      expect(isDisabled(menu, 'wifi')).to.equal(false);
    });
  });

  describe('parent url points to first non-disabled child', () => {
    it('setting parent url points to first enabled child', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const menu = createMenu(ctx, Role.admin, RouterMode.router);
      const setting = menu.find((m) => m.name === 'setting');
      expect(setting).to.exist;
      // wifi is the first child and is enabled in all modes
      expect(setting.url).to.equal('/setting/wifi');
    });

    it('advance parent url points to first enabled child', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const menu = createMenu(ctx, Role.admin, RouterMode.router);
      const advance = menu.find((m) => m.name === 'advance');
      expect(advance).to.exist;
      // portforwarding is first child, strategyA (router-only), enabled in router mode
      expect(advance.url).to.equal('/advance/portforwarding');
    });
  });

  describe('customer disabledCapabilities overrides model baseline', () => {
    it('hides fan when customer disables fanControl even if model has it', () => {
      const customerDisablingFan = {
        ...customer0001,
        policy: {
          ...customer0001.policy,
          disabledCapabilities: ['fanControl'],
        },
      };
      const ctx = composeFixture(m13r0Profile, customerDisablingFan);
      const menu = createMenu(ctx, Role.admin, RouterMode.router);
      expect(isPresent(menu, 'fan'), 'fan should be hidden when customer disables fanControl').to.equal(false);
    });
  });

  describe('output shape preserves old menu.js contract', () => {
    it('returns top-level array with dashboard/setting/advance/upgrade/theme', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const menu = createMenu(ctx, Role.admin, RouterMode.router);
      expect(menu).to.be.an('array');
      expect(menu.length).to.equal(5);
      const names = menu.map((m) => m.name || m.text);
      expect(names).to.include('dashboard');
      expect(names).to.include('setting');
      expect(names).to.include('advance');
      expect(names).to.include('upgrade');
    });

    it('top-level items have icon/selectedIcon/text/url/children', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const menu = createMenu(ctx, Role.admin, RouterMode.router);
      const setting = menu.find((m) => m.name === 'setting');
      expect(setting).to.have.property('icon');
      expect(setting).to.have.property('selectedIcon');
      expect(setting).to.have.property('text');
      expect(setting).to.have.property('url');
      expect(setting).to.have.property('children');
      expect(setting.children).to.be.an('array').with.length.greaterThan(0);
    });

    it('children have text/name/url/config/disabled', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const menu = createMenu(ctx, Role.admin, RouterMode.router);
      const wifi = findItem(menu, 'wifi');
      expect(wifi).to.have.property('text');
      expect(wifi).to.have.property('name');
      expect(wifi).to.have.property('url');
      expect(wifi).to.have.property('config');
      expect(wifi).to.have.property('disabled');
    });
  });

  describe('capability gating uses only the 4 v1 keys (no aliasing)', () => {
    it('does not invent new capability keys in definitions', () => {
      const declaredCaps = new Set(CAPABILITY_KEYS);
      const usedCaps = new Set();
      function walk(items) {
        items.forEach((item) => {
          if (item.capability) usedCaps.add(item.capability);
          if (Array.isArray(item.children)) walk(item.children);
        });
      }
      walk(menuDefinitions);
      usedCaps.forEach((cap) => {
        expect(declaredCaps.has(cap), `unknown capability key "${cap}" not in CAPABILITY_KEYS`).to.equal(true);
      });
    });
  });

  describe('frozen output (defensive)', () => {
    it('returns a frozen menu tree', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const menu = createMenu(ctx, Role.admin, RouterMode.router);
      expect(Object.isFrozen(menu)).to.equal(true);
    });
  });
});
