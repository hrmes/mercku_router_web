/* eslint-env mocha */
const fs = require('fs');
const path = require('path');
const { expect } = require('chai');

const {
  validateCustomerProfile,
  getCustomerProfileErrors,
} = require('../../../unified/src/app/profiles/validate');
const viaeroProfile = require('../../../unified/src/profiles/customers/0032').default;

const PROFILE_DIR = path.resolve(
  process.cwd(),
  'unified/src/profiles/customers/0032'
);

describe('Customer Profile 0032 (Viaero)', () => {
  it('ships the historical Viaero identity and blue theme as valid profile data', () => {
    const profilePath = path.join(PROFILE_DIR, 'profile.json');
    expect(fs.existsSync(profilePath), 'Viaero profile.json must exist').to.equal(true);
    const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));

    expect(profile.branding.productName).to.equal('Viaero');
    expect(profile.branding.wifiName).to.equal('Viaero Wi-Fi');
    expect(profile.branding.website).to.deep.equal({
      text: 'www.viaero.com',
      url: 'https://www.viaero.com',
    });
    expect(profile.branding.languages).to.deep.equal([
      'zh-CN', 'en-US', 'de-DE', 'fi-FI', 'bg-BG',
    ]);
    expect(profile.branding.defaultLanguage).to.equal('en-US');
    expect(profile.branding.theme['--brand-primary']).to.equal('#0a6fcd');
    expect(profile.branding.theme['--brand-loading']).to.equal('#0a6fcd');
    expect(profile.policy.allow2LevelAdmin).to.equal(true);
  });

  it('assembles separate nav/login logos, favicon, QR, app icon and Viaero messages', () => {
    const indexPath = path.join(PROFILE_DIR, 'index.js');
    expect(fs.existsSync(indexPath), 'Viaero index.js must exist').to.equal(true);
    const { branding } = viaeroProfile;

    [
      'logoUrl',
      'darkLogoUrl',
      'loginLogoUrl',
      'darkLoginLogoUrl',
      'faviconUrl',
      'qrCodeUrl',
      'appIconUrl',
    ].forEach((key) => {
      expect(branding[key], `${key} must be a non-empty webpack URL`)
        .to.be.a('string').that.is.not.empty;
    });
    expect(branding.darkLogoUrl).to.not.equal(branding.logoUrl);
    expect(branding.loginLogoUrl).to.not.equal(branding.logoUrl);
    expect(branding.darkLoginLogoUrl).to.not.equal(branding.loginLogoUrl);
    expect(viaeroProfile.i18nMessages['en-US'].trans0314)
      .to.include('Viaero');
    expect(
      validateCustomerProfile(viaeroProfile),
      JSON.stringify(getCustomerProfileErrors())
    ).to.equal(true);
  });
});
