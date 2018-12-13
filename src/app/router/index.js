import Vue from 'vue';
import Router from 'vue-router';
import wanFail from '../pages/wan-fail/index.vue';
import wanHand from '../pages/wan-hand/index.vue';
import staticIp from '../pages/static-ip/index.vue';
import pppoe from '../pages/pppoe/index.vue';
import dhcp from '../pages/dhcp/index.vue';
import complete from '../pages/complete/index.vue';
import login from '../pages/login/index.vue';
import wlan from '../pages/wlan/index.vue';
import checkNetwork from '../pages/check-network/index.vue';
import wanSuccess from '../pages/wan-success/index.vue';
import preLogin from '../pages/pre-login/index.vue';
// import timezone from '../pages/timezone/index.vue';

Vue.use(Router);

const routes = [{
    path: '/pre-login/:redirect?',
    name: '/pre-login',
    component: preLogin,
    requireAuth: false
  },
  {
    path: '/',
    redirect: '/wlan'
  },
  {
    path: '/wan-fail/:state?/:immediate?',
    name: 'wan-fail',
    component: wanFail,
    requireAuth: true
  },
  {
    path: '/wan-hand',
    name: 'wan-hand',
    component: wanHand,
    requireAuth: true
  },
  {
    path: '/static-ip',
    name: 'static-ip',
    component: staticIp,
    requireAuth: true
  },
  {
    path: '/pppoe',
    name: 'pppoe',
    component: pppoe,
    requireAuth: true
  },
  {
    path: '/dhcp',
    name: 'dhcp',
    component: dhcp,
    requireAuth: true
  },
  {
    path: '/complete',
    name: 'complete',
    component: complete,
    requireAuth: true
  },
  {
    path: '/login/:redirect?',
    name: 'login',
    component: login,
    requireAuth: false
  },
  {
    path: '/wlan',
    name: 'wlan',
    component: wlan,
    requireAuth: true
  },
  {
    path: '/check-network',
    name: 'check-network',
    component: checkNetwork,
    requireAuth: true
  },
  {
    path: '/wan-success',
    name: 'wan-success',
    component: wanSuccess,
    requireAuth: true
  }
];
// , {
// path: '/policy',
//  component: policy
// }

// , {
// path: '/timezone',
// component: timezone
// }

export default new Router({
  routes
});
