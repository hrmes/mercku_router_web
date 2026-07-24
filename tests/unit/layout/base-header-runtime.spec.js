/* eslint-env mocha */
const { expect } = require('chai');

const Header = require('../../../base/src/component/header/header.vue').default;
const languageMixin = require('../../../base/src/mixins/language.js').default;

function deepFreeze(value) {
  Object.freeze(value);
  Object.keys(value).forEach((key) => {
    if (value[key] && typeof value[key] === 'object') deepFreeze(value[key]);
  });
  return value;
}

describe('Base Header runtime compatibility', () => {
  it('decorates a frozen menu without mutating its input', () => {
    const navs = deepFreeze([
      {
        name: 'setting',
        url: '/setting/wifi',
        children: [
          { name: 'wifi', url: '/setting/wifi' },
          { name: 'wan', url: '/setting/wan' },
        ],
      },
    ]);
    const before = JSON.stringify(navs);

    const result = Header.methods.getList.call({ navs, $route: { path: '/setting/wan' } });

    expect(JSON.stringify(navs)).to.equal(before);
    expect(navs[0]).to.not.have.property('key');
    expect(navs[0].children[0]).to.not.have.property('index');
    expect(result[0]).to.include({ key: 0, selected: true, showChild: false });
    expect(result[0].children[1]).to.include({ index: 1, selected: true });
  });

  it('does not select WAN while visiting WAN Ping', () => {
    const navs = [{
      name: 'setting',
      url: '/setting/wifi',
      children: [
        { name: 'wan', url: '/setting/wan' },
        { name: 'wanping', url: '/setting/wanping' },
      ],
    }];

    const [setting] = Header.methods.getList.call({
      navs,
      $route: { path: '/setting/wanping' },
    });

    expect(setting.children[0].selected).to.equal(false);
    expect(setting.children[1].selected).to.equal(true);
  });

  it('reads website and logo from runtime branding', () => {
    const vm = {
      $store: {
        getters: {
          branding: {
            productName: 'Runtime Router',
            website: { text: 'Support', url: 'https://example.com' },
            languages: ['sv-SE'],
            logoUrl: '/runtime-logo.svg',
            darkLogoUrl: '/runtime-logo-dark.svg',
          },
        },
      },
    };

    const branding = Header.computed.branding.call(vm);
    expect(branding.logoUrl).to.equal('/runtime-logo.svg');
    expect(branding.darkLogoUrl).to.equal('/runtime-logo-dark.svg');
    expect(Header.computed.website.call({ branding })).to.deep.equal({
      text: 'Support',
      url: 'https://example.com',
    });
    expect(languageMixin.computed.Languages.call(vm).map(item => item.value)).to.deep.equal([
      'sv-SE',
    ]);
  });

  it('uses the dark logo in dark mode and falls back to the default logo', () => {
    const branding = {
      logoUrl: '/runtime-logo-light.svg',
      darkLogoUrl: '/runtime-logo-dark.svg',
    };

    expect(Header.computed.currentLogoUrl.call({
      branding,
      currentTheme: 'dark',
    })).to.equal('/runtime-logo-dark.svg');
    expect(Header.computed.currentLogoUrl.call({
      branding,
      currentTheme: 'light',
    })).to.equal('/runtime-logo-light.svg');
    expect(Header.computed.currentLogoUrl.call({
      branding: { logoUrl: '/runtime-logo.svg' },
      currentTheme: 'dark',
    })).to.equal('/runtime-logo.svg');
  });

  it('falls back to English when configured languages are invalid', () => {
    const vm = { $store: { getters: { branding: { languages: ['xx-XX'] } } } };
    expect(languageMixin.computed.Languages.call(vm).map(item => item.value)).to.deep.equal([
      'en-US',
    ]);
  });
});
