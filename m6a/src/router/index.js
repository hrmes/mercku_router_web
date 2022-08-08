import Vue from 'vue';
import Router from 'vue-router';

import login from 'pages/login/index.vue';
import dashboard from 'pages/bussiness/dashboard/index.vue';
import mesh from 'pages/bussiness/dashboard/mesh.vue';
import internet from 'pages/bussiness/dashboard/internet.vue';
import wan from 'pages/bussiness/setting/wan.vue';
import wifi from 'pages/bussiness/setting/wifi.vue';
import guest from 'pages/bussiness/setting/guest.vue';
import unconnect from 'pages/error/unconnect/index.vue';
import online from 'pages/bussiness/upgrade/online.vue';
import meshAdd from 'pages/bussiness/mesh/add.vue';
import diagnosis from 'pages/bussiness/advance/diagnosis.vue';
import superConfig from 'pages/bussiness/setting/super.vue';
import telnet from 'pages/bussiness/advance/telnet.vue';
import tr069 from 'pages/bussiness/advance/tr069.vue';

import device from 'base/pages/bussiness/dashboard/device.vue';
import auto from 'base/pages/bussiness/upgrade/auto.vue';
import offline from 'base/pages/bussiness/upgrade/offline.vue';
import ipv6 from 'base/pages/bussiness/setting/ipv6.vue';
import wlan from 'base/pages/bussiness/wlan/index.vue';
import ddns from 'base/pages/bussiness/advance/ddns.vue';
import timezone from 'base/pages/bussiness/setting/timezone.vue';
import blacklist from 'base/pages/bussiness/setting/blacklist.vue';
import safe from 'base/pages/bussiness/setting/safe.vue';
import upnp from 'base/pages/bussiness/setting/upnp.vue';
import urlLimit from 'base/pages/bussiness/dashboard/limit/blacklist.vue';
import portforwarding from 'base/pages/bussiness/advance/port/index.vue';
import rsvdip from 'base/pages/bussiness/advance/rsvdip/index.vue';
import dmz from 'base/pages/bussiness/advance/dmz.vue';
import firewall from 'base/pages/bussiness/advance/firewall.vue';
import log from 'base/pages/bussiness/advance/log.vue';
import vpn from 'base/pages/bussiness/advance/vpn/index.vue';
import vpnForm from 'base/pages/bussiness/advance/vpn/form.vue';
import mode from 'base/pages/bussiness/advance/mode.vue';
import region from 'base/pages/bussiness/setting/region.vue';
import limit from 'base/pages/bussiness/dashboard/limit/index.vue';
import speedLimit from 'base/pages/bussiness/dashboard/limit/speed.vue';
import dhcp from 'base/pages/bussiness/advance/dhcp/index.vue';
import mac from 'base/pages/bussiness/advance/mac.vue';
import wwa from 'base/pages/bussiness/advance/wwa.vue';
import timeLimit from 'base/pages/bussiness/dashboard/limit/time.vue';
import rsvdipForm from 'base/pages/bussiness/advance/rsvdip/form.vue';
import portfwForm from 'base/pages/bussiness/advance/port/form.vue';
import wifiSchedule from 'base/pages/bussiness/setting/wifi-schedule.vue';
import led from 'base/pages/bussiness/setting/led.vue';
import backup from 'base/pages/bussiness/advance/backup.vue';

import homewayMesh from '../pages/homeway-pages/bussiness/dashboard/mesh.vue';
import homewayDevice from '../pages/homeway-pages/bussiness/dashboard/device.vue';
import homewayInternet from '../pages/homeway-pages/bussiness/dashboard/internet.vue';
import homewayWifi from '../pages/homeway-pages/bussiness/setting/wifi.vue';
import homewayChildLock from '../pages/homeway-pages/bussiness/setting/childLock.vue';
import homewayMode from '../pages/homeway-pages/bussiness/advance/mode.vue';
import homewayWlan from '../pages/homeway-pages/bussiness/wlan/index.vue';
import homewayWifisetting from '../pages/homeway-pages/bussiness/wlan/wifiSetting.vue';
import homewayWifisetting230v from '../pages/homeway-pages/bussiness/wlan/wifiSetting_230v.vue';

