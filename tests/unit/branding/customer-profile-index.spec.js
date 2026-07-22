const { expect } = require('chai');

// These tests exercise the webpack-bundled index.js of each Customer Profile.
// The fact that the imports resolve at all (file-loader / url-loader) is
// itself the test: a missing asset file would fail the webpack compilation.
// We then assert the assembled shape so future edits to index.js can't
// silently drop a field.

const merckuProfile = require('../../../unified/src/profiles/customers/0001');
const neutralProfile = require('../../../unified/src/profiles/customers/neutral');

describe('Customer Profile 0001 index.js (webpack-bundled asset imports)', () => {
  it('imports successfully and exposes a default export', () => {
    expect(merckuProfile).to.exist;
    expect(merckuProfile.default, 'expected ES module default export').to.exist;
  });

  it('carries the JSON profile fields verbatim', () => {
    const p = merckuProfile.default;
    expect(p.profileVersion).to.equal(1);
    expect(p.branding.productName).to.equal('Mercku');
    expect(p.policy.allow2LevelAdmin).to.equal(false);
  });

  it('attaches a resolved logoUrl from the imported logo.png asset', () => {
    expect(merckuProfile.default.branding.logoUrl, 'logoUrl must be a non-empty string').to.be.a('string').that.is.not.empty;
  });

  it('attaches a resolved faviconUrl from the imported favicon.ico asset', () => {
    expect(merckuProfile.default.branding.faviconUrl, 'faviconUrl must be a non-empty string').to.be.a('string').that.is.not.empty;
  });

  it('does NOT attach a loginBackgroundUrl (customer 0001 uses logo on solid color)', () => {
    expect(merckuProfile.default.branding).to.not.have.property('loginBackgroundUrl');
  });

  it('preserves theme and languages from the JSON profile', () => {
    const p = merckuProfile.default;
    expect(p.branding.theme['--brand-primary']).to.equal('#d6001c');
    expect(p.branding.languages).to.include('en-US');
    expect(p.branding.languages).to.include('zh-CN');
  });
});

describe('Customer Profile neutral index.js (webpack-bundled asset imports)', () => {
  it('imports successfully and exposes a default export', () => {
    expect(neutralProfile).to.exist;
    expect(neutralProfile.default, 'expected ES module default export').to.exist;
  });

  it('carries the JSON profile fields verbatim', () => {
    const p = neutralProfile.default;
    expect(p.profileVersion).to.equal(1);
    expect(p.branding.productName).to.equal('Router');
  });

  it('attaches a resolved logoUrl from the shared default logo.svg', () => {
    expect(neutralProfile.default.branding.logoUrl, 'logoUrl must be a non-empty string').to.be.a('string').that.is.not.empty;
  });

  it('attaches a resolved faviconUrl from the shared default favicon.ico', () => {
    expect(neutralProfile.default.branding.faviconUrl, 'faviconUrl must be a non-empty string').to.be.a('string').that.is.not.empty;
  });

  it('attaches a resolved loginBackgroundUrl from the shared default login-background.svg', () => {
    expect(neutralProfile.default.branding.loginBackgroundUrl, 'loginBackgroundUrl must be a non-empty string').to.be.a('string').that.is.not.empty;
  });

  it('preserves theme and policy from the JSON profile', () => {
    const p = neutralProfile.default;
    expect(p.branding.theme['--brand-primary']).to.equal('#333333');
    expect(p.policy.disabledCapabilities).to.have.lengthOf(4);
    expect(p.policy.allow2LevelAdmin).to.equal(false);
    expect(p.policy.allowTelnet).to.equal(false);
  });
});
