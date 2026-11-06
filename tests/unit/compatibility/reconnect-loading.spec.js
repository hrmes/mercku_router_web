/* eslint-env mocha */
const { expect } = require('chai');
const VueModule = require('vue');

const Vue = VueModule.default || VueModule;
const RouterModule = require('vue-router');

const VueRouter = RouterModule.default || RouterModule;
const { getContext } = window.HTMLCanvasElement.prototype;
window.HTMLCanvasElement.prototype.getContext = () => ({ fillRect() {} });
const { createApp } = require('../../../unified/src/app/create-app');

window.HTMLCanvasElement.prototype.getContext = getContext;
const Root = require('../../../unified/src/app/App.vue').default;
const loading = require('../../../base/src/component/loading').default;

const flush = () => new Promise(resolve => setTimeout(resolve, 0));

describe('public reconnect loading lifecycle', () => {
  it('replaces an old observation without leaving Loading open after the new id completes', async () => {
    const previous = { render: Root.render, open: loading.open, close: loading.close };
    const keys = ['$loading', '$http', '$toast', '$dialog', '$reconnect', '$upgrade',
      'changeLanguage', 'formatNetworkData', 'formatSpeed', 'formatBandWidth'];
    const prototypes = keys.map(key => Vue.prototype[key]);
    const router = new VueRouter({ mode: 'abstract', routes: [] });
    let visible = false;
    const pending = {};
    const ids = [];
    const http = {
      getRouter: async () => ({}),
setExHandler() {},
      waitForOperation(id, options) {
        ids.push(id);
        return new Promise((resolve, reject) => {
          pending[id] = resolve;
          options.cancelToken.promise.then(reject);
        });
      },
    };
    loading.open = () => { visible = true; };
    loading.close = () => { visible = false; };
    Root.render = h => h('div');
    document.body.innerHTML = '<div id="web"></div>';
    const context = Object.freeze({ behavior: { reconnectProbeTimeoutMs: 1000 },
      branding: { languages: ['en-US'], defaultLanguage: 'en-US' } });
    let app;
    try {
      app = createApp(context, { http, router });
      Vue.prototype.$reconnect({ operation: { id: 'first' }, timeout: 1 });
      await flush();
      Vue.prototype.$reconnect({ operation: { id: 'second' }, timeout: 1 });
      await flush();
      expect(visible).to.equal(true);
      expect(ids).to.deep.equal(['first', 'second']);
      pending.second(); await flush();
      expect(visible).to.equal(false);
    } finally {
      if (app) app.$destroy();
      Object.assign(loading, { open: previous.open, close: previous.close });
      Root.render = previous.render;
      keys.forEach((key, index) => { Vue.prototype[key] = prototypes[index]; });
    }
  });
});
