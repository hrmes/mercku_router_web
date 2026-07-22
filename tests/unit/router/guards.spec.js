const { expect } = require('chai');

const { compose } = require('../../../unified/src/app/profiles/compose.js');
const {
  createNeutralCustomerProfile,
} = require('../../../unified/src/app/profiles/load.js');
const { installGuards, GUARD_REDIRECT_TO } = require('../../../unified/src/app/router/guards.js');
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

/**
 * Minimal router mock: captures the beforeEach handler so tests can invoke
 * it directly with a synthetic `to` route and inspect what `next` was called
 * with. We do NOT instantiate Vue Router here — Task 6 must remain Vue-free.
 */
function createMockRouter() {
  let guard = null;
  return {
    beforeEach(fn) {
      guard = fn;
    },
    runGuard(to, from = null) {
      expect(guard, 'installGuards must register a beforeEach handler').to.be.a('function');
      let nextArg = undefined;
      let nextCalled = false;
      const next = (arg) => {
        nextCalled = true;
        nextArg = arg;
      };
      guard(to, from, next);
      return { nextCalled, nextArg };
    },
  };
}

function makeRoute(name, meta = {}) {
  return { name, path: `/web/${name}`, meta };
}

describe('installGuards(router, runtimeContext, getCurrentRole, getCurrentMode)', () => {
  describe('GUARD_REDIRECT_TO', () => {
    it('redirects to /web/dashboard (safe default)', () => {
      expect(GUARD_REDIRECT_TO).to.equal('/web/dashboard');
    });
  });

  describe('public routes pass through', () => {
    it('login route is not guarded', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const router = createMockRouter();
      installGuards(router, ctx, () => Role.admin, () => RouterMode.router);
      const { nextCalled, nextArg } = router.runGuard(makeRoute('login'));
      expect(nextCalled).to.equal(true);
      expect(nextArg, 'next() called with no arg → proceed').to.equal(undefined);
    });

    it('dashboard route is not guarded', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const router = createMockRouter();
      installGuards(router, ctx, () => Role.admin, () => RouterMode.router);
      const { nextArg } = router.runGuard(makeRoute('dashboard'));
      expect(nextArg).to.equal(undefined);
    });

    it('route with no meta passes through', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const router = createMockRouter();
      installGuards(router, ctx, () => Role.admin, () => RouterMode.router);
      const { nextArg } = router.runGuard({ name: 'unknown', path: '/web/unknown', meta: undefined });
      expect(nextArg).to.equal(undefined);
    });
  });

  describe('capability re-check (prevents direct URL bypass)', () => {
    it('blocks fan route when effectiveCapabilities.fanControl is false', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const router = createMockRouter();
      installGuards(router, ctx, () => Role.admin, () => RouterMode.router);
      const fanRoute = makeRoute('fan', {
        capability: 'fanControl',
        auth: [Role.admin, Role.super],
        mode: [RouterMode.router, RouterMode.bridge, RouterMode.wirelessBridge],
      });
      const { nextArg } = router.runGuard(fanRoute);
      expect(nextArg, 'should redirect when cap is false').to.equal(GUARD_REDIRECT_TO);
    });

    it('allows fan route when effectiveCapabilities.fanControl is true', () => {
      const ctx = composeFixture(m13r0Profile, customer0001);
      const router = createMockRouter();
      installGuards(router, ctx, () => Role.admin, () => RouterMode.router);
      const fanRoute = makeRoute('fan', {
        capability: 'fanControl',
        auth: [Role.admin, Role.super],
        mode: [RouterMode.router, RouterMode.bridge, RouterMode.wirelessBridge],
      });
      const { nextArg } = router.runGuard(fanRoute);
      expect(nextArg).to.equal(undefined);
    });
  });

  describe('customer-policy re-check', () => {
    it('blocks telnet route when allowTelnet is false', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const router = createMockRouter();
      installGuards(router, ctx, () => Role.super, () => RouterMode.router);
      const telnetRoute = makeRoute('telnet', {
        requiresCustomerPolicy: 'allowTelnet',
        auth: [Role.super],
        mode: [RouterMode.router],
      });
      const { nextArg } = router.runGuard(telnetRoute);
      expect(nextArg).to.equal(GUARD_REDIRECT_TO);
    });

    it('allows telnet route when allowTelnet is true (super role)', () => {
      const ctx = composeFixture(m11r4Profile, customerWithAllPolicies());
      const router = createMockRouter();
      installGuards(router, ctx, () => Role.super, () => RouterMode.router);
      const telnetRoute = makeRoute('telnet', {
        requiresCustomerPolicy: 'allowTelnet',
        auth: [Role.super],
        mode: [RouterMode.router],
      });
      const { nextArg } = router.runGuard(telnetRoute);
      expect(nextArg).to.equal(undefined);
    });

    it('blocks super route when allow2LevelAdmin is false', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const router = createMockRouter();
      installGuards(router, ctx, () => Role.admin, () => RouterMode.router);
      const superRoute = makeRoute('super', {
        requiresCustomerPolicy: 'allow2LevelAdmin',
        auth: [Role.admin, Role.super],
        mode: [RouterMode.router, RouterMode.bridge, RouterMode.wirelessBridge],
      });
      const { nextArg } = router.runGuard(superRoute);
      expect(nextArg).to.equal(GUARD_REDIRECT_TO);
    });
  });

  describe('role re-check (when allow2LevelAdmin is true)', () => {
    it('blocks admin from tr069 (auth=[super]) when allow2LevelAdmin is true', () => {
      const ctx = composeFixture(m11r4Profile, customerWithAllPolicies());
      const router = createMockRouter();
      installGuards(router, ctx, () => Role.admin, () => RouterMode.router);
      const tr069Route = makeRoute('tr069', {
        auth: [Role.super],
        mode: [RouterMode.router, RouterMode.bridge, RouterMode.wirelessBridge],
      });
      const { nextArg } = router.runGuard(tr069Route);
      expect(nextArg).to.equal(GUARD_REDIRECT_TO);
    });

    it('allows super to tr069 when allow2LevelAdmin is true', () => {
      const ctx = composeFixture(m11r4Profile, customerWithAllPolicies());
      const router = createMockRouter();
      installGuards(router, ctx, () => Role.super, () => RouterMode.router);
      const tr069Route = makeRoute('tr069', {
        auth: [Role.super],
        mode: [RouterMode.router, RouterMode.bridge, RouterMode.wirelessBridge],
      });
      const { nextArg } = router.runGuard(tr069Route);
      expect(nextArg).to.equal(undefined);
    });

    it('allows admin to tr069 when allow2LevelAdmin is false (no role check)', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const router = createMockRouter();
      installGuards(router, ctx, () => Role.admin, () => RouterMode.router);
      const tr069Route = makeRoute('tr069', {
        auth: [Role.super],
        mode: [RouterMode.router, RouterMode.bridge, RouterMode.wirelessBridge],
      });
      const { nextArg } = router.runGuard(tr069Route);
      expect(nextArg).to.equal(undefined);
    });

    it('re-evaluates role on every navigation (getCurrentRole is a getter)', () => {
      const ctx = composeFixture(m11r4Profile, customerWithAllPolicies());
      const router = createMockRouter();
      let currentRole = Role.admin;
      installGuards(router, ctx, () => currentRole, () => RouterMode.router);
      const tr069Route = makeRoute('tr069', {
        auth: [Role.super],
        mode: [RouterMode.router, RouterMode.bridge, RouterMode.wirelessBridge],
      });
      // admin → blocked
      expect(router.runGuard(tr069Route).nextArg).to.equal(GUARD_REDIRECT_TO);
      // role changes to super at runtime → allowed
      currentRole = Role.super;
      expect(router.runGuard(tr069Route).nextArg).to.equal(undefined);
    });
  });

  describe('mode re-check', () => {
    it('blocks wan route (router-only) when mode is bridge', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const router = createMockRouter();
      installGuards(router, ctx, () => Role.admin, () => RouterMode.bridge);
      const wanRoute = makeRoute('wan', {
        auth: [Role.admin, Role.super],
        mode: [RouterMode.router],
      });
      const { nextArg } = router.runGuard(wanRoute);
      expect(nextArg).to.equal(GUARD_REDIRECT_TO);
    });

    it('allows wan route when mode is router', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const router = createMockRouter();
      installGuards(router, ctx, () => Role.admin, () => RouterMode.router);
      const wanRoute = makeRoute('wan', {
        auth: [Role.admin, Role.super],
        mode: [RouterMode.router],
      });
      const { nextArg } = router.runGuard(wanRoute);
      expect(nextArg).to.equal(undefined);
    });

    it('re-evaluates mode on every navigation (getCurrentMode is a getter)', () => {
      const ctx = composeFixture(m11r4Profile, customer0001);
      const router = createMockRouter();
      let currentMode = RouterMode.router;
      installGuards(router, ctx, () => Role.admin, () => currentMode);
      const wanRoute = makeRoute('wan', {
        auth: [Role.admin, Role.super],
        mode: [RouterMode.router],
      });
      expect(router.runGuard(wanRoute).nextArg).to.equal(undefined);
      currentMode = RouterMode.bridge;
      expect(router.runGuard(wanRoute).nextArg).to.equal(GUARD_REDIRECT_TO);
    });
  });

  describe('combined re-check (capability + role + mode)', () => {
    it('blocks when capability is OK but mode is wrong', () => {
      const ctx = composeFixture(m13r0Profile, customer0001);
      const router = createMockRouter();
      installGuards(router, ctx, () => Role.admin, () => RouterMode.bridge);
      // fan is all-modes in definitions, but the guard trusts meta.mode from
      // the route config. Synthesize a fan route with router-only mode.
      const fanRoute = makeRoute('fan', {
        capability: 'fanControl',
        auth: [Role.admin, Role.super],
        mode: [RouterMode.router],
      });
      const { nextArg } = router.runGuard(fanRoute);
      expect(nextArg).to.equal(GUARD_REDIRECT_TO);
    });

    it('allows when all checks pass', () => {
      const ctx = composeFixture(m13r0Profile, customer0001);
      const router = createMockRouter();
      installGuards(router, ctx, () => Role.admin, () => RouterMode.router);
      const fanRoute = makeRoute('fan', {
        capability: 'fanControl',
        auth: [Role.admin, Role.super],
        mode: [RouterMode.router, RouterMode.bridge, RouterMode.wirelessBridge],
      });
      const { nextArg } = router.runGuard(fanRoute);
      expect(nextArg).to.equal(undefined);
    });
  });
});
