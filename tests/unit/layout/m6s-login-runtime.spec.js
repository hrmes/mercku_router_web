/* eslint-env mocha */
const { expect } = require('chai');
const LoginModule = require('../../../m6s/src/pages/login/index.vue');

const Login = LoginModule.default;

describe('M6s login runtime branding compatibility', () => {
  const runtimeBranding = {
    productName: 'Runtime Router',
    website: { text: 'Support', url: 'https://example.com' },
    appDownloadUrl: 'https://example.com/app',
    languages: ['en-US'],
    defaultLanguage: 'en-US',
    logoUrl: '/logo-light.png',
    darkLogoUrl: '/logo-dark.png',
    loginLogoUrl: '/login-logo-light.png',
    darkLoginLogoUrl: '/login-logo-dark.png',
    qrCodeUrl: '/qr.png',
    appIconUrl: '/app.png',
  };

  function vm(theme = 'light') {
    return {
      $store: {
        state: { theme },
        getters: {
          runtimeContext: {},
          branding: runtimeBranding,
        },
      },
    };
  }

  it('reads customer identity and download data from runtime branding', () => {
    const branding = Login.computed.branding.call(vm());
    expect(branding).to.deep.include(runtimeBranding);
    expect(Login.computed.website.call({ branding })).to.deep.equal(runtimeBranding.website);
    expect(Login.computed.appDownloadUrl.call({ branding }))
      .to.equal(runtimeBranding.appDownloadUrl);
  });

  it('selects runtime logo and application assets without affecting legacy CSS mode', () => {
    const lightVm = {
      ...vm('light'),
      branding: runtimeBranding,
      currentTheme: 'light',
      isRuntimeProfile: true,
    };
    const darkVm = {
      ...vm('dark'),
      branding: runtimeBranding,
      currentTheme: 'dark',
      isRuntimeProfile: true,
    };

    expect(Login.computed.isRuntimeProfile.call(lightVm)).to.equal(true);
    expect(Login.computed.currentLogoUrl.call(lightVm)).to.equal('/login-logo-light.png');
    expect(Login.computed.currentLogoUrl.call(darkVm)).to.equal('/login-logo-dark.png');
    expect(Login.computed.qrCodeUrl.call(lightVm)).to.equal('/qr.png');
    expect(Login.computed.appIconUrl.call(lightVm)).to.equal('/app.png');
    expect(Login.computed.centerFormThemeClass.call(lightVm)).to.equal('');
    expect(Login.computed.centerFormThemeClass.call({
      isRuntimeProfile: false,
      currentTheme: 'dark',
    })).to.equal('dark');
  });

  it('falls back to the shared nav logo when a customer has no login-specific logo', () => {
    expect(Login.computed.currentLogoUrl.call({
      isRuntimeProfile: true,
      currentTheme: 'light',
      branding: { logoUrl: '/shared-light.png', darkLogoUrl: '/shared-dark.png' },
    })).to.equal('/shared-light.png');
    expect(Login.computed.currentLogoUrl.call({
      isRuntimeProfile: true,
      currentTheme: 'dark',
      branding: { logoUrl: '/shared-light.png', darkLogoUrl: '/shared-dark.png' },
    })).to.equal('/shared-dark.png');
  });

  it('keeps a backend Set-Cookie session when login JSON omits session', () => {
    document.cookie = 'session=router-response-session;path=/';

    LoginModule.persistLoginSession();

    expect(document.cookie).to.include('session=router-response-session');
    expect(document.cookie).not.to.include('session=undefined');
  });

  it('stores a session returned in login JSON for newer backends', () => {
    document.cookie = 'session=old-session;path=/';

    LoginModule.persistLoginSession('json-response-session');

    expect(document.cookie).to.include('session=json-response-session');
  });
});

describe('Unified login failure accounting', () => {
  it('does not count session expiry, connection failures or other errors as password mistakes', () => {
    const vm = { isRuntimeProfile: true, lockCountLeft: 3, $toast() { throw Error('duplicate toast'); } };
    [undefined, Error('offline'), { error: { code: 200101 } },
      { error: { code: 109999, reason: 'unavailable' } },
      { error: { code: 300102, reason: 'session-expired' } },
    ].forEach(error => Login.methods.curLockCount.call(vm, error));
    expect(vm.lockCountLeft).to.equal(3);
  });
  it('counts a confirmed password rejection once and keeps the page-owned message', () => {
    const messages = [];
    const vm = { isRuntimeProfile: true, lockCountLeft: 3,
      $t: key => key, $toast: message => messages.push(message) };
    Login.methods.curLockCount.call(vm, { error: { code: 300102 } });
    expect(vm.lockCountLeft).to.equal(2);
    expect(messages).to.deep.equal([300102]);
  });
});
