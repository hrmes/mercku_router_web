/* eslint-env mocha */
const { expect } = require('chai');

const encryptMethodsMixin = require('../../../base/src/mixins/encrypt-methods.js').default;
const wifiRulesMixin = require('../../../base/src/mixins/wifi-rules.js').default;
const OfflineUpgradePage = require('../../../base/src/pages/bussiness/upgrade/offline.vue').default;
const Dashboard = require('../../../base/src/pages/bussiness/dashboard/index.vue').default;
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
