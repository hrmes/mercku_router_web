import Vue from 'vue';
import Router from 'vue-router';
import login from '../pages/login/index.vue';
import home from '../pages/bussiness/home/index.vue';
import network from '../pages/bussiness/setting/network.vue';
import wifi from '../pages/bussiness/setting/wifi.vue';
import safe from '../pages/bussiness/setting/safe.vue';
import reboot from '../pages/bussiness/setting/reboot.vue';

Vue.use(Router);
const routes = [{
  path: '/',
  redirect: '/home'
}, {
  path: '/login',
  name: 'login',
  component: login
}, {
  path: '/home',
  name: 'home',
  component: home,
}, {
  path: '/setting/network',
  name: 'network',
  component: network,
}, {
  path: '/setting/wifi',
  name: 'wifi',
  component: wifi,
}, {
  path: '/setting/safe',
  name: 'safe',
  component: safe,
}, {
  path: '/setting/reboot',
  name: 'reboot',
  component: reboot,
}];
export default new Router({
  routes
});
