/* eslint-env mocha */
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { mount } = require('@vue/test-utils');
const {
  FRP_SK_LENGTH, buildFrpUpdateParams, cloneFrpConfig, createFrpProxyNames,
  generateFrpSk, isValidFrpPort, isValidFrpProxyName, isValidFrpServer,
  normalizeFrpConfig, withEnabledState
} = require('../../../base/src/util/frp');
const { getMockResult } = require('../../../unified/dev/offline-api-middleware');
const frpPage = require('../../../base/src/pages/bussiness/advance/frp.vue').default;
const Form = require('../../../base/src/component/form/index.vue').default;
const FormItem = require('../../../base/src/component/formItem/index.vue').default;
const Input = require('../../../base/src/component/input/input.vue').default;
const Switch = require('../../../base/src/component/switch/index.vue').default;

function sampleConfig(enabled = false) {
  return {
    enabled,
    server_addr: 'frps.example.com',
    server_port: 7000,
    token: 'server-token',
    sk: enabled ? 'SHAREDKEY' : '',
    proxies: [
      { name: 'office_web', local_ip: '192.168.1.20', local_port: 80 },
      { name: 'office_ssh', local_ip: '192.168.1.30', local_port: 22 }
    ]
  };
}

function createPageContext(config = sampleConfig(), overrides = {}) {
  const calls = [];
  const context = {
    ...frpPage.data.call({ $t: key => key }),
    ready: true,
    $refs: { frp: { validate: () => true } },
    $nextTick: callback => callback(),
    $loading: { open() {}, close() {} },
    $toast() {},
    $t: key => key,
    calls,
    $http: {
      getFRP: () => Promise.resolve({ data: { result: config } }),
      updateFRP(params) { calls.push(params); return Promise.resolve(); }
    }
  };
  Object.assign(context, frpPage.methods);
  context.frp = context.withProxyKeys(normalizeFrpConfig(config));
  context.saved = cloneFrpConfig(context.frp);
  return Object.assign(context, overrides);
}

function loadFrpRuntime(globals) {
  const source = fs.readFileSync(path.resolve(process.cwd(), 'base/src/util/frp.js'), 'utf8');
  return vm.runInNewContext(
    `${source.replace(/^export /gm, '')}\n({ generateFrpSk });`, globals
  );
}

function withoutSecureRandom(callback) {
  const targets = [global, window];
  const descriptors = targets.map(target => Object.getOwnPropertyDescriptor(target, 'crypto'));
  try {
    targets.forEach(target => Object.defineProperty(target, 'crypto', {
      configurable: true, value: null
    }));
    return callback();
  } finally {
    targets.forEach((target, index) => {
      if (descriptors[index]) Object.defineProperty(target, 'crypto', descriptors[index]);
      else delete target.crypto;
    });
  }
}

const flush = () => new Promise(resolve => setTimeout(resolve, 0));

function mountPage(config = sampleConfig()) {
  const calls = [];
  const wrapper = mount({
    ...frpPage,
    components: { 'm-form': Form, 'm-form-item': FormItem, 'm-input': Input, 'm-switch': Switch }
  }, {
    mocks: {
      $store: { state: {} },
      $t: key => key,
      $loading: { open() {}, close() {} },
      $toast() {},
      $http: {
        getFRP: () => Promise.resolve({ data: { result: config } }),
        updateFRP: params => { calls.push(params); return Promise.resolve(); }
      }
    }
  });
  return { wrapper, calls };
}

