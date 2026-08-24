/* eslint-env mocha */
const { expect } = require('chai');

const {
  resolveLoadingColor,
} = require('../../../base/src/component/loading/loading-canvas.vue');

describe('shared loading color compatibility', () => {
  it('keeps the legacy customer loading color when compile-time config exists', () => {
    const customerConfig = { loading: { color: '#d6001c' } };
    expect(resolveLoadingColor(customerConfig)).to.equal('#d6001c');
  });

  it('uses the runtime CSS variable only when legacy config is absent', () => {
    const document = {
      documentElement: {},
      defaultView: {
        getComputedStyle() {
          return {
            getPropertyValue(name) {
              return name === '--brand-loading' ? '#00b4e4' : '';
            },
          };
        },
      },
    };

    expect(resolveLoadingColor(undefined, document)).to.equal('#00b4e4');
  });
});
