/* eslint-env mocha */
const { expect } = require('chai');

const {
  FRP_DEFAULT_SSH_PORT,
  FRP_DEFAULT_WEB_PORT,
  FRP_SK_LENGTH,
  buildFrpUpdateParams,
  generateFrpSk,
  isValidFrpPort,
  normalizeFrpConfig,
  withEnabledState
} = require('../../../base/src/util/frp');

const { getMockResult } = require('../../../unified/dev/offline-api-middleware');
const frpPageModule = require('../../../base/src/pages/bussiness/advance/frp.vue');

const frpPage = frpPageModule.default;

function createPageContext(overrides = {}) {
  const calls = [];
  const context = {
    frp: {
      enabled: false,
      sk: '',
      web_port: String(FRP_DEFAULT_WEB_PORT),
      ssh_port: String(FRP_DEFAULT_SSH_PORT)
    },
    saved: {
      enabled: false,
      sk: '',
      web_port: String(FRP_DEFAULT_WEB_PORT),
      ssh_port: String(FRP_DEFAULT_SSH_PORT)
    },
    $refs: { frp: { validate: () => true } },
    $loading: { open() {}, close() {} },
    $toast() {},
    calls,
    $http: {
      updateFRP(params) {
        calls.push(params);
        return Promise.resolve({ data: { result: {} } });
      }
    },
    ...overrides
  };
  // Methods call each other through `this`, so give the fake instance the
  // page's method set (overrides above still win when a test replaces one).
  Object.keys(frpPage.methods).forEach((name) => {
    if (!Object.prototype.hasOwnProperty.call(context, name)) {
      context[name] = frpPage.methods[name];
    }
  });
  return context;
}

describe('FRP (STCP) configuration helpers', () => {
  it('falls back to web 80 / ssh 22 when the device returns nothing', () => {
    expect(normalizeFrpConfig()).to.deep.equal({
      enabled: false,
      sk: '',
      web_port: String(FRP_DEFAULT_WEB_PORT),
      ssh_port: String(FRP_DEFAULT_SSH_PORT)
    });
    expect(normalizeFrpConfig({})).to.deep.equal(normalizeFrpConfig());
  });

  it('keeps valid ports and rejects unusable ones', () => {
    const config = normalizeFrpConfig({
      enabled: true,
      sk: 'K3Y',
      web_port: 8080,
      ssh_port: '2222'
    });

    expect(config.enabled).to.equal(true);
    expect(config.sk).to.equal('K3Y');
    expect(config.web_port).to.equal('8080');
    expect(config.ssh_port).to.equal('2222');

    ['', 0, -1, 65536, 'abc', null].forEach((value) => {
      expect(isValidFrpPort(value), `port ${value}`).to.equal(false);
      const port = normalizeFrpConfig({ web_port: value }).web_port;
      expect(port).to.equal(String(FRP_DEFAULT_WEB_PORT));
    });

    expect(isValidFrpPort('65535')).to.equal(true);
    expect(isValidFrpPort(1)).to.equal(true);
  });

  it('coerces the enabled flag from booleans and 1/0 wire values', () => {
    expect(normalizeFrpConfig({ enabled: true }).enabled).to.equal(true);
    expect(normalizeFrpConfig({ enabled: 1 }).enabled).to.equal(true);
    expect(normalizeFrpConfig({ enabled: '1' }).enabled).to.equal(true);
    expect(normalizeFrpConfig({ enabled: false }).enabled).to.equal(false);
    expect(normalizeFrpConfig({ enabled: 0 }).enabled).to.equal(false);
    expect(normalizeFrpConfig({ enabled: 'true' }).enabled).to.equal(false);
  });

  it('generates an unambiguous random key of the default length', () => {
    const sk = generateFrpSk();

    expect(sk).to.have.lengthOf(FRP_SK_LENGTH);
    // 0/O, 1/l/I are intentionally absent from the alphabet.
    expect(sk).to.match(/^[A-HJ-NP-Za-km-z2-9]+$/);
    expect(generateFrpSk()).to.not.equal(sk);
    expect(generateFrpSk(8)).to.have.lengthOf(8);
  });

  it('clears the key on disable and always mints a new one on re-enable', () => {
    const enabled = withEnabledState(
      { enabled: false, sk: '', web_port: '8080', ssh_port: '2222' },
      true
    );

    expect(enabled.enabled).to.equal(true);
    expect(enabled.sk).to.have.lengthOf(FRP_SK_LENGTH);
    expect(enabled.web_port).to.equal('8080');

    const disabled = withEnabledState(enabled, false);
    expect(disabled.enabled).to.equal(false);
    expect(disabled.sk).to.equal('');

    const reEnabled = withEnabledState(disabled, true);
    expect(reEnabled.sk).to.have.lengthOf(FRP_SK_LENGTH);
    expect(reEnabled.sk).to.not.equal(enabled.sk);
  });

  it('sends ports as numbers and never leaks a key while disabled', () => {
    expect(buildFrpUpdateParams({
      enabled: true,
      sk: 'K3Y',
      web_port: '8080',
      ssh_port: '2222'
    })).to.deep.equal({
      enabled: true,
      sk: 'K3Y',
      web_port: 8080,
      ssh_port: 2222
    });

    expect(buildFrpUpdateParams({
      enabled: false,
      sk: 'K3Y',
      web_port: '80',
      ssh_port: '22'
    })).to.deep.equal({
      enabled: false,
      sk: '',
      web_port: 80,
      ssh_port: 22
    });
  });
});

