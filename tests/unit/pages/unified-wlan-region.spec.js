/* eslint-env mocha */
const { expect } = require('chai');

const wlanPageModule = require('../../../unified/src/pages/wlan/index.vue');

const {
  isValidRegion,
  resolveRegionCatalogue,
  toRegionOptions,
  buildInitialConfig,
} = wlanPageModule;
const wlanPage = wlanPageModule.default;

describe('unified WLAN region catalogue', () => {
  it('loads the current locale first', () => {
    const calls = [];
    const catalogue = [{ name: '中国', code: '156' }];
    const result = resolveRegionCatalogue('zh-CN', 'en-US', (locale) => {
      calls.push(locale);
      if (locale === 'zh-CN') return catalogue;
      throw new Error('missing locale');
    });

    expect(result).to.equal(catalogue);
    expect(calls).to.deep.equal(['zh-CN']);
  });

  it('falls back to the customer default locale and then en-US', () => {
    const calls = [];
    const catalogue = [{ name: 'China', code: '156' }];
    const result = resolveRegionCatalogue('es-MX', 'fr-FR', (locale) => {
      calls.push(locale);
      if (locale === 'en-US') return catalogue;
      throw new Error('missing locale');
    });

    expect(result).to.equal(catalogue);
    expect(calls).to.deep.equal(['es-MX', 'fr-FR', 'en-US']);
  });

  it('does not load the same fallback locale twice', () => {
    const calls = [];
    const catalogue = [{ name: 'China', code: '156' }];
    const result = resolveRegionCatalogue('en-US', 'en-US', (locale) => {
      calls.push(locale);
      return catalogue;
    });

    expect(result).to.equal(catalogue);
    expect(calls).to.deep.equal(['en-US']);
  });

  it('throws the last error when every region catalogue loader fails', () => {
    const calls = [];
    const errors = {
      'es-MX': new Error('missing current locale'),
      'fr-FR': new Error('missing default locale'),
      'en-US': new Error('missing fallback locale'),
    };

    expect(() => resolveRegionCatalogue('es-MX', 'fr-FR', (locale) => {
      calls.push(locale);
      throw errors[locale];
    })).to.throw(errors['en-US']);
    expect(calls).to.deep.equal(['es-MX', 'fr-FR', 'en-US']);
  });

  it('converts the complete catalogue to numeric select options', () => {
    const catalogue = [
      { name: 'Canada', code: '124' },
      { name: 'China', code: '156' },
    ];

    expect(toRegionOptions(catalogue)).to.deep.equal([
      { text: 'Canada', value: 124 },
      { text: 'China', value: 156 },
    ]);
  });

  it('accepts only region IDs present in the complete option list', () => {
    const options = [
      { text: 'Canada', value: 124 },
      { text: 'China', value: 156 },
    ];

    expect(isValidRegion(156, options)).to.equal(true);
    expect(isValidRegion('', options)).to.equal(false);
    expect(isValidRegion(840, options)).to.equal(false);
    expect(isValidRegion(156, [])).to.equal(false);
  });

  it('includes region, admin, and wifi in the initial mesh config', () => {
    const config = buildInitialConfig({
      region_id: 156,
      smart_connect: true,
      ssid24g: 'Mercku',
      password24g: 'password123',
      ssid5g: 'Mercku',
      password5g: 'password123',
    });

    expect(config.region_id).to.equal(156);
    expect(config.admin).to.deep.equal({ password: 'password123' });
    expect(config.wifi).to.deep.equal({
      bands: {
        '2.4G': { ssid: 'Mercku', password: 'password123' },
        '5G': { ssid: 'Mercku', password: 'password123' },
      },
      smart_connect: true,
    });
  });

  it('normalizes a string region ID to a decimal number in the initial mesh config', () => {
    const config = buildInitialConfig({
      region_id: '156',
    });

    expect(config.region_id).to.equal(156);
  });

  it('returns the loaded region options', () => {
    const context = {
      $i18n: { locale: 'en-US' },
      $store: { getters: { branding: { defaultLanguage: 'en-US' } } },
      regionsList: [],
    };

    const result = wlanPage.methods.loadRegionCatalogue.call(context);

    expect(result).to.equal(context.regionsList);
    expect(result.length).to.be.greaterThan(0);
  });

  it('throws an explicit error when the region catalogue is empty', () => {
    const context = {
      loadRegionCatalogue: () => [],
      regionsList: [],
      $http: {
        getRegion: () => Promise.resolve({ data: { result: { id: 156 } } }),
      },
      wifiForm: { region_id: '' },
    };

    expect(() => wlanPage.methods.loadRegion.call(context))
      .to.throw('Region catalogue is empty');
  });

  it('uses a valid ip_country_id returned by getRegion', async () => {
    const context = {
      loadRegionCatalogue: () => [
        { text: 'Canada', value: 124 },
        { text: 'China', value: 156 },
      ],
      $http: {
        getRegion: () => Promise.resolve({
          data: { result: { ip_country_id: '156', id: 124 } },
        }),
      },
      wifiForm: { region_id: '' },
    };

    await wlanPage.methods.loadRegion.call(context);

    expect(context.wifiForm.region_id).to.equal(156);
  });

  it('uses a valid id returned by getRegion when ip_country_id is absent', async () => {
    const context = {
      loadRegionCatalogue: () => [
        { text: 'Canada', value: 124 },
        { text: 'China', value: 156 },
      ],
      $http: {
        getRegion: () => Promise.resolve({ data: { result: { id: '124' } } }),
      },
      wifiForm: { region_id: '' },
    };

    await wlanPage.methods.loadRegion.call(context);

    expect(context.wifiForm.region_id).to.equal(124);
  });

  it('uses the fallback region when getRegion returns an unknown ID', async () => {
    const context = {
      loadRegionCatalogue: () => [
        { text: 'Canada', value: 124 },
        { text: 'China', value: 156 },
      ],
      $http: {
        getRegion: () => Promise.resolve({ data: { result: { id: 840 } } }),
      },
      wifiForm: { region_id: '' },
    };

    await wlanPage.methods.loadRegion.call(context);

    expect(context.wifiForm.region_id).to.equal(124);
  });

  it('uses the fallback region when getRegion rejects', async () => {
    const context = {
      loadRegionCatalogue: () => [{ text: 'Canada', value: 124 }],
      $http: {
        getRegion: () => Promise.reject(new Error('request failed')),
      },
      wifiForm: { region_id: '' },
    };

    await wlanPage.methods.loadRegion.call(context);

    expect(context.wifiForm.region_id).to.equal(124);
  });

  it('uses the fallback region when getRegion has no result', async () => {
    const context = {
      loadRegionCatalogue: () => [{ text: 'Canada', value: 124 }],
      regionsList: [{ text: 'Canada', value: 124 }],
      $http: {
        getRegion: () => Promise.resolve({ data: {} }),
      },
      wifiForm: { region_id: '' },
    };

    await wlanPage.methods.loadRegion.call(context);

    expect(context.wifiForm.region_id).to.equal(124);
  });
});
