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
const components = { MForm: sfc('component/form/index.vue'), MFormItem: sfc('component/formItem/index.vue'),
  MCheckbox: sfc('component/checkbox/index.vue'), MInput: sfc('component/input/input.vue'),
  MSelect: { props: ['value', 'options'], template: '<select :value="value" @change="$emit(\'input\', $event.target.value)"><option v-for="o in options" :value="o.value">{{o.text}}</option></select>' } };
const flush = async () => { await new Promise(resolve => setTimeout(resolve, 0)); await Vue.nextTick(); };
const wrappers = [];
function mount(page, { row = {}, http = {}, isEdit = true } = {}) {
  const calls = [], toasts = [];
  const vm = new Vue({ ...page, components, propsData: { isEdit }, mocks: {},
    beforeCreate() {
      this.$t = key => key; this.$store = { state: { isMobile: false, modules: { vpn: row } } };
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
