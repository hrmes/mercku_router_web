/* eslint-env mocha */
const { expect } = require('chai');

const { UnifiedI18n } = require('../../../unified/src/app/i18n/index.js');
const merckuProfile = require('../../../unified/src/profiles/customers/0001').default;

function runtimeContext(customerId = '0001') {
  return {
    identity: { customerId },
    branding: {
      languages: ['zh-CN', 'en-US'],
      defaultLanguage: 'en-US',
    },
    i18nMessages: merckuProfile.i18nMessages,
  };
}

describe('UnifiedI18n runtime customer catalogue', () => {
  beforeEach(() => {
    window.localStorage.removeItem('lang');
  });

  it('loads real customer messages instead of rendering trans keys', () => {
    const i18n = new UnifiedI18n(runtimeContext());
    expect(i18n.translate('trans0001', 'en-US')).to.equal('Login');
    expect(i18n.translate('trans0001', 'zh-CN')).to.not.equal('trans0001');
  });

  it('resolves backend error-code aliases through code-map', () => {
    const i18n = new UnifiedI18n(runtimeContext());
    expect(i18n.translate('200101', 'en-US')).to.equal('Incorrect account or password');
  });

  it('formats numbers for every runtime language without missing locale data', () => {
    const i18n = new UnifiedI18n(runtimeContext());
    expect(() => i18n.toLocaleNumber(1.024, 'en-US')).to.not.throw();
    expect(() => i18n.toLocaleNumber(1.024, 'zh-CN')).to.not.throw();
  });
});
