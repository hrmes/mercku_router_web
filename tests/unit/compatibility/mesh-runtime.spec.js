/* eslint-env mocha */
const { expect } = require('chai');

const Mesh = require('../../../base/src/pages/bussiness/dashboard/mesh.vue').default;

describe('Mesh page runtime-profile compatibility', () => {
  function runtimeVm(meshRadioStatus) {
    return {
      $store: {
        getters: {
          runtimeContext: {
            behavior: { meshRadioStatus },
          },
          branding: { productName: 'Runtime Router' },
        },
      },
      selectedNodeInfo: null,
      modelID: '',
      modelVersion: '',
    };
  }

  it('selects M6 band control from semantic runtime behavior', () => {
    expect(Mesh.computed.isM6.call(runtimeVm('band24g'))).to.equal(true);
    expect(Mesh.computed.isM6.call(runtimeVm('txPower'))).to.equal(false);
  });

  it('uses runtime branding when compile-time customer config is absent', () => {
    expect(Mesh.computed.productName.call(runtimeVm('txPower')))
      .to.equal('Runtime Router');
  });

  it('does not read compile-time model id for a runtime-profile node image class', () => {
    expect(Mesh.computed.productImgName.call(runtimeVm('txPower'))).to.equal('');
  });
});