describe('FRP list configuration helpers', () => {
  it('migrates empty legacy responses into the Web 80 / SSH 22 defaults', () => {
    expect(normalizeFrpConfig().proxies).to.deep.equal([
      { name: '', local_ip: '127.0.0.1', local_port: '80' },
      { name: '', local_ip: '127.0.0.1', local_port: '22' }
    ]);
  });

  it('migrates all existing Web/SSH names and LAN targets without losing settings', () => {
    const config = normalizeFrpConfig({
      enabled: true,
      sk: 'KEY',
      web_name: 'existing_web',
      ssh_name: 'existing_ssh',
      web_ip: '192.168.10.20',
      web_port: 8080,
      ssh_ip: '192.168.10.30',
      ssh_port: 2222
    });
    expect(config.sk).to.equal('KEY');
    expect(config.proxies).to.deep.equal([
      { name: 'existing_web', local_ip: '192.168.10.20', local_port: '8080' },
      { name: 'existing_ssh', local_ip: '192.168.10.30', local_port: '2222' }
    ]);
  });

  it('prefers an explicit proxy list over stale legacy fields, including an empty list', () => {
    expect(normalizeFrpConfig({ proxies: [], web_name: 'ghost', web_port: 80 }).proxies)
      .to.deep.equal([]);
    const config = normalizeFrpConfig({ ...sampleConfig(), web_name: 'ghost' });
    expect(config.proxies[0].name).to.equal('office_web');
  });

  it('rejects a malformed list instead of silently replacing it with default proxies', () => {
    [null, {}, 'invalid'].forEach(proxies => {
      expect(() => normalizeFrpConfig({ proxies })).to.throw('Invalid FRP proxy list');
    });
  });

  it('sends all proxies with numeric ports and excludes UI keys and legacy fields', () => {
    const config = normalizeFrpConfig(sampleConfig(true));
    config.proxies.push({ _key: 123, name: ' nas ', local_ip: ' 192.168.1.50 ', local_port: '5000' });
    const wire = buildFrpUpdateParams(config);
    expect(wire.proxies).to.have.lengthOf(3);
    expect(wire.proxies[2]).to.deep.equal({
      name: 'nas', local_ip: '192.168.1.50', local_port: 5000
    });
    expect(wire).to.not.have.property('web_port');
    expect(wire).to.not.have.property('ssh_name');
    expect(wire.proxies[2]).to.not.have.property('_key');
    expect(buildFrpUpdateParams({ ...config, enabled: false }).sk).to.equal('');
  });

  it('deep clones rows so editing, adding or removing drafts never changes the saved state', () => {
    const saved = normalizeFrpConfig(sampleConfig());
    const draft = cloneFrpConfig(saved);
    draft.proxies[0].name = 'changed';
    draft.proxies.splice(1, 1);
    expect(saved.proxies).to.have.lengthOf(2);
    expect(saved.proxies[0].name).to.equal('office_web');
  });

  it('validates proxy names, server addresses and strict port ranges', () => {
    ['office_web', '1', 'router-01.ssh', 'x'.repeat(128)]
      .forEach(value => expect(isValidFrpProxyName(value)).to.equal(true));
    ['', 'bad name', 'name=value', '[name]', '.web', 'x'.repeat(129)]
      .forEach(value => expect(isValidFrpProxyName(value)).to.equal(false));
    ['frps.example.com', 'frps', '192.168.1.2']
      .forEach(value => expect(isValidFrpServer(value)).to.equal(true));
    ['', '999.1.2.3', 'https://frps.example.com', 'frps:7000', 'bad host']
      .forEach(value => expect(isValidFrpServer(value)).to.equal(false));
    ['', 0, -1, 65536, 'abc', null, '1e3', '0x50', '80.0', true]
      .forEach(value => expect(isValidFrpPort(value)).to.equal(false));
    [1, '65535'].forEach(value => expect(isValidFrpPort(value)).to.equal(true));
  });

  it('retains valid device ports and falls back only when normalizing unusable responses', () => {
    expect(normalizeFrpConfig({ server_port: -1 }).server_port).to.equal('7000');
    expect(normalizeFrpConfig({ web_port: 8080, ssh_port: '2222' }).proxies
      .map(proxy => proxy.local_port)).to.deep.equal(['8080', '2222']);
  });

  it('keeps malformed dynamic ports invalid and limits defaults to legacy migration', () => {
    [undefined, null, '', 0, -1, 65536, 'abc', '70000', '1e3', '0x50', true, {}, [80]]
      .forEach(value => {
        const config = sampleConfig(true);
        config.proxies[0].local_port = value;
        const expected = typeof value === 'string' || typeof value === 'number'
          ? String(value) : '';
        const form = normalizeFrpConfig(config);
        expect(form.proxies[0].local_port).to.equal(expected);
        expect(isValidFrpPort(form.proxies[0].local_port)).to.equal(false);
        expect(withEnabledState(form, true).proxies[0].local_port).to.equal(expected);
        expect(normalizeFrpConfig(form).proxies[0].local_port).to.equal(expected);

        const legacy = normalizeFrpConfig({ web_port: value, ssh_port: value });
        expect(legacy.proxies.map(proxy => proxy.local_port)).to.deep.equal(['80', '22']);
      });
  });

  it('normalizes the enabled flag without accepting arbitrary truthy strings', () => {
    [true, 1, '1'].forEach(enabled => expect(normalizeFrpConfig({ enabled }).enabled).to.equal(true));
    [false, 0, 'true'].forEach(enabled => {
      expect(normalizeFrpConfig({ enabled }).enabled).to.equal(false);
    });
  });

  it('suggests stable device-specific legacy names and avoids a shared anonymous default', () => {
    expect(createFrpProxyNames(' DEVICE:01 ')).to.deep.equal({
      web_name: 'router_DEVICE_01_web', ssh_name: 'router_DEVICE_01_ssh'
    });
    expect(createFrpProxyNames()).to.deep.equal({ web_name: '', ssh_name: '' });
  });

  it('preserves proxy lists across disable and re-enable while rotating an empty key', () => {
    const enabled = withEnabledState(sampleConfig(), true);
    expect(enabled.sk).to.have.lengthOf(FRP_SK_LENGTH);
    const disabled = withEnabledState(enabled, false);
    expect(disabled.sk).to.equal('');
    const next = withEnabledState(disabled, true);
    expect(next.sk).to.not.equal(enabled.sk);
    expect(next.proxies).to.deep.equal(enabled.proxies);
    expect(withEnabledState({ ...disabled, sk: 'SUPPLIED' }, true).sk).to.equal('SUPPLIED');
  });

  it('generates unambiguous secure random keys', () => {
    const key = generateFrpSk();
    expect(key).to.have.lengthOf(FRP_SK_LENGTH);
    expect(key).to.match(/^[A-HJ-NP-Za-km-z2-9]+$/);
    expect(generateFrpSk()).to.not.equal(key);
    expect(generateFrpSk(8)).to.have.lengthOf(8);
  });

  it('supports window.crypto in older WebViews without globalThis', () => {
    const runtime = loadFrpRuntime({
      globalThis: undefined, window: { crypto: { getRandomValues: bytes => bytes.fill(2) } }
    });
    expect(runtime.generateFrpSk()).to.equal('C'.repeat(FRP_SK_LENGTH));
  });

  it('never falls back to Math.random and propagates secure provider failures', () => {
    const runtime = loadFrpRuntime({ globalThis: undefined, window: {} });
    expect(() => runtime.generateFrpSk()).to.throw('Secure random');
    const broken = loadFrpRuntime({ globalThis: {
      crypto: { getRandomValues() { throw new Error('provider failed'); } }
    } });
    expect(() => broken.generateFrpSk()).to.throw('provider failed');
  });
});

