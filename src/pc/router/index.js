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
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/home',
    name: 'home',
    component: home
  },
  {
    path: '/setting/network',
    name: 'network',
    component: network
  },
  {
    path: '/setting/wifi',
    name: 'wifi',
    component: wifi
  },
  {
    path: '/setting/safe',
    name: 'safe',
    component: safe
  },
  {
    path: '/setting/reboot',
    name: 'reboot',
    component: reboot
  },
  {
    path: '/wlan',
    name: 'wlan',
    component: wlan
  },
  {
    path: '/disappear',
    name: 'disappear',
    component: disappear
  }
];

export default new Router({
  routes
});
