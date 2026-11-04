/* eslint-env mocha */
const fs = require('fs');
const path = require('path');
const Module = require('module');
const { expect } = require('chai');

const root = path.resolve(__dirname, '../../..');
const babel = require('@babel/core');
const compiler = require('vue-template-compiler');
const cjsPlugin = require.resolve('@babel/plugin-transform-modules-commonjs');

function transform(code, filename) {
  return babel.transformSync(code, {
    filename,
    babelrc: false,
    configFile: false,
    plugins: [cjsPlugin],
  }).code;
}

// The repo's SFC style blocks cannot compile under this unit runner (dart-sass
// includePaths are not applied), so load only the <script> block. This keeps
// the credential-wire assertions on the real page source without touching
// production code.
const originalJs = Module._extensions['.js'];
const originalResolve = Module._resolveFilename;
Module._extensions['.js'] = function compileBaseSource(mod, filename) {
  if (filename.startsWith(`${root}${path.sep}base${path.sep}src${path.sep}`)) {
    return mod._compile(transform(fs.readFileSync(filename, 'utf8'), filename), filename);
  }
  return originalJs(mod, filename);
};
Module._resolveFilename = function resolveBaseAlias(request, parent, ...rest) {
  const mapped = request.startsWith('base/')
    ? path.join(root, 'base/src', request.slice('base/'.length))
    : request;
  return originalResolve.call(this, mapped, parent, ...rest);
};

function loadVueScript(relativePath) {
  const file = path.join(root, relativePath);
  const descriptor = compiler.parseComponent(fs.readFileSync(file, 'utf8'));
  const mod = new Module(file, module);
  mod.filename = file;
  mod.paths = Module._nodeModulePaths(path.dirname(file));
  mod._compile(transform(descriptor.script.content, file), file);
  return mod.exports.default || mod.exports;
}

after(() => {
  Module._extensions['.js'] = originalJs;
  Module._resolveFilename = originalResolve;
});

const ddnsPage = loadVueScript('base/src/pages/bussiness/advance/ddns.vue');
const vpnForm = loadVueScript('base/src/pages/bussiness/advance/vpn/form.vue');

function flush() {
  return new Promise(resolve => setTimeout(resolve, 0));
}

function makeDdnsVm() {
  const vm = {
    $t: key => key,
    $loading: { open() {}, close() {} },
    $refs: { form: { validate: () => true } },
    $toast() {},
    updateCalls: [],
  };
  Object.assign(vm, ddnsPage.data.call(vm));
  vm.$http = {
    getDDNS: () => Promise.resolve({ data: { result: {} } }),
    updateDDNS: params => {
      vm.updateCalls.push(params);
      return Promise.resolve();
    },
  };
  return vm;
}

function makeVpnVm(isEdit, vpn) {
  const vm = {
    $t: key => key,
    $loading: { open() {}, close() {} },
    $toast() {},
    isEdit,
    $store: { state: { modules: { vpn } } },
  };
  Object.assign(vm, vpnForm.data.call(vm));
  return vm;
}

