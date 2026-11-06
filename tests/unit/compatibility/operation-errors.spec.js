/* eslint-env mocha */
const { expect } = require('chai');
const { errorMessageKey, isPasswordRejection } = require('../../../unified/src/app/http/error-message');
const { default: buildMessages } = require('../../../unified/src/profiles/customers/build-messages');
const messages = require('../../../unified/src/profiles/customers/operation-messages.json');

describe('operation error reasons and translations', () => {
  it('uses a finite reason set while keeping old numeric error codes', () => {
    expect(errorMessageKey({ code: 109999, reason: 'busy' })).to.equal('operation.busy');
    expect(errorMessageKey({ code: 200101 })).to.equal(200101);
    expect(errorMessageKey({ code: 109999, reason: 'private-arbitrary-code' })).to.equal('operation.failed');
    expect(isPasswordRejection({ error: { code: 300102 } })).to.equal(true);
    [undefined, { error: { code: 109999, reason: 'unavailable' } }, { error: { code: 200101, reason: 'session-expired' } }, { error: { code: 300102, reason: 'unavailable' } }].forEach(error => expect(isPasswordRejection(error)).to.equal(false));
  });
  it('supplies each enabled language and an English fallback through the profile builder', () => {
    const catalogues = Object.keys(messages).reduce((out, locale) => ({ ...out, [locale]: { old: 'legacy' } }), { 'xx-YY': {} });
    const translated = buildMessages(catalogues, { 200101: 'old' }, {});
    Object.keys(catalogues).forEach(locale => {
      const operation = translated[locale].operation;
      expect(operation).to.have.all.keys(messages['en-US']);
      Object.values(operation).forEach(text => expect(text).to.be.a('string').and.not.equal(''));
    });
    expect(translated['xx-YY'].operation).to.deep.equal(messages['en-US']);
    expect(translated['zh-CN'][200101]).to.equal('legacy');
  });
});
