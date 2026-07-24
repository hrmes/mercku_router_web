/* eslint-env mocha */
const { expect } = require('chai');

const Footer = require('../../../base/src/component/footer/index.vue').default;

describe('Base Footer runtime compatibility', () => {
  const branding = {
    productName: 'Runtime Router',
    website: { text: 'Support', url: 'https://example.com' },
    policyUrl: 'https://example.com/policy',
    languages: ['en-US'],
    qrCodeUrl: '/runtime-qr.png',
  };

  it('reads product, policy, and QR from runtime branding', () => {
    const vm = { $store: { getters: { branding } } };
    const resolved = Footer.computed.branding.call(vm);

    expect(resolved.productName).to.equal('Runtime Router');
    expect(Footer.computed.qrCodeUrl.call({ branding: resolved })).to.equal('/runtime-qr.png');
  });

  it('uses the runtime product name in translated text', () => {
    const text = Footer.methods.transText.call({
      branding,
      $t: () => 'Download the %s app',
    }, 'trans1118');

    expect(text).to.equal('Download the Runtime Router app');
  });

  it('does not invent a QR URL when runtime and legacy assets are absent', () => {
    expect(Footer.computed.qrCodeUrl.call({
      branding: { qrCodeUrl: '', legacyAssetFolder: '' },
    })).to.equal('');
  });
});
