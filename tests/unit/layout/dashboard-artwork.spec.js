/* eslint-env mocha */
const { expect } = require('chai');

const Dashboard = require('../../../base/src/pages/bussiness/dashboard/index.vue').default;
const meshEditMixin = require('../../../base/src/mixins/mesh-edit.js').default;

function classFor(capabilities) {
  return Dashboard.computed.routerImageClass.call({
    $store: { getters: { runtimeContext: {}, effectiveCapabilities: capabilities } },
  });
}

describe('dashboard router artwork', () => {
  it('selects artwork by semantic hardware capability without model-ID branches', () => {
    expect(classFor({ fanControl: true })).to.equal('router-image--nano');
    expect(classFor({ frozenConfig: true })).to.equal('router-image--m6');
    expect(classFor({})).to.equal('router-image--m6s');
  });

  it('reads product and app assets from runtime branding', () => {
    const $store = {
      state: {},
      getters: {
        runtimeContext: {},
        branding: {
          productName: 'Runtime Router',
          languages: ['en-US'],
          appDownloadUrl: 'https://example.com/app',
          appIconUrl: '/runtime-app.png',
        },
      },
    };
    const branding = Dashboard.computed.branding.call({ $store });

    expect(Dashboard.computed.productName.call({ $store, branding })).to.equal('Runtime Router');
    expect(Dashboard.computed.appIconUrl.call({ branding })).to.equal('/runtime-app.png');
  });

  it('limits runtime mesh colors to the safe common set', () => {
    const colors = meshEditMixin.computed.gwAvailableDeviceColors.call({
      $store: { getters: { runtimeContext: {} }, state: {} },
    });
    expect(colors.map(color => color.name)).to.deep.equal(['black', 'white']);
  });
});