import { HomewaySnModel, Customers } from '../../../base/src/util/constant';

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
      redirect: '/dashboard/mesh/table',
      children: [
        {
          path: '/dashboard/device/:id?',
          name: 'device',
          component: device,
          beforeEnter: (to, from, next) => {
            // eslint-disable-next-line no-nested-ternary
            process.env.CUSTOMER_CONFIG.id !== Customers.homeway
              ? next()
              : localStorage.getItem('modelVersion') ===
                HomewaySnModel.Homeway_M6a
              ? next()
              : next({ name: 'homewayDevice' });
          }
        },
        {
          path: '/dashboard/mesh/:category',
          name: 'mesh',
          component: mesh,
          beforeEnter: (to, from, next) => {
            // eslint-disable-next-line no-nested-ternary
            process.env.CUSTOMER_CONFIG.id !== Customers.homeway
              ? next()
              : localStorage.getItem('modelVersion') ===
                HomewaySnModel.Homeway_M6a
              ? next()
              : next({ name: 'homewayMesh' });
          }
        },
        {
          path: '/dashboard/internet',
          name: 'internet',
          component: internet,
          beforeEnter: (to, from, next) => {
            // eslint-disable-next-line no-nested-ternary
            process.env.CUSTOMER_CONFIG.id !== Customers.homeway
              ? next()
              : localStorage.getItem('modelVersion') ===
                HomewaySnModel.Homeway_M6a
              ? next()
              : next({ name: 'homewayInternet' });
          }
        },
        {
          path: '/dashboard/mesh/topo',
          name: 'homewayMesh',
          component: homewayMesh
        },
        {
          path: '/dashboard/mesh/device',
          name: 'homewayDevice',
          component: homewayDevice
        },
        {
          path: '/dashboard/internet',
          name: 'homewayInternet',
          component: homewayInternet
        }
      ]
    },
    {
      path: '/mesh/add',
      name: 'mesh-add',
      component: meshAdd
    },
    {
      path: '/limit/:mac',
      name: 'device-limit',
      component: limit,
      redirect: '/limit/:mac/time',
      children: [
        {
          path: '/limit/:mac/speed',
          name: 'device-limit-speed',
          component: speedLimit
        },
        {
          path: '/limit/:mac/time',
          name: 'device-limit-time',
          component: timeLimit
        },
        {
          path: '/limit/:mac/url',
          name: 'device-limit-url',
          component: urlLimit
        }
      ]
    },
    {
      path: '/setting/wan',
      name: 'wan',
      component: wan
    },
    {
      path: '/setting/ipv6',
      name: 'ipv6',
      component: ipv6
    },
    {
      path: '/setting/wifi',
      name: 'wifi',
      component: wifi,
      beforeEnter: (to, from, next) => {
        // eslint-disable-next-line no-nested-ternary
        process.env.CUSTOMER_CONFIG.id !== Customers.homeway
          ? next()
          : localStorage.getItem('modelVersion') === HomewaySnModel.Homeway_M6a
          ? next()
          : next({ name: 'homewayWifi' });
      }
    },
    {
      path: '/setting/wifi',
      name: 'homewayWifi',
      component: homewayWifi
    },
    {
      path: '/setting/safe',
      name: 'safe',
      component: safe
    },
    {
      path: '/setting/region',
      name: 'region',
      component: region
    },
    {
      path: '/setting/guest',
      name: 'guest',
      component: guest
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
      path: '/setting/upnp',
      name: 'upnp',
      component: upnp
    },
    {
      path: '/setting/led',
      name: 'led',
      component: led
    },
    {
      path: '/setting/child-lock',
      name: 'child-lock',
      component: homewayChildLock
    },
    {
      path: '/setting/wifi-schedule',
      name: 'wifi-schedule',
      component: wifiSchedule
    },
    {
      path: '/wlan',
      name: 'wlan',
      component: wlan,
      beforeEnter: (to, from, next) => {
        // eslint-disable-next-line no-nested-ternary
        process.env.CUSTOMER_CONFIG.id !== Customers.homeway
          ? next()
          : localStorage.getItem('modelVersion') === HomewaySnModel.Homeway_M6a
          ? next()
          : next({ name: 'homeway-wlan' });
      }
    },
    {
      path: '/wlan',
      name: 'homeway-wlan',
      component: homewayWlan
    },
    {
      path: '/wlan/wifisetting',
      name: 'homeway-wifisetting',
      component: homewayWifisetting
    },
    {
      path: '/wlan/wifisetting-230v',
      name: 'homeway-wifisetting-230v',
      component: homewayWifisetting230v
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
      path: '/advance/portforwarding',
      name: 'advance-portforwarding',
      component: portforwarding
    },
    {
      path: '/advance/portforwarding/form/:id?',
      name: 'advance-portforwarding-form',
      component: portfwForm
    },
    {
      path: '/advance/rsvdip',
      name: 'advance-rsvdip',
      component: rsvdip
    },
    {
      path: '/advance/rsvdip/form/:id?',
      name: 'advance-rsvdip-form',
      component: rsvdipForm
    },
    {
      path: '/advance/dhcp',
      name: 'advance-dhcp',
      component: dhcp
    },
    {
      path: '/advance/dmz',
      name: 'advance-dmz',
      component: dmz
    },
    {
      path: '/advance/firewall',
      name: 'advance-firewall',
      component: firewall
    },
    {
      path: '/advance/ddns',
      name: 'advance-ddns',
      component: ddns
    },
    {
      path: '/advance/mac',
      name: 'advance-mac',
      component: mac
    },
    {
      path: '/advance/log',
      name: 'advance-log',
      component: log
    },
    {
      path: '/advance/diagnosis',
      name: 'advance-diagnosis',
      component: diagnosis
    },
    {
      path: '/advance/vpn',
      name: 'advance-vpn',
      component: vpn
    },
    {
      path: '/advance/vpn/form/:id?',
      name: 'advance-vpn-form',
      component: vpnForm
    },
    {
      path: '/advance/tr069',
      name: 'advance.tr069',
      component: tr069
    },
    {
      path: '/advance/telnet',
      name: 'advance.telnet',
      component: telnet
    },
    {
      path: '/advance/mode',
      name: 'advance-mode',
      component: mode,
      beforeEnter: (to, from, next) => {
        // eslint-disable-next-line no-nested-ternary
        process.env.CUSTOMER_CONFIG.id !== Customers.homeway
          ? next()
          : localStorage.getItem('modelVersion') === HomewaySnModel.Homeway_M6a
          ? next()
          : next({ name: 'homewayMode' });
      }
    },
    {
      path: '/advance/mode',
      name: 'homewayMode',
      component: homewayMode
    },
    {
      path: '/advance/wwa',
      name: 'advance.wwa',
      component: wwa
    },
    {
      path: '/advance/backup',
      name: 'advance.backup',
      component: backup
    },
    {
      path: '/setting/super',
      name: 'super',
      component: superConfig
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
    path: '/',
    redirect: `${prefix}/wlan`
  },
  {
    path: '*',
    redirect: `${prefix}/login`
  }
]);
export default new Router(routes);
