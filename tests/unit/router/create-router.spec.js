/* eslint-env mocha */
const { expect } = require('chai');

const { compose } = require('../../../unified/src/app/profiles/compose.js');
const {
  createNeutralCustomerProfile,
} = require('../../../unified/src/app/profiles/load.js');
const {
  createRouteConfig,
  ROUTER_BASE,
} = require('../../../unified/src/app/router/create-router.js');
const { Role, RouterMode } = require('../../../base/src/util/constant');

const baselineModel = require('../../../unified/src/profiles/models/M11R4/profile.json');
const sfpModel = require('../../../unified/src/profiles/models/M11R2/profile.json');
const customer = require('../../../unified/src/profiles/customers/0001/profile.json');

function composeFixture(modelProfile, customerProfile) {
  return compose({
    schemaVersion: 1,
    revision: 'router-test',
    modelId: 'TEST_MODEL',
    customerId: 'TEST_CUSTOMER',
    backend: 'mercku_mtk7621',
  }, modelProfile, customerProfile);
}

function findRoute(routes, name) {
  let match = null;
  routes.some((route) => {
    if (route.name === name) {
      match = route;
      return true;
    }
    if (!Array.isArray(route.children)) return false;
    match = route.children.find((candidate) => candidate.name === name) || null;
    return match !== null;
  });
  return match;
}

function customerWithAllPolicies() {
  return {
    ...customer,
    policy: {
      disabledCapabilities: [],
      allow2LevelAdmin: true,
      allowTelnet: true,
    },
  };
}

describe('createRouteConfig(runtimeContext)', () => {
  it('keeps application paths unprefixed and exposes the browser base separately', () => {
    const routes = createRouteConfig(composeFixture(baselineModel, customer));
    expect(ROUTER_BASE).to.equal('/web/');
    routes.forEach((route) => {
      if (route.path !== '*') expect(route.path).not.to.match(/^\/web(?:\/|$)/);
    });
  });

  it('registers role/mode-gated routes before login and carries guard metadata', () => {
    const routes = createRouteConfig(
      composeFixture(baselineModel, customerWithAllPolicies())
    );
    const tr069 = findRoute(routes, 'tr069');
    expect(tr069).to.exist;
    expect(tr069.meta.auth).to.deep.equal([Role.super]);
    expect(tr069.meta.mode).to.deep.equal([
      RouterMode.router,
      RouterMode.bridge,
      RouterMode.wirelessBridge,
    ]);
  });

  it('filters routes by customer policy without depending on login state', () => {
    const baselineRoutes = createRouteConfig(composeFixture(baselineModel, customer));
    const neutralRoutes = createRouteConfig(
      composeFixture(baselineModel, createNeutralCustomerProfile())
    );

    expect(findRoute(baselineRoutes, 'telnet')).to.equal(null);
    expect(findRoute(neutralRoutes, 'telnet')).to.equal(null);
  });

  it('includes hardware routes only when their effective capability is enabled', () => {
    const baselineRoutes = createRouteConfig(composeFixture(baselineModel, customer));
    const sfpRoutes = createRouteConfig(composeFixture(sfpModel, customer));

    expect(findRoute(baselineRoutes, 'sfp')).to.equal(null);
    expect(findRoute(sfpRoutes, 'sfp')).to.exist;
    expect(findRoute(sfpRoutes, 'sfp').meta.requiresCapability).to.equal('sfp');
  });

  it('preserves policy, auth and mode metadata for guards', () => {
    const routes = createRouteConfig(
      composeFixture(baselineModel, customerWithAllPolicies())
    );
    expect(findRoute(routes, 'telnet').meta.requiresCustomerPolicy).to.equal('allowTelnet');
    expect(findRoute(routes, 'wifi').meta.auth).to.deep.equal([Role.admin, Role.super]);
  });

  it('adds application-relative root and catch-all redirects', () => {
    const routes = createRouteConfig(composeFixture(baselineModel, customer));
    expect(routes.find((route) => route.path === '/').redirect).to.equal('/login');
    expect(routes.find((route) => route.path === '*').redirect).to.equal('/wlan');
  });

  it('connects every supported route to a lazy page component', () => {
    const routes = createRouteConfig(
      composeFixture(baselineModel, customerWithAllPolicies())
    );
    const applicationRoutes = [];
    routes.forEach((route) => {
      if (route.name) applicationRoutes.push(route);
      if (Array.isArray(route.children)) applicationRoutes.push(...route.children);
    });
    applicationRoutes.forEach((route) => {
      expect(route.component, route.name).to.be.a('function');
    });
  });

  it('freezes route metadata without freezing Vue lazy component factories', () => {
    const routes = createRouteConfig(composeFixture(baselineModel, customer));
    expect(Object.isFrozen(routes)).to.equal(true);
    expect(Object.isFrozen(findRoute(routes, 'wifi').meta)).to.equal(true);

    const dashboardComponent = findRoute(routes, 'dashboard').component;
    expect(dashboardComponent).to.be.a('function');
    expect(Object.isExtensible(dashboardComponent)).to.equal(true);
  });
});
