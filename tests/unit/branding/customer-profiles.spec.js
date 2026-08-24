const { expect } = require('chai');
const Ajv = require('ajv');

const customerProfileSchema = require('../../../unified/src/app/profiles/customer-profile.schema.json');
const {
  CUSTOMER_DISABLEABLE_CAPABILITIES,
} = require('../../../unified/src/app/profiles/capabilities.js');

const merckuProfile = require('../../../unified/src/profiles/customers/0001/profile.json');
const neutralProfile = require('../../../unified/src/profiles/customers/neutral/profile.json');
const {
  createNeutralCustomerProfile,
} = require('../../../unified/src/app/profiles/load.js');

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(customerProfileSchema);

describe('Customer Profile: 0001 (Mercku)', () => {
  it('is schema-valid', () => {
    const ok = validate(merckuProfile);
    expect(validate.errors, JSON.stringify(validate.errors, null, 2)).to.equal(null);
    expect(ok).to.equal(true);
  });

  it('maps base/customer-conf/0001/conf.json title → branding.productName', () => {
    expect(merckuProfile.branding.productName).to.equal('Mercku');
  });

  it('maps wifi → branding.wifiName', () => {
    expect(merckuProfile.branding.wifiName).to.equal('Mercku Wi-Fi');
  });

  it('maps website text and url', () => {
    expect(merckuProfile.branding.website.text).to.equal('www.mercku.com');
    expect(merckuProfile.branding.website.url).to.equal('https://www.mercku.com');
  });

  it('maps appDownloadUrl verbatim', () => {
    expect(merckuProfile.branding.appDownloadUrl).to.equal('http://onelink.to/mn4tgv');
  });

  it('keeps the six language tags from conf.json', () => {
    expect(merckuProfile.branding.languages.sort()).to.deep.equal(
      ['bg-BG', 'de-DE', 'en-US', 'fi-FI', 'fr-FR', 'zh-CN']
    );
  });

  it('locks profileVersion to 1', () => {
    expect(merckuProfile.profileVersion).to.equal(1);
  });

  it('uses #d6001c as both --brand-primary and --brand-loading', () => {
    expect(merckuProfile.branding.theme['--brand-primary']).to.equal('#d6001c');
    expect(merckuProfile.branding.theme['--brand-loading']).to.equal('#d6001c');
  });

  it('does not disable any customer-disableable capabilities', () => {
    expect(merckuProfile.policy.disabledCapabilities).to.deep.equal([]);
  });

  it('maps allow2LevelAdmin=false from conf.json', () => {
    expect(merckuProfile.policy.allow2LevelAdmin).to.equal(false);
  });

  it('locks allowTelnet=false (conf.json does not mention it; safe default)', () => {
    expect(merckuProfile.policy.allowTelnet).to.equal(false);
  });

  it('does NOT carry the routers field (model-specific data goes to Model Profile)', () => {
    expect(merckuProfile).to.not.have.property('routers');
  });
});

describe('Customer Profile: neutral (fail-closed fallback)', () => {
  it('is schema-valid', () => {
    const ok = validate(neutralProfile);
    expect(validate.errors, JSON.stringify(validate.errors, null, 2)).to.equal(null);
    expect(ok).to.equal(true);
  });

  it('locks profileVersion to 1', () => {
    expect(neutralProfile.profileVersion).to.equal(1);
  });

  it('uses a brand-neutral productName', () => {
    expect(neutralProfile.branding.productName).to.equal('Router');
  });

  it('uses a brand-neutral wifiName', () => {
    expect(neutralProfile.branding.wifiName).to.equal('Router Wi-Fi');
  });

  it('declares en-US as the only language', () => {
    expect(neutralProfile.branding.languages).to.deep.equal(['en-US']);
    expect(neutralProfile.branding.defaultLanguage).to.equal('en-US');
  });

  it('uses a neutral grey theme', () => {
    expect(neutralProfile.branding.theme['--brand-primary']).to.match(/^#[0-9a-fA-F]{6}$/);
    expect(neutralProfile.branding.theme['--brand-loading']).to.match(/^#[0-9a-fA-F]{6}$/);
  });

  it('closes ALL customerDisableableCapabilities', () => {
    CUSTOMER_DISABLEABLE_CAPABILITIES.forEach((cap) => {
      expect(
        neutralProfile.policy.disabledCapabilities,
        `neutral must disable ${cap}`
      ).to.include(cap);
    });
    expect(neutralProfile.policy.disabledCapabilities).to.have.lengthOf(
      CUSTOMER_DISABLEABLE_CAPABILITIES.length
    );
  });

  it('forbids 2-level admin', () => {
    expect(neutralProfile.policy.allow2LevelAdmin).to.equal(false);
  });

  it('forbids telnet', () => {
    expect(neutralProfile.policy.allowTelnet).to.equal(false);
  });
});

describe('Neutral Profile runtime fallback', () => {
  it('uses profile.json as its complete data source and only attaches assets', () => {
    const runtimeProfile = createNeutralCustomerProfile();
    const {
      logoUrl,
      faviconUrl,
      loginBackgroundUrl,
      ...runtimeBranding
    } = runtimeProfile.branding;

    expect({
      ...runtimeProfile,
      branding: runtimeBranding,
    }).to.deep.equal(neutralProfile);
    [logoUrl, faviconUrl, loginBackgroundUrl].forEach((url) => {
      expect(url).to.be.a('string').that.is.not.empty;
    });
  });

  it('returns independent mutable copies', () => {
    const first = createNeutralCustomerProfile();
    const second = createNeutralCustomerProfile();
    first.branding.languages.push('test');
    first.policy.disabledCapabilities.length = 0;

    expect(second.branding.languages).to.deep.equal(['en-US']);
    expect(second.policy.disabledCapabilities).to.deep.equal(
      neutralProfile.policy.disabledCapabilities
    );
  });
});
