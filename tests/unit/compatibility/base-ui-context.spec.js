/* eslint-env mocha */
const { expect } = require('chai');

const { resolveUiBranding } = require('../../../base/src/runtime/ui-context.js');

describe('base UI runtime branding resolver', () => {
  it('prefers runtime branding from the store', () => {
    const runtimeBranding = {
      productName: 'Runtime Router',
      website: { text: 'Support', url: 'https://example.com' },
      policyUrl: 'https://example.com/policy',
      appDownloadUrl: 'https://example.com/app',
      languages: ['en-US'],
      defaultLanguage: 'en-US',
      logoUrl: '/logo.svg',
      qrCodeUrl: '/qr.png',
      appIconUrl: '/app.png',
    };

    expect(resolveUiBranding({ getters: { branding: runtimeBranding } })).to.deep.include(
      runtimeBranding
    );
  });

  it('returns complete safe defaults without runtime or compile-time config', () => {
    const original = process.env.CUSTOMER_CONFIG;
    process.env.CUSTOMER_CONFIG = undefined;

    try {
      expect(resolveUiBranding({})).to.deep.equal({
        productName: 'Router',
        website: { text: '', url: '' },
        policyUrl: '',
        appDownloadUrl: '',
        languages: ['en-US'],
        defaultLanguage: 'en-US',
        logoUrl: '',
        qrCodeUrl: '',
        appIconUrl: '',
        legacyAssetFolder: '',
      });
    } finally {
      process.env.CUSTOMER_CONFIG = original;
    }
  });

  it('normalizes a legacy customer config without mutating it', () => {
    const original = process.env.CUSTOMER_CONFIG;
    const legacyConfig = Object.freeze({
      id: '0001',
      title: 'Legacy Router',
      website: Object.freeze({ text: 'Legacy', url: 'https://legacy.example.com' }),
      policy: 'https://legacy.example.com/policy',
      appDownloadUrl: 'https://legacy.example.com/app',
      languages: Object.freeze(['zh-CN', 'en-US']),
      defaultLanguage: 'zh-CN',
    });
    process.env.CUSTOMER_CONFIG = JSON.stringify(legacyConfig);

    try {
      expect(resolveUiBranding(undefined, legacyConfig)).to.deep.include({
        productName: 'Legacy Router',
        website: { text: 'Legacy', url: 'https://legacy.example.com' },
        languages: ['zh-CN', 'en-US'],
        defaultLanguage: 'zh-CN',
        legacyAssetFolder: 'legacy router',
      });
    } finally {
      process.env.CUSTOMER_CONFIG = original;
    }
  });
});
