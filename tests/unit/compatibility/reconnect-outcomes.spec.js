/* eslint-env mocha */
const { expect } = require('chai');
const VueModule = require('vue');
const RouterModule = require('vue-router');

const Vue = VueModule.default || VueModule;
const VueRouter = RouterModule.default || RouterModule;
const { getContext } = window.HTMLCanvasElement.prototype;
window.HTMLCanvasElement.prototype.getContext = () => ({ fillRect() {} });
const { createApp } = require('../../../unified/src/app/create-app');

window.HTMLCanvasElement.prototype.getContext = getContext;
const Root = require('../../../unified/src/app/App.vue').default;
const loading = require('../../../base/src/component/loading').default;
const dialog = require('../../../base/src/component/dialog').default;
const Toast = require('../../../base/src/component/toast/index.vue').default;
const { operationError } = require('../../../unified/src/app/http/operations');

const id = 'e02b3422-715d-4d45-ae5a-1bbaf8baf6bd';
const flush = () => new Promise(resolve => setTimeout(resolve, 0));
const notifications = [];
const updateToast = Toast.methods.updateContent;

function fixture({ getRouter = async () => ({}), waitForOperation } = {}) {
  const previous = {
    render: Root.render,
    open: loading.open,
    close: loading.close,
    confirm: dialog.confirm,
  };
  const keys = ['$loading', '$http', '$toast', '$dialog', '$reconnect', '$upgrade',
    'changeLanguage', 'formatNetworkData', 'formatSpeed', 'formatBandWidth'];
  const prototypes = keys.map(key => Vue.prototype[key]);
  let parent = document.querySelector('.scrollbar-wrap');
  if (!parent) {
    parent = document.createElement('div');
    parent.className = 'scrollbar-wrap';
    document.body.appendChild(parent);
  }
  const mount = document.createElement('div'); mount.id = 'web'; document.body.appendChild(mount);
  const router = new VueRouter({ mode: 'abstract', routes: [] });
  const push = router.push.bind(router); const routes = [];
  router.push = route => { routes.push(route.path); return Promise.resolve(); };
  const queries = []; const dialogs = []; let visible = false;
  const http = {
    getRouter,
    setExHandler() {},
    waitForOperation(key, options = {}) {
      queries.push(key);
      return waitForOperation(key, options);
    },
  };
  loading.open = () => { visible = true; };
  loading.close = () => { visible = false; };
  dialog.confirm = options => { dialogs.push(options); };
  Root.render = h => h('div');
  const app = createApp(Object.freeze({ behavior: { reconnectProbeTimeoutMs: 1000 },
    branding: { languages: ['en-US'], defaultLanguage: 'en-US' } }), { http, router });
  return {
    app,
    routes,
    queries,
    dialogs,
    visible: () => visible,
    navigate: () => push('/other'),
    reconnect: options => Vue.prototype.$reconnect({ operation: { id }, timeout: 1, ...options }),
    close() {
      app.$destroy(); if (app.$el.parentNode) app.$el.parentNode.removeChild(app.$el);
      Object.assign(loading, { open: previous.open, close: previous.close });
      dialog.confirm = previous.confirm; Root.render = previous.render;
      keys.forEach((key, index) => { Vue.prototype[key] = prototypes[index]; });
      const node = document.querySelector('.toast-container');
      if (node && node.__vue__) { clearTimeout(node.__vue__.timer); node.__vue__.visible = false; }
    },
  };
}

