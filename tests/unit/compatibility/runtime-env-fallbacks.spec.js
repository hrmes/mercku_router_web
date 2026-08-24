/* eslint-env mocha */
const { expect } = require('chai');

const encryptMethodsMixin = require('../../../base/src/mixins/encrypt-methods.js').default;
const wifiRulesMixin = require('../../../base/src/mixins/wifi-rules.js').default;
const OfflineUpgradePage = require('../../../base/src/pages/bussiness/upgrade/offline.vue').default;
const { resolveRuntimeModelId } = require('../../../base/src/runtime/ui-context.js');
const WanSettings = require('../../../base/src/pages/bussiness/setting/wan.vue').default;
const colorGradientMixin = require('../../../base/src/mixins/color-gradient.js').default;
const Dashboard = require('../../../base/src/pages/bussiness/dashboard/index.vue').default;
const DevicePage = require('../../../base/src/pages/bussiness/dashboard/device.vue').default;
const { Products } = require('../../../base/src/mixins/router-model.js');

describe('legacy page runtime-profile compatibility', () => {
  it('builds a safe encryption list without compile-time MODEL_CONFIG', () => {
    const original = process.env.MODEL_CONFIG;
    process.env.MODEL_CONFIG = undefined;
    try {
      const data = encryptMethodsMixin.data.call({ $t: (key) => key });
      expect(data.encryptMethods).to.be.an('array').that.is.not.empty;
    } finally {
      process.env.MODEL_CONFIG = original;
    }
  });

  it('builds Guest Wi-Fi validation rules without compile-time MODEL_CONFIG', () => {
    const original = process.env.MODEL_CONFIG;
    process.env.MODEL_CONFIG = undefined;
    try {
      const rules = wifiRulesMixin.methods.getAdvanceSSIDRule.call({
        $t: key => key,
      });
      expect(rules).to.be.an('array').that.is.not.empty;
    } finally {
      process.env.MODEL_CONFIG = original;
    }
  });

  it('mounts offline-upgrade data without compile-time CUSTOMER_CONFIG', () => {
    const original = process.env.CUSTOMER_CONFIG;
    process.env.CUSTOMER_CONFIG = undefined;
    try {
      expect(OfflineUpgradePage.data.call({}).accept).to.equal('.ma');
    } finally {
      process.env.CUSTOMER_CONFIG = original;
    }
  });

  it('keeps the gateway first in the offline-upgrade node list', () => {
    const satellite = { sn: 'satellite', isGW: false };
    const gateway = { sn: 'gateway', isGW: true };
    const ordered = OfflineUpgradePage.computed.localNodesOrdered.call({
      localNodes: [satellite, gateway],
    });

    expect(ordered.map(node => node.sn)).to.deep.equal(['gateway', 'satellite']);
  });

  it('resolves the speed-test model from runtime identity without MODEL_CONFIG', () => {
    const original = process.env.MODEL_CONFIG;
    process.env.MODEL_CONFIG = undefined;
    try {
      expect(resolveRuntimeModelId({
        getters: { runtimeContext: { identity: { modelId: 'M8' } } },
      })).to.equal('M8');
    } finally {
      process.env.MODEL_CONFIG = original;
    }
  });

  it('accepts DHCP WAN responses without a dns array', () => {
    const response = { data: { result: { type: 'dhcp', dhcp: {} } } };
    const request = {
      then(callback) {
        callback(response);
        return { finally: callbackFinally => callbackFinally() };
      },
    };
    const vm = {
      $loading: { open() {}, close() {} },
      $http: { getWanNetInfo: () => request },
      netInfo: {},
      netType: '',
      autodns: { dhcp: true, pppoe: true },
      dhcpForm: { dns1: '', dns2: '' },
      pppoeForm: { account: '', password: '', dns1: '', dns2: '' },
      staticForm: {},
    };
    Object.defineProperties(vm, {
      isDhcp: { get: () => WanSettings.computed.isDhcp.call(vm) },
      isPppoe: { get: () => WanSettings.computed.isPppoe.call(vm) },
      isStatic: { get: () => WanSettings.computed.isStatic.call(vm) },
    });

    WanSettings.methods.getWanNetInfo.call(vm);

    expect(vm.autodns.dhcp).to.equal(true);
    expect(vm.dhcpForm).to.deep.include({ dns1: '', dns2: '' });
  });

  it('returns no loading paths before the loading DOM is mounted', () => {
    const original = global.document;
    global.document = { getElementById: () => null };
    try {
      expect(colorGradientMixin.computed.pathElements.call({})).to.deep.equal([]);
    } finally {
      global.document = original;
    }
  });

  it('resolves the Dashboard device loading color from runtime branding', () => {
    const $store = {
      getters: { branding: { theme: { '--brand-loading': '#123456' } } },
    };

    expect(DevicePage.computed.loadingColor.call({ $store })).to.equal('#123456');
  });

  it('builds generic product labels from runtime branding', () => {
    const original = process.env.CUSTOMER_CONFIG;
    process.env.CUSTOMER_CONFIG = undefined;
    try {
      const data = Products.data.call({
        $store: { getters: { branding: { productName: 'Preview Router' } } },
      });
      expect(Object.values(data.Products)[0].shortName).to.equal('Preview Router');
    } finally {
      process.env.CUSTOMER_CONFIG = original;
    }
  });

  it('builds Base Dashboard computed data without compile-time configs', () => {
    const $store = {
      state: {},
      getters: {
        runtimeContext: {},
        branding: { productName: 'Preview Router', languages: ['en-US'] },
        effectiveCapabilities: {},
      },
    };
    const branding = Dashboard.computed.branding.call({ $store });
    expect(Dashboard.computed.productName.call({ $store, branding })).to.equal('Preview Router');
    expect(Dashboard.computed.routerImageClass.call({ $store })).to.equal('router-image--m6s');
  });
});
