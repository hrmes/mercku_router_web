import Vue from 'vue';
import Router from 'vue-router';
import login from '../pages/login/index.vue';
import home from '../pages/bussiness/home/index.vue';
import network from '../pages/bussiness/setting/network.vue';
import wifi from '../pages/bussiness/setting/wifi.vue';
import safe from '../pages/bussiness/setting/safe.vue';
import reboot from '../pages/bussiness/setting/reboot.vue';
import wlan from '../pages/bussiness/wlan/index.vue';
import disappear from '../pages/bussiness/disappear/index.vue';

Vue.use(Router);
const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/home',
    name: 'home',
    component: home,
    requireAuth: true
  },
  {
    path: '/setting/network',
    name: 'network',
    component: network,
    requireAuth: true
  },
  {
    path: '/setting/wifi',
    name: 'wifi',
    component: wifi,
    requireAuth: true
  },
  {
    path: '/setting/safe',
    name: 'safe',
    component: safe,
    requireAuth: true
  },
  {
    path: '/setting/reboot',
    name: 'reboot',
    component: reboot,
    requireAuth: true
  },
  {
    path: '/wlan',
    name: 'wlan',
    component: wlan,
    requireAuth: true
  },
  {
    path: '/disappear',
    name: 'disappear',
    component: disappear,
    requireAuth: false
  }
];

export default new Router({
  routes
});
