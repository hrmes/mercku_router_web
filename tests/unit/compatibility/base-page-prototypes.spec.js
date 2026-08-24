/* eslint-env mocha */
const { expect } = require('chai');

const {
  installBasePageFormatters,
} = require('../../../unified/src/app/base-page-formatters.js');

describe('Unified Base-page prototype compatibility', () => {
  it('installs the number formatters expected by reused Base pages', () => {
    const VueCtor = { prototype: {} };
    const i18n = {
      i18n: { locale: 'en-US' },
      toLocaleNumber: value => `localized:${value}`,
    };

    installBasePageFormatters(VueCtor, i18n);

    expect(VueCtor.prototype.formatSpeed).to.be.a('function');
    expect(VueCtor.prototype.formatNetworkData).to.be.a('function');
    expect(VueCtor.prototype.formatBandWidth).to.be.a('function');
    expect(VueCtor.prototype.formatSpeed(1024)).to.deep.equal({
      value: 'localized:1.024',
      unit: 'Kbps',
    });
  });
});
