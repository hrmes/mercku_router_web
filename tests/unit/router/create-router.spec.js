const { expect } = require('chai');

const { compose } = require('../../../unified/src/app/profiles/compose.js');
const {
  createNeutralCustomerProfile,
} = require('../../../unified/src/app/profiles/load.js');
const {
  createRouteConfig,
  ROUTE_PREFIX,
} = require('../../../unified/src/app/router/create-router.js');
const { Role, RouterMode } = require('../../../base/src/util/constant');

const m11r4Profile = require('../../../unified/src/profiles/models/M11R4/profile.json');
const m13r0Profile = require('../../../unified/src/profiles/models/M13R0/profile.json');
const customer0001 = require('../../../unified/src/profiles/customers/0001/profile.json');

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

function findRoute(routes, name) {
  for (const r of routes) {
    if (r.name === name) return r;
    if (Array.isArray(r.children)) {
      const child = r.children.find((c) => c.name === name);
      if (child) return child;
    }
  }
  return null;
}

function hasRoute(routes, name) {
  return findRoute(routes, name) !== null;
}

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

describe('createRouteConfig(runtimeContext, role, mode)', () => {
  describe('ROUTE_PREFIX', () => {
    it('exposes "/web" as the route prefix', () => {
      expect(ROUTE_PREFIX).to.equal('/web');
    });
  });

  describe('/web prefix applied to all routes', () => {
    it('prepends /web to every named route path (catch-all "*" and unprefixed root "/" excluded)', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const routes = createRouteConfig(ctx, Role.admin, RouterMode.router);
      routes.forEach((r) => {
        if (r.path && r.path !== '*' && r.path !== '/') {
          expect(r.path, `path "${r.path}" must start with /web`).to.match(/^\/web/);
        }
      });
    });

    it('prepends /web to redirect paths', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const routes = createRouteConfig(ctx, Role.admin, RouterMode.router);
      routes.forEach((r) => {
        if (r.redirect && typeof r.redirect === 'string') {
          expect(r.redirect).to.match(/^\/web/);
        }
      });
    });
  });

  describe('named routes', () => {
    it('every filtered route has a name (catch-all "*" and unprefixed root "/" excluded)', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const routes = createRouteConfig(ctx, Role.admin, RouterMode.router);
      routes.forEach((r) => {
        if (r.path && !r.path.includes(':') && r.path !== '*' && r.path !== '/') {
          expect(r.name, `route "${r.path}" must have a name`).to.be.a('string');
        }
      });
    });
  });

  describe('placeholder components', () => {
    it('every route has a component (placeholder for Task 7)', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const routes = createRouteConfig(ctx, Role.admin, RouterMode.router);
      routes.forEach((r) => {
        if (r.name) {
          expect(r.component, `route "${r.name}" must have a component`).to.exist;
        }
      });
    });
  });

  describe('table-driven: capability filtering', () => {
    const cases = [
      {
        label: 'M11R4+0001 admin/router: no sfp/fan/powersupply/frozen-config routes',
        model: m11r4Profile,
        customer: customer0001,
        role: Role.admin,
        mode: RouterMode.router,
        expected: { sfp: false, fan: false, powersupply: false, 'frozen-config': false, wifi: true, wan: true },
      },
      {
        label: 'M13R0+0001 admin/router: fan route present (fanControl cap)',
        model: m13r0Profile,
        customer: customer0001,
        role: Role.admin,
        mode: RouterMode.router,
        expected: { sfp: false, fan: true, powersupply: false, 'frozen-config': false },
      },
      {
        label: 'M13R0+neutral admin/router: fan route hidden (neutral disables all caps)',
        model: m13r0Profile,
        customer: createNeutralCustomerProfile(),
        role: Role.admin,
        mode: RouterMode.router,
        expected: { sfp: false, fan: false, powersupply: false, 'frozen-config': false },
      },
    ];

    cases.forEach(({ label, model, customer, role, mode, expected }) => {
      it(label, () => {
        const ctx = composeFixture(model, customer);
        const routes = createRouteConfig(ctx, role, mode);
        Object.entries(expected).forEach(([name, shouldPresent]) => {
          expect(
            hasRoute(routes, name),
            `route "${name}" should be ${shouldPresent ? 'present' : 'absent'}`
          ).to.equal(shouldPresent);
        });
      });
    });
  });

  describe('customer-policy filtering', () => {
    it('hides telnet route when allowTelnet is false', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const routes = createRouteConfig(ctx, Role.admin, RouterMode.router);
      expect(hasRoute(routes, 'telnet')).to.equal(false);
    });

    it('shows telnet route when allowTelnet is true (super role)', () => {
      const ctx = composeFixture(m11r4Profile, customerWithAllPolicies());
      const routes = createRouteConfig(ctx, Role.super, RouterMode.router);
      expect(hasRoute(routes, 'telnet')).to.equal(true);
    });

    it('hides super route when allow2LevelAdmin is false', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const routes = createRouteConfig(ctx, Role.admin, RouterMode.router);
      expect(hasRoute(routes, 'super')).to.equal(false);
    });

    it('shows super route when allow2LevelAdmin is true', () => {
      const ctx = composeFixture(m11r4Profile, customerWithAllPolicies());
      const routes = createRouteConfig(ctx, Role.admin, RouterMode.router);
      expect(hasRoute(routes, 'super')).to.equal(true);
    });
  });

  describe('role filtering (only when allow2LevelAdmin is true)', () => {
    it('hides tr069 from admin when allow2LevelAdmin is true', () => {
      const ctx = composeFixture(m11r4Profile, customerWithAllPolicies());
      const routes = createRouteConfig(ctx, Role.admin, RouterMode.router);
      expect(hasRoute(routes, 'tr069'), 'tr069 auth=[super], admin should not see it').to.equal(false);
    });

    it('shows tr069 to super when allow2LevelAdmin is true', () => {
      const ctx = composeFixture(m11r4Profile, customerWithAllPolicies());
      const routes = createRouteConfig(ctx, Role.super, RouterMode.router);
      expect(hasRoute(routes, 'tr069')).to.equal(true);
    });

    it('shows tr069 to admin when allow2LevelAdmin is false (no role check)', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const routes = createRouteConfig(ctx, Role.admin, RouterMode.router);
      expect(hasRoute(routes, 'tr069')).to.equal(true);
    });
  });

  describe('guard metadata in meta', () => {
    it('puts capability into route meta for the guard to check', () => {
      const ctx = composeFixture(m13r0Profile, customer0001);
      const routes = createRouteConfig(ctx, Role.admin, RouterMode.router);
      const fan = findRoute(routes, 'fan');
      expect(fan).to.exist;
      expect(fan.meta.capability).to.equal('fanControl');
    });

    it('puts auth and mode into route meta for the guard to check', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const routes = createRouteConfig(ctx, Role.admin, RouterMode.router);
      const wifi = findRoute(routes, 'wifi');
      expect(wifi).to.exist;
      expect(wifi.meta.auth).to.deep.equal([Role.admin, Role.super]);
      expect(wifi.meta.mode).to.deep.equal([
        RouterMode.router,
        RouterMode.bridge,
        RouterMode.wirelessBridge,
      ]);
    });

    it('puts requiresCustomerPolicy into route meta', () => {
      const ctx = composeFixture(m11r4Profile, customerWithAllPolicies());
      const routes = createRouteConfig(ctx, Role.super, RouterMode.router);
      const telnet = findRoute(routes, 'telnet');
      expect(telnet).to.exist;
      expect(telnet.meta.requiresCustomerPolicy).to.equal('allowTelnet');
    });

    it('public routes (login, dashboard) have no guard metadata', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const routes = createRouteConfig(ctx, Role.admin, RouterMode.router);
      const login = findRoute(routes, 'login');
      expect(login).to.exist;
      expect(login.meta && login.meta.capability).to.equal(undefined);
      expect(login.meta && login.meta.auth).to.equal(undefined);
    });
  });

  describe('catch-all routes', () => {
    it('includes a catch-all redirect to /web/wlan', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const routes = createRouteConfig(ctx, Role.admin, RouterMode.router);
      const catchall = routes.find((r) => r.path === '*');
      expect(catchall).to.exist;
      expect(catchall.redirect).to.equal('/web/wlan');
    });

    it('includes an unprefixed root redirect to /web/login (mirrors legacy)', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const routes = createRouteConfig(ctx, Role.admin, RouterMode.router);
      const root = routes.find((r) => r.path === '/');
      expect(root).to.exist;
      expect(root.redirect).to.equal('/web/login');
    });
  });

  describe('frozen output (defensive)', () => {
    it('returns a frozen route array', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const routes = createRouteConfig(ctx, Role.admin, RouterMode.router);
      expect(Object.isFrozen(routes)).to.equal(true);
    });
  });
});
