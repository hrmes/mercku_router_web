import Vue from 'vue';
import Router from 'vue-router';

import login from 'pages/login/index.vue';
import dashboard from 'pages/bussiness/dashboard/index.vue';
import mesh from 'pages/bussiness/dashboard/mesh.vue';
import internet from 'pages/bussiness/dashboard/internet.vue';
import wan from 'pages/bussiness/setting/wan.vue';
import wifi from 'pages/bussiness/setting/wifi.vue';
import unconnect from 'pages/error/unconnect/index.vue';
import online from 'pages/bussiness/upgrade/online.vue';
import meshAdd from 'pages/bussiness/mesh/add.vue';
import diagnosis from 'pages/bussiness/advance/diagnosis.vue';
import superConfig from 'pages/bussiness/setting/super.vue';
import telnet from 'pages/bussiness/advance/telnet.vue';

import device from 'base/pages/bussiness/dashboard/device.vue';
import auto from 'base/pages/bussiness/upgrade/auto.vue';
import guest from 'base/pages/bussiness/setting/guest.vue';
import offline from 'base/pages/bussiness/upgrade/offline.vue';
import ipv6 from 'base/pages/bussiness/setting/ipv6.vue';
import wlan from 'base/pages/bussiness/wlan/index.vue';
import tr069 from 'base/pages/bussiness/advance/tr069.vue';
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
      component: wifi
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
      path: '/setting/wifi-schedule',
      name: 'wifi-schedule',
      component: wifiSchedule
    },
    {
      path: '/setting/backup',
      name: 'backup',
      component: backup
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
      component: mode
    },
    {
      path: '/advance/wwa',
      name: 'advance.wwa',
      component: wwa
    },
    {
      path: '/setting/super',
      name: 'setting.super',
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
    path: '*',
    redirect: `${prefix}/wlan`
  },
  {
    path: '/',
    redirect: `${prefix}/login`
  }
]);
export default new Router(routes);
