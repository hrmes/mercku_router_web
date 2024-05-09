// router/index.js
import Vue from 'vue';
import Router from 'vue-router';

import store from '../store';

Vue.use(Router);

const prefix = '/web';

const genNewLocation = location => {
  let newLocation;
  if (typeof location === 'string') {
    newLocation = {
      path: prefix + location
    };
  } else {
    newLocation = {
      ...location,
      path: prefix + location.path
    };
  }
  return newLocation;
};
const recursive = root => {
  root.forEach(r => {
    if (r.path) {
      r.path = prefix + r.path;
    }
    if (r.redirect) {
      r.redirect = prefix + r.redirect;
    }
    if (r.children) {
      recursive(r.children);
    }
  });
};
const { push } = Router.prototype;
Router.prototype.push = function customPush(location) {
  return push.call(this, genNewLocation(location)).catch(err => err);
};
const { replace } = Router.prototype;
Router.prototype.replace = function customReplace(location) {
  return replace.call(this, genNewLocation(location));
};

const routes = {
  mode: 'history',
  routes: process.env.IS_MVU
    ? require('./mvu-routes').default
    : require('./default-routes').default
};

console.log('routes', routes);
recursive(routes.routes);
Array.prototype.push.apply(routes.routes, [
  {
    path: '*',
    redirect: `${prefix}/login`
  },
  {
    path: '/',
    redirect: `${prefix}/login`
  }
]);

const router = new Router(routes);
router.beforeEach((to, from, next) => {
  if (!to.meta.noMountedLoading) {
    Vue.prototype.$loading.open();
  }
  if (to.name !== from.name) {
    store.commit('clearToken'); // 取消请求
  }
  next();
});

export default router;