describe('FRP editable proxy list behavior', () => {
  it('adds and removes draft rows without requests or saved-state mutations', () => {
    const context = createPageContext();
    const saved = cloneFrpConfig(context.saved);
    context.addProxy();
    expect(context.frp.proxies).to.have.lengthOf(3);
    expect(context.frp.proxies[2].local_port).to.equal('');
    expect(context.frp.proxies[2].local_ip).to.equal('127.0.0.1');
    context.frp.proxies[0].name = 'edited';
    context.removeProxy(1);
    expect(context.saved).to.deep.equal(saved);
    expect(context.calls).to.have.lengthOf(0);
    expect(frpPage.computed.proxyNamesChanged.call(context)).to.equal(true);
  });

  it('keeps row keys unique after deleting a middle row and adding another', () => {
    const context = createPageContext();
    context.addProxy();
    const last = context.frp.proxies[2]._key;
    context.removeProxy(1);
    context.addProxy();
    expect(context.frp.proxies[1]._key).to.equal(last);
    expect(new Set(context.frp.proxies.map(proxy => proxy._key)).size).to.equal(3);
  });

  it('migrates legacy rows and suggests names without marking suggestions acknowledged', async () => {
    const context = createPageContext({ web_port: 8080, ssh_port: 2222 });
    context.$http.getRouter = () => Promise.resolve({ data: { result: { sn: 'DEVICE01' } } });
    expect(await context.getFrp()).to.equal(true);
    expect(context.frp.proxies.map(proxy => proxy.name))
      .to.deep.equal(['router_DEVICE01_web', 'router_DEVICE01_ssh']);
    expect(context.saved.proxies[0].name).to.equal('');
    expect(context.frp.proxies[0].local_port).to.equal('8080');
  });

  it('preserves supplied list names and suggests generic names only for missing entries', async () => {
    const config = sampleConfig();
    config.proxies.push({ name: '', local_ip: '192.168.1.50', local_port: 5000 });
    const context = createPageContext(config);
    context.$http.getRouter = () => Promise.resolve({ data: { result: { sn: 'DEVICE01' } } });
    await context.getFrp();
    expect(context.frp.proxies.map(proxy => proxy.name))
      .to.deep.equal(['office_web', 'office_ssh', 'router_DEVICE01_proxy_3']);
  });

  it('keeps manual configuration available when metadata lookup fails', async () => {
    const context = createPageContext({});
    context.$http.getRouter = () => Promise.reject(new Error('metadata unavailable'));
    expect(await context.getFrp()).to.equal(true);
    expect(context.ready).to.equal(true);
    expect(context.frp.proxies[0].name).to.equal('');
  });

  it('does not resurrect default rows or request metadata for an explicitly empty list', async () => {
    const context = createPageContext({ ...sampleConfig(), proxies: [] });
    context.$http.getRouter = () => { throw new Error('must not fetch'); };
    expect(await context.getFrp()).to.equal(true);
    expect(context.frp.proxies).to.deep.equal([]);
    expect(await context.save()).to.equal(true);
    expect(context.calls[0].proxies).to.deep.equal([]);
  });

  it('blocks edits, copying and writes before a successful read', async () => {
    const context = createPageContext(sampleConfig(), { ready: false });
    const saved = cloneFrpConfig(context.saved);
    context.addProxy();
    context.removeProxy(0);
    expect(await context.copyProxyName(0)).to.equal(false);
    expect(await context.save()).to.equal(false);
    expect(await context.onEnabledChange(true)).to.equal(false);
    expect(context.frp).to.deep.equal(saved);
    expect(context.calls).to.have.lengthOf(0);
  });

  it('blocks concurrent list changes while a write is pending', async () => {
    let resolveUpdate;
    const context = createPageContext();
    context.$http.updateFRP = params => {
      context.calls.push(params);
      return new Promise(resolve => { resolveUpdate = resolve; });
    };
    const request = context.save();
    context.addProxy();
    context.removeProxy(0);
    expect(await context.save()).to.equal(false);
    expect(await context.getFrp()).to.equal(false);
    expect(await context.regenerateSk()).to.equal(false);
    expect(await context.copyProxyName(0)).to.equal(false);
    expect(context.frp.proxies).to.have.lengthOf(2);
    resolveUpdate();
    expect(await request).to.equal(true);
  });

  it('keeps writes blocked after a failed read and allows retrying', async () => {
    const context = createPageContext();
    context.$http.getFRP = () => Promise.reject(new Error('read failed'));
    expect(await context.getFrp()).to.equal(false);
    expect(await context.save()).to.equal(false);
    context.$http.getFRP = () => Promise.resolve({ data: { result: sampleConfig() } });
    expect(await context.getFrp()).to.equal(true);
  });

  it('fails closed when the device returns a malformed proxy list', async () => {
    const context = createPageContext();
    context.$http.getFRP = () => Promise.resolve({ data: { result: { proxies: {} } } });
    expect(await context.getFrp()).to.equal(false);
    expect(context.ready).to.equal(false);
  });

  it('saves the complete edited list and reads it back', async () => {
    const context = createPageContext(sampleConfig(true));
    context.addProxy();
    Object.assign(context.frp.proxies[2], {
      name: 'nas', local_ip: '192.168.1.50', local_port: '5000'
    });
    expect(await context.save()).to.equal(true);
    expect(context.calls[0].proxies[2].local_port).to.equal(5000);
    context.$http.getFRP = () => Promise.resolve({ data: { result: context.calls[0] } });
    await context.getFrp();
    expect(context.frp.proxies[2].name).to.equal('nas');
    expect(context.frp.sk).to.equal('SHAREDKEY');
    expect(frpPage.computed.proxyNamesChanged.call(context)).to.equal(false);
  });

  it('restores all rows and nested fields when saving edits/deletions/additions fails', async () => {
    const context = createPageContext(sampleConfig(true));
    const saved = cloneFrpConfig(context.saved);
    context.frp.proxies[0].name = 'edited';
    context.removeProxy(1);
    context.addProxy();
    context.$http.updateFRP = () => Promise.reject(new Error('device rejected'));
    expect(await context.save()).to.equal(false);
    expect(context.frp).to.deep.equal(saved);
    context.frp.proxies[0].local_ip = '192.168.1.99';
    expect(context.saved).to.deep.equal(saved);
  });

  it('never replaces a typed invalid port with a default while enabling', async () => {
    const context = createPageContext();
    context.frp.proxies[0].local_port = '70000';
    context.$refs.frp.validate = () => false;
    expect(await context.onEnabledChange(true)).to.equal(false);
    expect(context.frp.proxies[0].local_port).to.equal('70000');
    expect(context.calls).to.have.lengthOf(0);
  });

  it('can stop the acknowledged service despite invalid or deleted draft rows', async () => {
    const context = createPageContext(sampleConfig(true));
    context.frp.proxies = [];
    context.$refs.frp.validate = () => false;
    expect(await context.onEnabledChange(false)).to.equal(true);
    expect(context.calls[0].proxies).to.have.lengthOf(2);
    expect(context.calls[0].enabled).to.equal(false);
    expect(context.calls[0].sk).to.equal('');
  });

  it('preserves all proxy entries through key regeneration and enable/disable', async () => {
    const context = createPageContext(sampleConfig(true));
    const { proxies } = sampleConfig();
    await context.regenerateSk();
    await context.onEnabledChange(false);
    await context.onEnabledChange(true);
    context.calls.forEach(params => expect(params.proxies).to.deep.equal(proxies));
  });

  it('restores acknowledged state if secure key generation fails', async () => {
    const context = createPageContext();
    expect(await withoutSecureRandom(() => context.onEnabledChange(true))).to.equal(false);
    expect(context.frp).to.deep.equal(context.saved);
    const enabled = createPageContext(sampleConfig(true));
    expect(await withoutSecureRandom(() => enabled.regenerateSk())).to.equal(false);
    expect(enabled.frp.sk).to.equal('SHAREDKEY');
    expect(await withoutSecureRandom(() => enabled.onEnabledChange(false))).to.equal(true);
  });
});