describe('F1 public reconnect outcome routing', () => {
  before(() => {
    Toast.methods.updateContent = function record(options) {
      notifications.push(options.text); return updateToast.call(this, options);
    };
  });
  beforeEach(() => { notifications.length = 0; });
  after(() => {
    Toast.methods.updateContent = updateToast;
    const node = document.querySelector('.toast-container');
    if (node && node.__vue__) node.__vue__.updateContent = updateToast.bind(node.__vue__);
  });

  it('stays on the page and shows confirmed apply failure once without a network timeout', async () => {
    const f = fixture({ waitForOperation: async () => { throw operationError(id, 'apply-failed', 'settled'); } });
    let errors = 0; let successes = 0;
    try {
      f.reconnect({ ontimeout: () => f.routes.push('/unconnect'),
        onerror: error => { expect(error.response.data.error.reason).to.equal('apply-failed'); errors += 1; },
        onsuccess: () => { successes += 1; } });
      await flush(); await flush();
      expect(f.routes).to.deep.equal([]); expect(errors).to.equal(1); expect(successes).to.equal(0);
      expect(f.visible()).to.equal(false); expect(f.dialogs).to.have.length(0);
      expect(notifications).to.have.length(1); expect(notifications[0]).to.contain('Could not apply');
    } finally { f.close(); }
  });

  it('stays on unknown and offers a read-only check of the same id without success navigation', async () => {
    let reads = 0;
    const f = fixture({ waitForOperation: async () => {
      reads += 1;
      if (reads === 1) throw operationError(id);
      return { status: 'settled', outcome: 'completed' };
    } });
    let errors = 0;
    try {
      f.reconnect({ ontimeout: () => f.routes.push('/unconnect'),
        onerror: () => { errors += 1; },
        onsuccess: () => f.routes.push('/success') });
      await flush();
      expect(f.routes).to.deep.equal([]); expect(errors).to.equal(1);
      expect(f.dialogs).to.have.length(1); expect(notifications).to.have.length(0);
      f.dialogs[0].callback.ok(); await flush();
      expect(f.queries).to.deep.equal([id, id]); expect(f.routes).to.deep.equal([]);
      expect(notifications).to.have.length(1); expect(notifications[0]).to.contain('completed');
      expect(f.visible()).to.equal(false);
    } finally { f.close(); }
  });

  it('keeps an observation deadline after HTTP recovery on the operation path and ignores late completion', async () => {
    let complete;
    const f = fixture({ waitForOperation: () => new Promise(resolve => { complete = resolve; }) });
    let errors = 0;
    try {
      f.reconnect({ timeout: 0.02,
        ontimeout: () => f.routes.push('/unconnect'),
        onerror: () => { errors += 1; },
        onsuccess: () => f.routes.push('/success') });
      await new Promise(resolve => setTimeout(resolve, 40));
      expect(f.routes).to.deep.equal([]);
      expect(errors).to.equal(1);
      expect(f.dialogs).to.have.length(1);
      expect(f.visible()).to.equal(false);
      complete(); await flush();
      expect(f.routes).to.deep.equal([]); expect(f.dialogs).to.have.length(1);
    } finally { f.close(); }
  });

  it('keeps the original unconnect callback only when HTTP never recovers', async () => {
    const f = fixture({ getRouter: async () => { throw Error('offline'); },
      waitForOperation: async () => { throw Error('must not query'); } });
    let errors = 0;
    try {
      f.reconnect({ timeout: 0.02, ontimeout: () => f.routes.push('/unconnect'), onerror: () => { errors += 1; } });
      await new Promise(resolve => setTimeout(resolve, 40));
      expect(f.routes).to.deep.equal(['/unconnect']); expect(errors).to.equal(0);
      expect(f.queries).to.deep.equal([]); expect(f.dialogs).to.have.length(0);
      expect(notifications).to.have.length(0); expect(f.visible()).to.equal(false);
    } finally { f.close(); }
  });

  it('calls only the success navigation after confirmed completion', async () => {
    const f = fixture({ waitForOperation: async () => ({ status: 'settled', outcome: 'completed' }) });
    try {
      f.reconnect({ onsuccess: () => f.routes.push('/success'),
        ontimeout: () => f.routes.push('/unconnect'),
        onerror: () => f.routes.push('/error') });
      await flush();
      expect(f.routes).to.deep.equal(['/success']); expect(f.queries).to.deep.equal([id]);
      expect(f.dialogs).to.have.length(0); expect(notifications).to.have.length(0);
      expect(f.visible()).to.equal(false);
    } finally { f.close(); }
  });

  it('cancels observation on a page change and ignores its late result and deadline', async () => {
    let complete;
    const f = fixture({ waitForOperation: () => new Promise(resolve => { complete = resolve; }) });
    try {
      f.reconnect({ timeout: 0.02,
        onsuccess: () => f.routes.push('/success'),
        ontimeout: () => f.routes.push('/unconnect'),
        onerror: () => f.routes.push('/error') });
      await flush(); await f.navigate(); complete();
      await new Promise(resolve => setTimeout(resolve, 40));
      expect(f.routes).to.deep.equal([]); expect(f.dialogs).to.have.length(0);
      expect(notifications).to.have.length(0); expect(f.visible()).to.equal(false);
    } finally { f.close(); }
  });
});