describe('FRP page behaviour', () => {
  it('enabling mints a key and posts the complete configuration', async () => {
    const context = createPageContext();

    await frpPage.methods.onEnabledChange.call(context, true);

    expect(context.frp.enabled).to.equal(true);
    expect(context.frp.sk).to.have.lengthOf(FRP_SK_LENGTH);
    expect(context.calls).to.have.lengthOf(1);
    expect(context.calls[0]).to.deep.equal({
      enabled: true,
      sk: context.frp.sk,
      web_port: FRP_DEFAULT_WEB_PORT,
      ssh_port: FRP_DEFAULT_SSH_PORT
    });
    // The acknowledged state is what a failed request would roll back to.
    expect(context.saved).to.deep.equal(context.frp);
  });

  it('disabling clears the key and posts an empty one', async () => {
    const context = createPageContext({
      frp: { enabled: true, sk: 'OLDKEY', web_port: '80', ssh_port: '22' },
      saved: { enabled: true, sk: 'OLDKEY', web_port: '80', ssh_port: '22' }
    });

    await frpPage.methods.onEnabledChange.call(context, false);

    expect(context.frp.enabled).to.equal(false);
    expect(context.frp.sk).to.equal('');
    expect(context.calls[0]).to.deep.equal({
      enabled: false,
      sk: '',
      web_port: 80,
      ssh_port: 22
    });
  });

  it('re-enabling after a disable mints a different key', async () => {
    const context = createPageContext();

    await frpPage.methods.onEnabledChange.call(context, true);
    const firstSk = context.frp.sk;
    await frpPage.methods.onEnabledChange.call(context, false);
    expect(context.frp.sk).to.equal('');
    await frpPage.methods.onEnabledChange.call(context, true);

    expect(context.calls).to.have.lengthOf(3);
    expect(context.frp.sk).to.have.lengthOf(FRP_SK_LENGTH);
    expect(context.frp.sk).to.not.equal(firstSk);
  });

  it('rolls the form back to the acknowledged state when the device rejects', async () => {
    const context = createPageContext({
      $http: {
        updateFRP() {
          return Promise.reject(new Error('rpc failed'));
        }
      }
    });

    await frpPage.methods.onEnabledChange.call(context, true);

    expect(context.frp).to.deep.equal(context.saved);
    expect(context.frp.enabled).to.equal(false);
    expect(context.frp.sk).to.equal('');
  });

  it('does not regenerate a key while FRP is disabled', async () => {
    const context = createPageContext();

    await frpPage.methods.regenerateSk.call(context);

    expect(context.calls).to.have.lengthOf(0);
    expect(context.frp.sk).to.equal('');
  });

  it('saves edited ports without touching the current key', async () => {
    const context = createPageContext({
      frp: { enabled: true, sk: 'STABLEKEY', web_port: '8080', ssh_port: '2222' },
      saved: { enabled: true, sk: 'STABLEKEY', web_port: '80', ssh_port: '22' }
    });

    await frpPage.methods.save.call(context);

    expect(context.calls[0]).to.deep.equal({
      enabled: true,
      sk: 'STABLEKEY',
      web_port: 8080,
      ssh_port: 2222
    });
    expect(context.frp.web_port).to.equal('8080');
  });

  it('keeps the typed ports when validation fails', async () => {
    const context = createPageContext({
      $refs: { frp: { validate: () => false } },
      frp: { enabled: false, sk: '', web_port: '70000', ssh_port: '22' }
    });

    const result = await frpPage.methods.save.call(context);

    expect(result).to.equal(false);
    expect(context.calls).to.have.lengthOf(0);
    expect(context.frp.web_port).to.equal('70000');
  });
});

describe('offline FRP fixtures', () => {
  it('mirrors the enable/disable key contract', () => {
    expect(getMockResult('router.frp.get')).to.deep.equal({
      enabled: false,
      sk: '',
      web_port: 80,
      ssh_port: 22
    });

    getMockResult('router.frp.update', {
      enabled: true,
      sk: 'PREVIEWKEY',
      web_port: 8080,
      ssh_port: 2222
    });
    expect(getMockResult('router.frp.get')).to.deep.equal({
      enabled: true,
      sk: 'PREVIEWKEY',
      web_port: 8080,
      ssh_port: 2222
    });

    getMockResult('router.frp.update', {
      enabled: false,
      sk: '',
      web_port: 8080,
      ssh_port: 2222
    });
    const disabled = getMockResult('router.frp.get');
    expect(disabled.enabled).to.equal(false);
    expect(disabled.sk).to.equal('');
  });
});