describe('FRP proxy list form integration', () => {
  [false, true].forEach(enabled => {
    [undefined, null, 0, 65536, 'abc', '1e3', '0x50'].forEach(value => {
      it(`blocks device port ${String(value)} writes while enabled=${enabled}`, async () => {
        const config = sampleConfig(enabled);
        config.proxies[0].local_port = value;
        const { wrapper, calls } = mountPage(config);
        try {
          await flush();
          const expected = value === undefined || value === null ? '' : String(value);
          const port = wrapper.findAll('[data-e2e="frp-proxy-port-input"]').at(0);
          expect(wrapper.vm.ready).to.equal(true);
          expect(port.element.value).to.equal(expected);
          expect(await wrapper.vm.save()).to.equal(false);
          expect(await wrapper.vm.onEnabledChange(true)).to.equal(false);
          expect(await wrapper.vm.regenerateSk()).to.equal(false);
          expect(calls).to.have.lengthOf(0);
          expect(wrapper.vm.frp.proxies[0].local_port).to.equal(expected);

          await port.setValue('8443');
          await wrapper.vm.$nextTick();
          expect(await wrapper.vm.save()).to.equal(true);
          expect(calls[0].proxies[0].local_port).to.equal(8443);
          expect(calls[0].proxies[1].local_port).to.equal(22);
        } finally { wrapper.destroy(); }
      });
    });
  });

  it('validates nested names/IPs/ports on all added rows', async () => {
    const { wrapper, calls } = mountPage(sampleConfig(true));
    try {
      await flush();
      wrapper.vm.addProxy();
      await wrapper.vm.$nextTick();
      Object.assign(wrapper.vm.frp.proxies[2], {
        name: 'nas', local_ip: '300.1.2.3', local_port: '70000'
      });
      await wrapper.vm.$nextTick();
      expect(await wrapper.vm.save()).to.equal(false);
      await wrapper.vm.$nextTick();
      expect(wrapper.findAll('.form-item-error').length).to.equal(2);
      Object.assign(wrapper.vm.frp.proxies[2], {
        local_ip: '192.168.1.50', local_port: '5000'
      });
      expect(await wrapper.vm.save()).to.equal(true);
      expect(calls[0].proxies).to.have.lengthOf(3);
    } finally { wrapper.destroy(); }
  });

  it('rejects blank and duplicate names across arbitrary rows', async () => {
    const { wrapper } = mountPage(sampleConfig(true));
    try {
      await flush();
      wrapper.vm.addProxy();
      Object.assign(wrapper.vm.frp.proxies[2], { name: ' office_web ', local_port: '5000' });
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.validate()).to.equal(false);
      await wrapper.vm.$nextTick();
      expect(wrapper.findAll('.form-item-error').length).to.equal(2);
      wrapper.vm.frp.proxies[2].name = '';
      expect(wrapper.vm.validate()).to.equal(false);
    } finally { wrapper.destroy(); }
  });

  it('keeps validation paths and input values correct after deleting a middle row', async () => {
    const { wrapper, calls } = mountPage(sampleConfig(true));
    try {
      await flush();
      wrapper.vm.addProxy();
      Object.assign(wrapper.vm.frp.proxies[2], {
        name: 'nas', local_ip: '192.168.1.50', local_port: '5000'
      });
      await wrapper.vm.$nextTick();
      wrapper.vm.removeProxy(1);
      await wrapper.vm.$nextTick();
      const fields = wrapper.findAll('[data-e2e="frp-proxy-name-input"]');
      expect(fields.at(1).element.value).to.equal('nas');
      expect(await wrapper.vm.save()).to.equal(true);
      expect(calls[0].proxies.map(proxy => proxy.name)).to.deep.equal(['office_web', 'nas']);
    } finally { wrapper.destroy(); }
  });

  it('allows an empty disabled list but prevents enabling without a proxy', async () => {
    const { wrapper, calls } = mountPage({ ...sampleConfig(), proxies: [] });
    try {
      await flush();
      expect(await wrapper.vm.onEnabledChange(true)).to.equal(false);
      expect(calls).to.have.lengthOf(0);
      expect(wrapper.vm.frp.enabled).to.equal(false);
      expect(await wrapper.vm.save()).to.equal(true);
      expect(calls[0].proxies).to.deep.equal([]);
    } finally { wrapper.destroy(); }
  });

  it('disables add/remove/input controls during updates', async () => {
    const { wrapper } = mountPage();
    try {
      await flush();
      wrapper.setData({ busy: true });
      await wrapper.vm.$nextTick();
      ['frp-proxy-add', 'frp-proxy-remove', 'frp-proxy-name-input',
        'frp-proxy-ip-input', 'frp-proxy-port-input', 'frp-proxy-name-copy']
        .forEach(selector => {
          expect(wrapper.find(`[data-e2e="${selector}"]`).element.disabled).to.equal(true);
        });
    } finally { wrapper.destroy(); }
  });
});

describe('offline FRP list fixtures', () => {
  it('persists arbitrary lists, preserves empty lists and returns independent copies', () => {
    const original = getMockResult('router.frp.get');
    try {
      const config = sampleConfig(true);
      config.proxies.push({ name: 'nas', local_ip: '192.168.1.50', local_port: 5000 });
      getMockResult('router.frp.update', config);
      const read = getMockResult('router.frp.get');
      expect(read).to.deep.equal(config);
      read.proxies[0].name = 'mutated';
      expect(getMockResult('router.frp.get').proxies[0].name).to.equal('office_web');
      getMockResult('router.frp.update', { ...config, enabled: false, proxies: [] });
      expect(getMockResult('router.frp.get').proxies).to.deep.equal([]);
      expect(getMockResult('router.frp.get').sk).to.equal('');
    } finally { getMockResult('router.frp.update', original); }
  });
});
