/* eslint-env mocha */
// Compile and mount the actual templates (styles omitted). Form validation,
// conditional children, checkbox events and submit handlers are production code.
require('jsdom-global')();
const fs = require('fs');
const path = require('path');
const Module = require('module');
const babel = require('@babel/core');
const compiler = require('vue-template-compiler');
const Vue = require('vue/dist/vue.common.js');
const { expect } = require('chai');
const root = path.resolve(__dirname, '../../..');
Vue.directive('defaultbutton', {});
const originalJs = Module._extensions['.js'];
const originalResolve = Module._resolveFilename;
const transform = (code, filename) => babel.transformSync(code, { filename, babelrc: false, configFile: false,
  plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')] }).code;
Module._extensions['.js'] = function compileSource(mod, filename) {
  return filename.startsWith(`${root}/base/src/`)
    ? mod._compile(transform(fs.readFileSync(filename, 'utf8'), filename), filename)
    : originalJs(mod, filename);
};
Module._resolveFilename = function resolveAlias(request, parent, ...rest) {
  return originalResolve.call(this, request.startsWith('base/') ? path.join(root, 'base/src', request.slice(5)) : request, parent, ...rest);
};
function sfc(relative) {
  const filename = path.join(root, 'base/src', relative);
  const parsed = compiler.parseComponent(fs.readFileSync(filename, 'utf8'));
  const mod = new Module(filename, module); mod.filename = filename; mod.paths = Module._nodeModulePaths(path.dirname(filename));
  mod._compile(transform(parsed.script.content, filename), filename);
  return { ...(mod.exports.default || mod.exports), ...compiler.compileToFunctions(parsed.template.content) };
}
const wan = sfc('pages/bussiness/setting/wan.vue');
const vpn = sfc('pages/bussiness/advance/vpn/form.vue');
const components = { MSwitch: sfc('component/switch/index.vue'), MForm: sfc('component/form/index.vue'), MFormItem: sfc('component/formItem/index.vue'),
  MCheckbox: sfc('component/checkbox/index.vue'), MInput: sfc('component/input/input.vue'),
  MSelect: { props: ['value', 'options'], template: '<select :value="value" @change="$emit(\'input\', $event.target.value)"><option v-for="o in options" :value="o.value">{{o.text}}</option></select>' } };
const flush = async () => { await new Promise(resolve => setTimeout(resolve, 0)); await Vue.nextTick(); };
const wrappers = [];
function mount(page, { row = {}, http = {}, isEdit = true } = {}) {
  const calls = [], toasts = [];
  const vm = new Vue({ ...page, components, propsData: { isEdit }, mocks: {},
    beforeCreate() {
      this.$t = key => key; this.$store = { state: { isMobile: false, mode: 'router', _runtimeContext: { identity: { modelId: 'M8' } }, modules: { vpn: row } } };
      this.$loading = { open() {}, close() {} }; this.$toast = msg => toasts.push(msg);
      this.$dialog = { confirm: options => options.callback.ok() }; this.$router = { push() {} }; this.$reconnect = () => {};
      this.$http = { getWanNetInfo: async () => ({ data: { result: {} } }),
        meshWanUpdate: async p => calls.push(JSON.parse(JSON.stringify(p))),
        updateVPN: async p => calls.push(JSON.parse(JSON.stringify(p))), addVPN: async p => calls.push(JSON.parse(JSON.stringify(p))), ...http };
    } });
  vm.$mount(); document.body.appendChild(vm.$el); wrappers.push(vm); return { vm, calls, toasts };
}
afterEach(() => { wrappers.splice(0).forEach(vm => { vm.$destroy(); vm.$el.remove(); }); });
after(() => { Module._extensions['.js'] = originalJs; Module._resolveFilename = originalResolve; });

const vlan = [
  { enabled: true, id: 35, priority: 3, name: 'Internet', is_bridged: false, type: 'NAT', ports: [{ port: { id: 4 }, tagged: true }] },
  { enabled: true, id: 100, priority: 5, name: 'Voice', is_bridged: true, type: 'BRIDGE', ports: [{ port: { id: 1 }, tagged: true }, { port: { id: 2 }, tagged: false }] },
];
function getWire(type, vlans = vlan) {
  return { type, vlan: vlans, netinfo: { ip: '', mask: '', gateway: '', dns: [] }, dhcp: { dns: ['1.1.1.1'] },
    pppoe: { account: 'isp-account', password: 'old-password', dns: ['1.1.1.1'] },
    static: { netinfo: { ip: '10.1.1.2', mask: '255.255.255.0', gateway: '10.1.1.1', dns: ['1.1.1.1'] } } };
}
async function editWan(wire) {
  const h = mount(wan, { http: { getWanNetInfo: async () => ({ data: { result: wire } }) } }); await flush();
  const { vm } = h;
  if (wire.type !== 'pppoe') vm.autodns[wire.type] = false;
  await flush();
  const prop = wire.type === 'pppoe' ? 'password' : 'dns1';
  const field = vm.$refs[`${wire.type}Form`].$children.find(child => child.prop === prop);
  const input = field.$el.querySelector('input');
  input.value = wire.type === 'pppoe' ? 'new-password' : '9.9.9.9';
  input.dispatchEvent(new window.Event('input', { bubbles: true }));
  await flush(); vm.submit(); await flush(); return h;
}
describe('F1 mounted WAN read/edit/submit', () => {
  for (const type of ['dhcp', 'pppoe', 'static']) for (const list of [vlan, []]) it(`${type} preserves ${list.length} loaded VLANs`, async () => {
    const h = await editWan(getWire(type, list));
    expect(h.calls.length).to.equal(1); expect(h.calls[0].vlan).to.deep.equal(list);
    expect(h.calls[0].vlan).not.to.equal(list);
  });
  it('protocol switching preserves the loaded VLAN table', async () => {
    const h = mount(wan, { http: { getWanNetInfo: async () => ({ data: { result: getWire('pppoe') } }) } }); await flush();
    h.vm.netType = 'dhcp'; await flush(); h.vm.submit(); await flush(); expect(h.calls[0].vlan).to.deep.equal(vlan);
  });
  it('does not submit before GET completes or after a failed refresh', async () => {
    let resolve;
    const h = mount(wan, { http: { getWanNetInfo: () => new Promise(r => { resolve = r; }) } });
    h.vm.submit(); expect(h.calls).to.deep.equal([]);
    resolve({ data: { result: getWire('dhcp') } }); await flush();
    h.vm.$http.getWanNetInfo = async () => { throw Error('offline'); };
    await h.vm.getWanNetInfo(); await flush(); h.vm.submit(); await flush(); expect(h.calls).to.deep.equal([]);
  });
  it('missing result/VLAN cannot authorize a delete-all update', async () => {
    for (const result of [undefined, { type: 'dhcp', dhcp: {} }, { type: 'dhcp', vlan: null }]) {
      const h = mount(wan, { http: { getWanNetInfo: async () => ({ data: { result } }) } }); await flush();
      h.vm.submit(); await flush(); expect(h.calls).to.deep.equal([]);
    }
  });
});

const openvpn = extra => ({ id: '2', name: 'Office', protocol: 'openvpn', username: 'alice',
  password_set: true, openvpn: { config_present: true }, ...extra });
function chooseFile(vm) {
  Object.defineProperty(vm.$refs.uploadInput, 'files', { configurable: true, value: [new File(['client'], 'new.ovpn')] });
  vm.$refs.uploadInput.dispatchEvent(new window.Event('change', { bubbles: true }));
}
function clickSave(vm) { vm.$el.querySelector('.popup-page__content--bottom .btn:last-child').click(); }
describe('F1 mounted OpenVPN hidden fields and file trust', () => {
  for (const extra of [{ password: 'old-password' }, {}]) it('toggle off advanced auth does not send a passwordless UPDATE', async () => {
    const h = mount(vpn, { row: openvpn(extra) }); await flush();
    expect(h.vm.$el.querySelector('.openvpn-advance')).not.to.equal(null);
    h.vm.$el.querySelector('.openvpn__checkbox label').click(); await flush();
    expect(h.vm.$el.querySelector('.openvpn-advance')).to.equal(null);
    // Actual m-form no longer has the password child; the submit guard must
    // work even though validation of the visible controls succeeds.
    expect(h.vm.$refs.form.validate()).to.equal(true);
    clickSave(h.vm); await flush(); expect(h.calls).to.deep.equal([]);
  });
  it('url-only legacy edit blocks file replacement and submit without converting a path into a token', async () => {
    let uploads = 0;
    const h = mount(vpn, { row: openvpn({ password: 'old-password', openvpn: { url: '/etc/openvpn/old.ovpn' } }),
      http: { uploadFile: async () => { uploads++; return { data: { result: { token: 'abcdef0123456789' } } }; } } }); await flush();
    chooseFile(h.vm);
    clickSave(h.vm); h.vm.submit(); await flush(); expect(h.calls).to.deep.equal([]); expect(uploads).to.equal(0);
    expect(h.vm.$el.querySelector('.popup-page__content--bottom .btn:last-child').disabled).to.equal(true);
    expect(h.vm.$el.querySelector('.config-uploader__button').disabled).to.equal(true);
    expect(h.vm.$el.textContent).to.contain('trans0688');
  });
  it('authentication-free Suite config can be edited without introducing credentials', async () => {
    const h = mount(vpn, { row: openvpn({ username: '', password_set: false }) }); await flush();
    h.vm.form.name = 'Renamed'; clickSave(h.vm); await flush(); expect(h.calls.length).to.equal(1);
    expect(h.calls[0]).not.to.have.property('password'); expect(h.calls[0]).not.to.have.property('openvpn');
  });
  it('explicit replacement password with advanced auth enabled is submitted', async () => {
    const h = mount(vpn, { row: openvpn({}) }); await flush(); h.vm.form.password = 'replacement';
    clickSave(h.vm); await flush(); expect(h.calls[0].password).to.equal('replacement');
  });
  for (const result of [{ url: '/tmp/old.ovpn' }, { token: '' }, { token: '../../path' }, null]) it(`upload reply ${JSON.stringify(result)} cannot submit an untrusted config`, async () => {
    const h = mount(vpn, { row: openvpn({ username: '', password_set: false }), http: { uploadFile: async () => ({ data: { result } }) } }); await flush();
    chooseFile(h.vm); clickSave(h.vm); await flush(); await flush();
    expect(h.calls).to.deep.equal([]);
  });
  it('Suite upload replacement uses only the returned valid token', async () => {
    const token = 'abcdef01-2345-6789';
    const h = mount(vpn, { row: openvpn({ username: '', password_set: false }), http: { uploadFile: async () => ({ data: { result: { token } } }) } }); await flush();
    chooseFile(h.vm); clickSave(h.vm); await flush(); await flush();
    expect(h.calls[0].openvpn).to.deep.equal({ upload_token: token });
  });
});

// Optional explicit cross-repo integration: Suite exports real HAL GETs;
// these mounted pages produce the exact DTOs replayed by the native Host test.
if (process.env.MERCKU_WAN_WEB_INPUT) {
  const inputs = JSON.parse(fs.readFileSync(process.env.MERCKU_WAN_WEB_INPUT, 'utf8')); const output = [];
  describe('F1 mounted pages consuming Suite HAL GETs', () => {
    inputs.forEach(item => it(item.id, async () => {
      const h = await editWan(item.get); expect(h.calls.length).to.equal(1);
      expect(h.calls[0].vlan).to.deep.equal(item.get.vlan); output.push({ ...item, update: h.calls[0] });
    }));
    after(() => fs.writeFileSync(process.env.MERCKU_WAN_WEB_OUTPUT, JSON.stringify(output)));
  });
}


const legacyWan = require('./fixtures/legacy-wan-vlan');
describe('R1 mounted legacy FAL WAN VLAN boundary', () => {
  for (const platform of ['mt7621', 'ipq60xx', 'mt7981']) {
    for (const type of ['dhcp', 'static', 'pppoe']) {
      for (const count of [0, 1, 2]) it(`${platform}/${type}/${count} source-shaped VLANs survive ordinary save`, async () => {
        const wire = legacyWan(platform, type, count);
        const h = await editWan(wire);
        expect(h.calls.length).to.equal(1);
        expect(h.calls[0].vlan).to.deep.equal(wire.vlan);
        // The page intentionally submits the authoritative top-level table.
        if (type === 'pppoe') {
          expect(h.calls[0].pppoe.password).to.equal('new-password');
          if (wire.pppoe.vlan !== undefined) expect(h.calls[0].pppoe.vlan).to.deep.equal(wire.vlan);
          else expect(h.calls[0].pppoe).not.to.have.property('vlan');
        }
      });
    }
  }
  const corruptions = {
    'HW_NAT cannot roundtrip through is_bridged': w => { w.vlan[0].type = 'HW_NAT'; },
    'actual Gen1 SAL zero type': w => { w.vlan[0].type = 'UNKNOW'; },
    'unknown future type': w => { w.vlan[0].type = 'OTHER'; },
    'type and boolean conflict': w => { w.vlan[0].is_bridged = true; },
    'missing enabled': w => { delete w.vlan[0].enabled; },
    'missing id': w => { delete w.vlan[0].id; },
    'missing priority': w => { delete w.vlan[0].priority; },
    'missing Gen1 type': w => { delete w.vlan[0].type; delete w.pppoe.vlan[0].type; },
    'missing is_bridged': w => { delete w.vlan[0].is_bridged; },
    'missing ports': w => { delete w.vlan[0].ports; },
    'empty Gen1 ports cause parser row skip': w => { w.vlan[0].ports = []; },
    'missing port id': w => { delete w.vlan[0].ports[0].port.id; },
    'missing tagged': w => { delete w.vlan[0].ports[0].tagged; },
    'nonboolean enabled': w => { w.vlan[0].enabled = 1; },
    'nonboolean tagged': w => { w.vlan[0].ports[0].tagged = 1; },
    'noninteger id': w => { w.vlan[0].id = '35'; },
    'unknown row field': w => { w.vlan[0].vendor_mode = 'private'; },
    'unknown port field': w => { w.vlan[0].ports[0].pvid = true; },
    'null row': w => { w.vlan[0] = null; },
    'nested PPPoE table exposes omitted top-level row': w => { w.vlan.pop(); },
    'nested PPPoE HW_NAT must not be ignored': w => { w.pppoe.vlan[0].type = 'HW_NAT'; }
  };
  Object.entries(corruptions).forEach(([name, corrupt]) => it(`${name}: zero UPDATE`, async () => {
    const wire = legacyWan('mt7621', 'pppoe'); corrupt(wire);
    // Most cases must fail row validation, not merely duplicate comparison.
    if (!name.startsWith('nested')) wire.pppoe.vlan = JSON.parse(JSON.stringify(wire.vlan));
    const h = mount(wan, { http: { getWanNetInfo: async () => ({ data: { result: wire } }) } }); await flush();
    h.vm.submit(); await flush(); expect(h.calls).to.deep.equal([]); expect(h.toasts.length).to.be.greaterThan(0);
  }));
  it('CH missing name cannot silently truncate a DHCP VLAN table', async () => {
    const wire = legacyWan('mt7981', 'dhcp'); delete wire.vlan[0].name;
    const h = mount(wan, { http: { getWanNetInfo: async () => ({ data: { result: wire } }) } }); await flush();
    h.vm.submit(); await flush(); expect(h.calls).to.deep.equal([]);
  });
  it('CH empty ports are a valid old GET/UPDATE contract', async () => {
    const wire = legacyWan('mt7981', 'dhcp'); wire.vlan[0].ports = [];
    const h = await editWan(wire); expect(h.calls.length).to.equal(1); expect(h.calls[0].vlan).to.deep.equal(wire.vlan);
  });
  it('PPPoE duplicate tables may have different object key order', async () => {
    const wire = legacyWan('mt7621', 'pppoe');
    wire.pppoe.vlan = wire.vlan.map(row => Object.fromEntries(Object.entries(row).reverse()));
    const h = await editWan(wire); expect(h.calls.length).to.equal(1);
  });
});

// Exercise the guard independently of PPPoE duplicate-table checks.
describe('R1 unsafe VLANs across ordinary WAN protocols', () => {
  for (const type of ['dhcp', 'static', 'pppoe']) {
    for (const enabled of [true, false]) it(`${type} rejects ${enabled ? 'enabled' : 'disabled'} HW_NAT even after a valid GET`, async () => {
      let wire = legacyWan('ipq60xx', type);
      const h = mount(wan, { http: { getWanNetInfo: async () => ({ data: { result: wire } }) } }); await flush();
      wire = legacyWan('ipq60xx', type); wire.vlan[0].type = 'HW_NAT'; wire.vlan[0].enabled = enabled;
      if (type === 'pppoe') wire.pppoe.vlan = JSON.parse(JSON.stringify(wire.vlan));
      await h.vm.getWanNetInfo(); h.vm.submit(); await flush(); expect(h.calls).to.deep.equal([]);
    });
  }
});

describe('C1 Internet VLAN editing', () => {
  it('updates only the named Internet row and deletes only it on disable', async () => {
    const wire = getWire('dhcp', JSON.parse(JSON.stringify(vlan)));
    wire.vlan[0].name = 'internet';
    const h = mount(wan, { http: { getWanNetInfo: async () => ({ data: { result: wire } }) } });
    await flush();
    h.vm.$store.state._runtimeContext = { identity: { modelId: 'M8' } };
    h.vm.vlan.id = '36'; await flush(); h.vm.submit(); await flush();
    expect(h.calls[0].vlan[0].id).to.equal(36);
    expect(h.calls[0].vlan[1]).to.deep.equal(wire.vlan[1]);
    h.vm.vlan.enabled = false; await flush(); h.vm.submit(); await flush();
    expect(h.calls[1].vlan).to.deep.equal([wire.vlan[1]]);
  });
});

describe('C1 platform VLAN contracts', () => {
  for (const [platform, model] of [['mt7621', 'M8'], ['ipq60xx', 'M6R0'], ['mt7981', 'M11R4']]) {
    for (const count of [0, 1, 2]) it(`${platform} safely edits ${count} rows`, async () => {
      const wire = legacyWan(platform, 'pppoe', count);
      const h = mount(wan, { http: { getWanNetInfo: async () => ({ data: { result: wire } }) } });
      h.vm.$store.state._runtimeContext.identity.modelId = model;
      await flush();
      h.vm.vlan.enabled = true; h.vm.vlan.id = '40'; h.vm.vlan.priority = 7;
      await flush();
      expect(h.vm.$el.querySelector('[data-e2e="wan-vlan-card"]')).not.to.equal(null);
      h.vm.submit(); await flush();
      expect(h.calls.length).to.equal(1);
      expect(h.calls[0].vlan.length).to.equal(Math.max(count, 1));
      expect(h.calls[0].vlan[0].id).to.equal(40);
      if (count === 2) expect(h.calls[0].vlan[1]).to.deep.equal(wire.vlan[1]);
      if (platform !== 'mt7981') expect(h.calls[0].pppoe.vlan).to.deep.equal(h.calls[0].vlan);
      h.vm.vlan.enabled = false; await flush(); h.vm.submit(); await flush();
      expect(h.calls[1].vlan).to.deep.equal(wire.vlan.slice(1));
    });
  }
  for (const reason of ['ambiguous', 'duplicate', 'unknown', 'sfp', 'bridge', 'invalid']) it(`refuses ${reason} editing`, async () => {
    const wire = legacyWan('ipq60xx', 'dhcp', 1);
    if (reason === 'ambiguous') wire.vlan.push(JSON.parse(JSON.stringify(wire.vlan[0])));
    if (reason === 'duplicate') { wire.vlan[0].name = 'internet'; wire.vlan.push(JSON.parse(JSON.stringify(wire.vlan[0]))); }
    const h = mount(wan, { http: { getWanNetInfo: async () => ({ data: { result: wire } }) } });
    if (reason === 'unknown') h.vm.$store.state._runtimeContext.identity.modelId = 'unknown';
    if (reason === 'sfp') h.vm.$store.state._runtimeContext.identity.modelId = 'M11R2';
    if (reason === 'bridge') h.vm.$store.state.mode = 'bridge';
    await flush(); h.vm.vlan.enabled = true; h.vm.vlan.id = reason === 'invalid' ? 4095 : 50;
    await flush(); h.vm.submit(); await flush(); expect(h.calls).to.deep.equal([]);
  });
});

describe('C1 F1 Internet VID collisions', () => {
  for (const type of ['dhcp', 'pppoe']) {
    for (const create of [false, true]) {
      for (const enabled of [false, true]) {
        for (const id of ['100', 100, '101']) it(`${type} ${create ? 'create' : 'edit'} VID ${id} (${typeof id}), other enabled=${enabled}`, async () => {
          const wire = legacyWan('mt7621', type, 2);
          wire.vlan[1].enabled = enabled;
          if (create) wire.vlan.shift();
          if (type === 'pppoe') wire.pppoe.vlan = JSON.parse(JSON.stringify(wire.vlan));
          const before = JSON.parse(JSON.stringify(wire));
          const h = mount(wan, { http: { getWanNetInfo: async () => ({ data: { result: wire } }) } });
          await flush(); h.vm.vlan.enabled = true; h.vm.vlan.id = id; h.vm.vlan.priority = 3;
          await flush(); h.vm.submit(); await flush();
          const conflict = enabled && Number(id) === 100;
          expect(h.calls.length).to.equal(conflict ? 0 : 1);
          if (conflict) expect(h.toasts).to.include('trans1051');
          else {
            const rows = h.calls[0].vlan;
            expect(rows.find(row => row.name === 'internet').id).to.equal(Number(id));
            expect(rows.find(row => row.name === 'voice')).to.deep.equal(before.vlan.find(row => row.name === 'voice'));
            if (type === 'pppoe') expect(h.calls[0].pppoe.vlan).to.deep.equal(rows);
          }
          expect(wire).to.deep.equal(before);
        });
      }
    }
    for (const action of ['ordinary', 'disable', 'priority']) it(`${type} historical duplicate: ${action}`, async () => {
      const wire = legacyWan('mt7621', type, 2);
      wire.vlan[1].enabled = true; wire.vlan[1].id = wire.vlan[0].id;
      if (type === 'pppoe') wire.pppoe.vlan = JSON.parse(JSON.stringify(wire.vlan));
      const h = mount(wan, { http: { getWanNetInfo: async () => ({ data: { result: wire } }) } });
      await flush();
      if (action === 'disable') h.vm.vlan.enabled = false;
      if (action === 'priority') h.vm.vlan.priority = 7;
      await flush(); h.vm.submit(); await flush();
      expect(h.calls.length).to.equal(action === 'priority' ? 0 : 1);
      if (action === 'ordinary') expect(h.calls[0].vlan).to.deep.equal(wire.vlan);
      if (action === 'disable') expect(h.calls[0].vlan).to.deep.equal(wire.vlan.slice(1));
    });
  }
  it('does not match an explicitly LAN-typed port 4 as Internet', async () => {
    const wire = legacyWan('mt7621', 'dhcp', 1);
    wire.vlan[0].ports[0].port.type = 'lan';
    const h = mount(wan, { http: { getWanNetInfo: async () => ({ data: { result: wire } }) } });
    await flush(); expect(h.vm.vlanEditable).to.equal(false);
    h.vm.submit(); await flush(); expect(h.calls[0].vlan).to.deep.equal(wire.vlan);
  });
});

describe('C1 F2 WAN VLAN priority', () => {
  for (const type of ['dhcp', 'pppoe']) {
    it(`${type} creates Internet with untouched default priority zero`, async () => {
      const wire = legacyWan('mt7621', type, 0);
      const h = mount(wan, { http: { getWanNetInfo: async () => ({ data: { result: wire } }) } });
      await flush(); h.vm.vlan.enabled = true; h.vm.vlan.id = '100';
      expect(h.vm.vlan.priority).to.equal(0);
      await flush(); h.vm.submit(); await flush();
      expect(h.calls.length).to.equal(1); expect(h.calls[0].vlan[0].priority).to.equal(0);
      const saved = h.calls[0];
      if (type === 'pppoe') expect(saved.pppoe.vlan).to.deep.equal(saved.vlan);
      // Refresh from the submitted wire, then perform an ordinary save.
      h.vm.$http.getWanNetInfo = async () => ({ data: { result: { ...wire, ...saved } } });
      await h.vm.getWanNetInfo(); await flush(); h.vm.submit(); await flush();
      expect(h.calls[1].vlan).to.deep.equal(saved.vlan);
      if (type === 'pppoe') expect(h.calls[1].pppoe.vlan).to.deep.equal(saved.vlan);
    });
    for (const priority of [0, '0', 1, '1', 7, '7', -1, '-1', 8, '8', '', ' ', null, undefined, 1.5, '1.5', 'abc', '1e0', false, [0]]) {
      it(`${type} validates ${JSON.stringify(priority)} (${typeof priority})`, async () => {
        const wire = legacyWan('mt7621', type, 2);
        const h = mount(wan, { http: { getWanNetInfo: async () => ({ data: { result: wire } }) } });
        await flush(); h.vm.vlan.priority = priority;
        await flush(); h.vm.submit(); await flush();
        const valid = [0, '0', 1, '1', 7, '7'].includes(priority);
        expect(h.calls.length).to.equal(valid ? 1 : 0);
        if (valid) {
          expect(h.calls[0].vlan[0].priority).to.equal(Number(priority));
          expect(h.calls[0].vlan[1]).to.deep.equal(wire.vlan[1]);
          if (type === 'pppoe') expect(h.calls[0].pppoe.vlan).to.deep.equal(h.calls[0].vlan);
        }
      });
    }
    it(`${type} priority zero does not bypass VID conflict`, async () => {
      const wire = legacyWan('mt7621', type, 2); wire.vlan[1].enabled = true;
      if (type === 'pppoe') wire.pppoe.vlan = JSON.parse(JSON.stringify(wire.vlan));
      const h = mount(wan, { http: { getWanNetInfo: async () => ({ data: { result: wire } }) } });
      await flush(); h.vm.vlan.priority = 0; h.vm.vlan.id = '100';
      await flush(); h.vm.submit(); await flush();
      expect(h.calls).to.deep.equal([]); expect(h.toasts).to.include('trans1051');
    });
  }
});
