/*
 * MVU => Minimum Viable Unit, 意为最小可用单元
 * 该文件为最小可用单元的路由配置
 */
import login from 'pages/login/index.vue';
// import dashboard from 'pages/bussiness/dashboard/index.vue';
// import device from 'pages/bussiness/dashboard/device.vue';
// import mesh from 'pages/bussiness/dashboard/mesh.vue';
// import internet from 'pages/bussiness/dashboard/internet.vue';
import wan from 'pages/bussiness/setting/wan.vue';
import wlan from 'pages/bussiness/wlan/index.vue';
import wifi from 'pages/bussiness/setting/wifi.vue';
import unconnect from 'pages/error/unconnect/index.vue';
import online from 'pages/bussiness/upgrade/online.vue';
import superConfig from 'pages/bussiness/setting/super.vue';

import auto from 'base/pages/bussiness/upgrade/auto.vue';
import offline from 'base/pages/bussiness/upgrade/offline.vue';
import safe from 'base/pages/bussiness/setting/safe.vue';
import mode from 'base/pages/bussiness/advance/mode.vue';

const mvuRoutes = [
  {
    path: '/login',
    name: 'login',
    component: login
  },
  // {
  //   path: '/dashboard',
  //   name: 'dashboard',
  //   component: dashboard
  // },
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
  // {
  //   path: '/dashboard/device/:id?',
  //   name: 'device',
  //   component: device,
  //   meta: {
  //     text: 'trans0235',
  //     layout: 'primary',
  //     parentPath: '/dashboard'
  //   }
  // },
  // {
  //   path: '/dashboard/mesh',
  //   name: 'mesh',
  //   component: mesh,
  //   meta: {
  //     text: 'trans0312',
  //     layout: 'primary',
  //     parentPath: '/dashboard'
  //   }
  // },
  // {
  //   path: '/dashboard/internet',
  //   name: 'internet',
  //   component: internet,
  //   meta: {
  //     text: 'trans0366',
  //     layout: 'primary',
  //     parentPath: '/dashboard'
  //   }
  // },
  {
    path: '/setting/wan',
    name: 'wan',
    component: wan,
    meta: {
      layout: 'primary',
      hasAside: true
    }
  },
  {
    path: '/setting/wifi',
    name: 'wifi',
    component: wifi,
    meta: {
      layout: 'primary',
      hasAside: true
    }
  },
  {
    path: '/setting/safe',
    name: 'safe',
    component: safe,
    meta: {
      layout: 'primary',
      hasAside: true
    }
  },
  {
    path: '/setting/super',
    name: 'super',
    component: superConfig,
    meta: {
      layout: 'primary',
      hasAside: true
    }
  },
  {
    path: '/advance/mode',
    name: 'advance-mode',
    component: mode,
    meta: {
      layout: 'primary',
      hasAside: true
    }
  },
  {
    path: '/upgrade/online',
    name: 'online',
    component: online,
    meta: {
      layout: 'primary',
      hasAside: true
    }
  },
  {
    path: '/upgrade/offline',
    name: 'offline',
    component: offline,
    meta: {
      layout: 'primary',
      hasAside: true
    }
  },
  {
    path: '/upgrade/auto',
    name: 'auto',
    component: auto,
    meta: {
      layout: 'primary',
      hasAside: true
    }
  }
];

export default mvuRoutes;
