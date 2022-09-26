import Vue from 'vue';
import Router from 'vue-router';

import login from 'pages/login/index.vue';
import dashboard from 'pages/bussiness/dashboard/index.vue';
import device from 'pages/bussiness/dashboard/device.vue';
import mesh from 'pages/bussiness/dashboard/mesh.vue';
import internet from 'pages/bussiness/dashboard/internet.vue';
import wifi from 'pages/bussiness/setting/wifi.vue';
import unconnect from 'pages/error/unconnect/index.vue';
import online from 'pages/bussiness/upgrade/online.vue';
import childLock from 'pages/bussiness/setting/childLock.vue';
import mode from 'pages/bussiness/advance/mode.vue';
import wlan from 'pages/bussiness/wlan/index.vue';
import wifiSetting from 'pages/bussiness/wlan/wifiSetting.vue';
import wifiSetting_230v from 'pages/bussiness/wlan/wifiSetting_230v.vue';
import wan from 'pages/bussiness/setting/wan.vue';
import wifiSwitch from 'pages/bussiness/setting/wifi-switch.vue';
import led from 'pages/bussiness/setting/led.vue';
// import ipv6 from 'pages/bussiness/setting/ipv6.vue';

import auto from 'base/pages/bussiness/upgrade/auto.vue';
import offline from 'base/pages/bussiness/upgrade/offline.vue';
import timezone from 'base/pages/bussiness/setting/timezone.vue';
import safe from 'base/pages/bussiness/setting/safe.vue';
import log from 'base/pages/bussiness/advance/log.vue';
import region from 'base/pages/bussiness/setting/region.vue';
import backup from 'base/pages/bussiness/advance/backup.vue';

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
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: dashboard,
      redirect: '/dashboard/mesh/topo',
      children: [
        {
          path: '/dashboard/device/:id?',
          name: 'device',
          component: device
        },
        {
          path: '/dashboard/mesh/:category',
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
      path: '/setting/wifi',
      name: 'wifi',
      component: wifi
    },
    // {
    //   path: '/setting/ipv6',
    //   name: 'ipv6',
    //   component: ipv6
    // },
    {
      path: '/setting/safe',
      name: 'safe',
      component: safe
    },
    {
      path: '/setting/wan',
      name: 'wan',
      component: wan
    },
    {
      path: '/setting/region',
      name: 'region',
      component: region
    },
    {
      path: '/setting/timezone',
      name: 'timezone',
      component: timezone
    },
    {
      path: '/setting/childLock',
      name: 'childLock',
      component: childLock
    },
    {
      path: '/setting/led',
      name: 'led',
      component: led
    },
    {
      path: '/setting/switch',
      name: 'switch',
      component: wifiSwitch
    },
    {
      path: '/wlan',
      name: 'wlan',
      component: wlan
    },
    {
      path: '/wlan/wifiSetting',
      name: 'wifiSetting',
      component: wifiSetting
    },
    {
      path: '/wlan/wifiSetting-230v',
      name: 'wifiSetting_230v',
      component: wifiSetting_230v
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
    },
    {
      path: '/upgrade/auto',
      name: 'auto',
      component: auto
    },
    {
      path: '/advance/log',
      name: 'advance-log',
      component: log
    },

    {
      path: '/advance/mode',
      name: 'advance-mode',
      component: mode
    },
    {
      path: '/advance/backup',
      name: 'advance.backup',
      component: backup
    }
  ]
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
recursive(routes.routes);
Array.prototype.push.apply(routes.routes, [
  {
    path: '*',
    redirect: `${prefix}/wlan`
  },
  {
    path: '/',
    redirect: `${prefix}/login`
  }
]);
export default new Router(routes);