describe('Unified DDNS credential wire', () => {
  it('fills the legacy password returned by the authorized GET', async () => {
    const vm = makeDdnsVm();
    vm.$http.getDDNS = () => Promise.resolve({
      data: {
        result: {
          enabled: true, service: 'dyndns', domain: 'example.com', username: 'user', password: 'legacy-secret',
        },
      },
    });

    ddnsPage.methods.getDDNS.call(vm);
    await flush();

    expect(vm.ddns.password).to.equal('legacy-secret');
  });

  it('does not fabricate a password from password_set when the GET omits it', async () => {
    const vm = makeDdnsVm();
    vm.$http.getDDNS = () => Promise.resolve({
      data: {
        result: {
          enabled: true, service: 'dyndns', domain: 'example.com', username: 'user', password_set: true,
        },
      },
    });

    ddnsPage.methods.getDDNS.call(vm);
    await flush();

    expect(vm.ddns.password).to.equal('');
    expect(vm.ddns.password_set).to.equal(undefined);
    expect(vm.rules.password[0].rule('')).to.equal(false);
  });

  it('submits the GET-returned password on an ordinary field edit', async () => {
    const vm = makeDdnsVm();
    vm.ddns = {
      enabled: true, service: 'dyndns', domain: 'new.example.com', username: 'user', password: 'legacy-secret',
    };

    ddnsPage.methods.submit.call(vm);
    await flush();

    expect(vm.updateCalls).to.deep.equal([{
      enabled: true,
      service: 'dyndns',
      domain: 'new.example.com',
      username: 'user',
      password: 'legacy-secret',
    }]);
  });

  it('submits a user-entered replacement password', async () => {
    const vm = makeDdnsVm();
    vm.ddns = {
      enabled: true, service: 'dyndns', domain: 'example.com', username: 'user', password: 'new-secret',
    };

    ddnsPage.methods.submit.call(vm);
    await flush();

    expect(vm.updateCalls[0].password).to.equal('new-secret');
  });

  it('sends nothing when validation rejects the blank password', async () => {
    const vm = makeDdnsVm();
    vm.$refs.form.validate = () => false;
    vm.ddns = {
      enabled: true, service: 'dyndns', domain: 'example.com', username: 'user', password: '',
    };

    ddnsPage.methods.submit.call(vm);
    await flush();

    expect(vm.updateCalls).to.deep.equal([]);
  });
});

describe('Unified VPN credential wire', () => {
  const pptp = {
    id: '1', name: 'PPTP', protocol: 'PPTP', server: 'vpn.example.com', username: 'user',
    password: 'legacy-secret', pptp: { mppe: true, mppc: false },
  };

  it('prefills and resubmits the legacy PPTP password on an ordinary edit', () => {
    const vm = makeVpnVm(true, pptp);
    vpnForm.mounted.call(vm);

    expect(vm.form.password).to.equal('legacy-secret');
    expect(vm.passwordAvailable).to.equal(true);

    vm.form.name = 'PPTP renamed';
    vpnForm.methods.updateFormParams.call(vm);

    expect(vm.formParams).to.deep.equal({
      id: '1',
      name: 'PPTP renamed',
      protocol: 'pptp',
      server: 'vpn.example.com',
      username: 'user',
      password: 'legacy-secret',
      pptp: { mppe: true, mppc: false },
    });
  });

  it('blocks a PPTP/L2TP edit when no password is readable or entered', () => {
    const vm = makeVpnVm(true, {
      id: '1', name: 'PPTP', protocol: 'PPTP', server: 'vpn.example.com', username: 'user', password_set: true,
    });
    vpnForm.mounted.call(vm);

    expect(vm.form.password).to.equal('');
    expect(vm.passwordConfigured).to.equal(true);
    expect(vm.rules.password[0].rule('')).to.equal(false);
    expect(vm.rules.password[0].rule('new-secret')).to.equal(true);
  });

  it('blocks clearing a prefilled PPTP password by accident', () => {
    const vm = makeVpnVm(true, pptp);
    vpnForm.mounted.call(vm);

    expect(vm.rules.password[0].rule('')).to.equal(false);
  });

  it('keeps PPTP/L2TP ADD optional-password semantics unchanged', () => {
    const vm = makeVpnVm(false, {});
    expect(vm.rules.password[0].rule('')).to.equal(true);
  });

  it('does not force the PPTP/L2TP required-password rule onto OpenVPN', () => {
    const additive = makeVpnVm(true, {
      id: '2', name: 'OVPN', protocol: 'OpenVPN', username: 'user', password_set: false,
      openvpn: { config_present: true },
    });
    vpnForm.mounted.call(additive);
    expect(additive.rules.password[0].rule('')).to.equal(true);

    const stored = makeVpnVm(true, {
      id: '2', name: 'OVPN', protocol: 'OpenVPN', username: 'user', password_set: true,
      openvpn: { config_present: true },
    });
    vpnForm.mounted.call(stored);
    expect(stored.rules.password[0].rule('')).to.equal(false);
  });
});
