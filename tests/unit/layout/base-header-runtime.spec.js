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
    const makeVm = (currentTheme, prefersDark) => ({
      branding,
      currentTheme,
      prefersDark,
      normalizeTheme: Header.methods.normalizeTheme,
      // 用 getter 模拟 Vue 计算属性：直接放函数会变成 truthy 的普通属性
      get isDarkTheme() {
        return Header.computed.isDarkTheme.call(this);
      },
    });

    expect(Header.computed.currentLogoUrl.call(makeVm('dark', false))).to.equal('/runtime-logo-dark.svg');
    expect(Header.computed.currentLogoUrl.call(makeVm('light', false))).to.equal('/runtime-logo-light.svg');
    expect(Header.computed.currentLogoUrl.call(makeVm('dark', false))).to.equal('/runtime-logo-dark.svg');
    // auto 跟随系统深浅色
    expect(Header.computed.currentLogoUrl.call(makeVm('auto', true))).to.equal('/runtime-logo-dark.svg');
    expect(Header.computed.currentLogoUrl.call(makeVm('auto', false))).to.equal('/runtime-logo-light.svg');
    expect(Header.computed.currentLogoUrl.call(makeVm('auto', true))).to.equal('/runtime-logo-dark.svg');
    // 脏值回退 light
    expect(Header.computed.currentLogoUrl.call(makeVm(undefined, true))).to.equal('/runtime-logo-light.svg');
    expect(Header.computed.currentLogoUrl.call({
      branding: { logoUrl: '/runtime-logo.svg' },
      currentTheme: 'dark',
      prefersDark: false,
      normalizeTheme: Header.methods.normalizeTheme,
      get isDarkTheme() {
        return Header.computed.isDarkTheme.call(this);
      },
    })).to.equal('/runtime-logo.svg');
  });

  it('normalizes theme values to light/dark/auto only', () => {
    expect(Header.methods.normalizeTheme('dark')).to.equal('dark');
    expect(Header.methods.normalizeTheme('auto')).to.equal('auto');
    expect(Header.methods.normalizeTheme('light')).to.equal('light');
    expect(Header.methods.normalizeTheme('')).to.equal('light');
    expect(Header.methods.normalizeTheme(null)).to.equal('light');
    expect(Header.methods.normalizeTheme('neon')).to.equal('light');
  });

  it('isDarkTheme resolves auto mode against the system scheme', () => {
    const makeVm = (currentTheme, prefersDark) => ({
      currentTheme,
      prefersDark,
      normalizeTheme: Header.methods.normalizeTheme,
    });

    expect(Header.computed.isDarkTheme.call(makeVm('dark', false))).to.equal(true);
    expect(Header.computed.isDarkTheme.call(makeVm('light', true))).to.equal(false);
    expect(Header.computed.isDarkTheme.call(makeVm('auto', true))).to.equal(true);
    expect(Header.computed.isDarkTheme.call(makeVm('auto', false))).to.equal(false);
    expect(Header.computed.isDarkTheme.call(makeVm(undefined, true))).to.equal(false);
  });

  it('openThemeModal syncs selectedTheme from stored theme instead of stale state', () => {
    const makeVm = () => ({
      themeOptions: {
        light: { ischecked: true },
        dark: { ischecked: false },
        auto: { ischecked: false },
      },
      selectedTheme: 'light',
      ThemechangeVisiable: false,
      normalizeTheme: Header.methods.normalizeTheme,
    });
    // 本机 jsdom 版本不保证存在 localStorage，缺失时先补一个可配置的 stub
    const hadStorage = typeof global.localStorage !== 'undefined';
    const savedDescriptor = hadStorage
      ? Object.getOwnPropertyDescriptor(global.localStorage, 'getItem')
      : undefined;
    if (!hadStorage) {
      Object.defineProperty(global, 'localStorage', { value: {}, configurable: true });
    }
    const restoreStorage = () => {
      if (savedDescriptor) {
        Object.defineProperty(global.localStorage, 'getItem', savedDescriptor);
      }
    };

    // 弹窗打开时不点选项直接确认，也必须按当前 dark 应用，不能残留 'light'
    Object.defineProperty(global.localStorage, 'getItem', {
      value: () => 'dark',
      configurable: true,
    });
    try {
      const vm = makeVm();
      Header.methods.openThemeModal.call(vm);
      expect(vm.selectedTheme).to.equal('dark');
      expect(vm.themeOptions.dark.ischecked).to.equal(true);
      expect(vm.themeOptions.light.ischecked).to.equal(false);
      expect(vm.ThemechangeVisiable).to.equal(true);
    } finally {
      restoreStorage();
    }

    // 脏值回退 light，不抛 TypeError
    Object.defineProperty(global.localStorage, 'getItem', {
      value: () => 'neon',
      configurable: true,
    });
    try {
      const dirty = makeVm();
      dirty.selectedTheme = 'auto';
      Header.methods.openThemeModal.call(dirty);
      expect(dirty.selectedTheme).to.equal('light');
      expect(dirty.themeOptions.light.ischecked).to.equal(true);
    } finally {
      restoreStorage();
    }
  });

  it('does not push when the logo target is already active', () => {
    let pushed = false;
    const vm = {
      navVisible: true,
      mobileI18nVisible: false,
      mobileNavVisible: false,
      $route: { path: '/dashboard' },
      $router: { push() { pushed = true; } },
    };

    Header.methods.forward2Page.call(vm, '/dashboard');

    expect(pushed).to.equal(false);
  });

  it('pushes when the logo target differs from the active route', () => {
    let pushedPath = '';
    const vm = {
      navVisible: true,
      mobileI18nVisible: false,
      mobileNavVisible: false,
      $route: { path: '/setting/wan' },
      $router: { push({ path }) { pushedPath = path; } },
    };

    Header.methods.forward2Page.call(vm, '/dashboard');

    expect(pushedPath).to.equal('/dashboard');
  });

  it('falls back to English when configured languages are invalid', () => {
    const vm = { $store: { getters: { branding: { languages: ['xx-XX'] } } } };
    expect(languageMixin.computed.Languages.call(vm).map(item => item.value)).to.deep.equal([
      'en-US',
    ]);
  });
});
