import Vue from 'vue';
import Router from 'vue-router';
import login from '../pages/login/index.vue';
import dashboard from '../pages/bussiness/dashboard/index.vue';
import device from '../pages/bussiness/dashboard/device.vue';
import mesh from '../pages/bussiness/dashboard/mesh.vue';
import internet from '../pages/bussiness/dashboard/internet.vue';
import network from '../pages/bussiness/setting/network.vue';
import timezone from '../pages/bussiness/setting/timezone.vue';
import blacklist from '../pages/bussiness/setting/blacklist.vue';
import wifi from '../pages/bussiness/setting/wifi.vue';
import safe from '../pages/bussiness/setting/safe.vue';
import reboot from '../pages/bussiness/setting/reboot.vue';
import wlan from '../pages/bussiness/wlan/index.vue';
import unconnect from '../pages/error/unconnect/index.vue';
import online from '../pages/bussiness/upgrade/online.vue';
import offline from '../pages/bussiness/upgrade/offline.vue';
import meshAdd from '../pages/bussiness/mesh/add.vue';
import timeLimit from '../pages/bussiness/dashboard/limit/time.vue';
import speedLimit from '../pages/bussiness/dashboard/limit/speed.vue';
import blacklistLimit from '../pages/bussiness/dashboard/limit/blacklist';

Vue.use(Router);
const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: dashboard,
    redirect: '/dashboard/mesh',
    children: [{
        path: '/dashboard/device',
        name: 'device',
        component: device
      },
      {
        path: '/dashboard/mesh',
        name: 'mesh',
        component: mesh
      },
      {
        path: '/dashboard/internet',
        name: 'internet',
        component: internet
      }
    ]
  },
  {
    path: '/mesh/add',
    name: 'meshadd',
    component: meshAdd
  },
  {
    path: '/limit/speed',
    name: 'speed-limit',
    component: speedLimit
  },
  {
    path: '/limit/time',
    name: 'time-limit',
    component: timeLimit
  },
  {
    path: '/limit/blacklist',
    name: 'blacklist-limit',
    component: blacklistLimit
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
    path: '/setting/timezone',
    name: 'timezone',
    component: timezone
  },
  {
    path: '/setting/blacklist',
    name: 'blacklist',
    component: blacklist
  },
  {
    path: '/wlan',
    name: 'wlan',
    component: wlan
  },
  {
    path: '/unconnect',
    name: 'unconnect',
    component: unconnect
  },
  {
    path: '/upgrade/online',
    name: 'online',
    component: online
  },
  {
    path: '/upgrade/offline',
    name: 'offline',
    component: offline
  }
]
export default new Router({
  routes
});
