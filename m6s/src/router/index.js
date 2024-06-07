import Vue from 'vue';
import Router from 'vue-router';

// common page
import login from 'pages/login/index.vue';
import wlan from 'pages/bussiness/wlan/index.vue';
import unconnect from 'base/pages/error/unconnect/index.vue';

// dashboard page
import dashboard from 'base/pages/bussiness/dashboard/index.vue';
import device from 'base/pages/bussiness/dashboard/device.vue';
import mesh from 'base/pages/bussiness/dashboard/mesh.vue';
import internet from 'base/pages/bussiness/dashboard/internet.vue';
import limit from 'base/pages/bussiness/dashboard/limit/index.vue';
import timeLimit from 'base/pages/bussiness/dashboard/limit/time.vue';
import urlLimit from 'base/pages/bussiness/dashboard/limit/blacklist.vue';
import meshAdd from 'pages/bussiness/mesh/add.vue';

// setting page
import wifi from 'pages/bussiness/setting/wifi.vue';
import wan from 'pages/bussiness/setting/wan.vue';
import ipv6 from 'base/pages/bussiness/setting/ipv6.vue';
import safe from 'base/pages/bussiness/setting/safe.vue';
import superConfig from 'base/pages/bussiness/setting/super.vue';
import blacklist from 'base/pages/bussiness/setting/blacklist.vue';
import timezone from 'base/pages/bussiness/setting/timezone.vue';
import region from 'base/pages/bussiness/setting/region.vue';
import guest from 'base/pages/bussiness/setting/guest.vue';
import upnp from 'base/pages/bussiness/setting/upnp.vue';
import wps from 'base/pages/bussiness/setting/wps.vue';
// import sfp from 'pages/bussiness/setting/sfp.vue';

// advance page
import portforwarding from 'base/pages/bussiness/advance/port/index.vue';
import dmz from 'base/pages/bussiness/advance/dmz.vue';
import dhcp from 'base/pages/bussiness/advance/dhcp.vue';
import rsvdip from 'base/pages/bussiness/advance/rsvdip/index.vue';
import mac from 'base/pages/bussiness/advance/mac.vue';
import ddns from 'base/pages/bussiness/advance/ddns.vue';
import vpn from 'base/pages/bussiness/advance/vpn/index.vue';
import mode from 'pages/bussiness/advance/mode.vue';
import diagnosis from 'base/pages/bussiness/advance/diagnosis.vue';
import log from 'pages/bussiness/advance/log.vue';
import firewall from 'base/pages/bussiness/advance/firewall.vue';
import wwa from 'base/pages/bussiness/advance/wwa.vue';
import telnet from 'base/pages/bussiness/advance/telnet.vue';
import tr069 from 'base/pages/bussiness/advance/tr069.vue';
import backup from 'base/pages/bussiness/advance/backup.vue';

// upgrade page
import online from 'base/pages/bussiness/upgrade/online.vue';
import offline from 'base/pages/bussiness/upgrade/offline.vue';
import auto from 'base/pages/bussiness/upgrade/auto.vue';

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
      component: dashboard
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
      path: '/dashboard/device/:id?',
      name: 'device',
      component: device,
      meta: {
        text: 'trans0235',
        layout: 'primary',
        parentPath: '/dashboard'
      }
    },
    {
      path: '/dashboard/mesh',
      name: 'mesh',
      component: mesh,
      meta: {
        text: 'trans0312',
        layout: 'primary',
        parentPath: '/dashboard'
      }
    },
    {
      path: '/dashboard/internet',
      name: 'internet',
      component: internet,
      meta: {
        text: 'trans0366',
        layout: 'primary',
        parentPath: '/dashboard'
      }
    },
    {
      path: '/mesh/add',
      name: 'mesh-add',
      component: meshAdd,
      meta: {
        text: 'trans1117',
        layout: 'primary'
      }
    },
    {
      path: '/limit/:mac',
      name: 'device-limit',
      component: limit,
      redirect: '/limit/:mac/time',
      children: [
        {
          path: '/limit/:mac/time',
          name: 'device-limit-time',
          component: timeLimit,
          meta: {
            text: 'trans0075',
            parentPath: '/dashboard/device/primary'
          }
        },
        {
          path: '/limit/:mac/url',
          name: 'device-limit-url',
          component: urlLimit,
          meta: {
            text: 'trans0076',
            parentPath: '/dashboard/device/primary'
          }
        }
      ]
    },
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
      path: '/setting/ipv6',
      name: 'ipv6',
      component: ipv6,
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
      path: '/setting/region',
      name: 'region',
      component: region,
      meta: {
        layout: 'primary',
        hasAside: true
      }
    },
    {
      path: '/setting/guest',
      name: 'guest',
      component: guest,
      meta: {
        layout: 'primary',
        hasAside: true
      }
    },
    {
      path: '/setting/timezone',
      name: 'timezone',
      component: timezone,
      meta: {
        layout: 'primary',
        hasAside: true
      }
    },
    {
      path: '/setting/blacklist',
      name: 'blacklist',
      component: blacklist,
      meta: {
        layout: 'primary',
        hasAside: true
      }
    },
    {
      path: '/setting/upnp',
      name: 'upnp',
      component: upnp,
      meta: {
        layout: 'primary',
        hasAside: true
      }
    },
    {
      path: '/setting/wps',
      name: 'wps',
      component: wps,
      meta: {
        layout: 'primary',
        hasAside: true
      }
    },
    // {
    //   path: '/setting/sfp',
    //   name: 'sfp',
    //   component: sfp,
    //   meta: {
    //     layout: 'primary',
    //     hasAside: true
    //   }
    // },
    {
      path: '/advance/portforwarding',
      name: 'advance-portforwarding',
      component: portforwarding,
      meta: {
        layout: 'primary',
        hasAside: true
      }
    },
    {
      path: '/advance/rsvdip',
      name: 'advance-rsvdip',
      component: rsvdip,
      meta: {
        layout: 'primary',
        hasAside: true
      }
    },
    {
      path: '/advance/dhcp',
      name: 'advance-dhcp',
      component: dhcp,
      meta: {
        layout: 'primary',
        hasAside: true
      }
    },
    {
      path: '/advance/dmz',
      name: 'advance-dmz',
      component: dmz,
      meta: {
        layout: 'primary',
        hasAside: true
      }
    },
    {
      path: '/advance/firewall',
      name: 'advance-firewall',
      component: firewall,
      meta: {
        layout: 'primary',
        hasAside: true
      }
    },
    {
      path: '/advance/ddns',
      name: 'advance-ddns',
      component: ddns,
      meta: {
        layout: 'primary',
        hasAside: true
      }
    },
    {
      path: '/advance/mac',
      name: 'advance-mac',
      component: mac,
      meta: {
        layout: 'primary',
        hasAside: true
      }
    },
    {
      path: '/advance/log',
      name: 'advance-log',
      component: log,
      meta: {
        layout: 'primary',
        hasAside: true
      }
    },
    {
      path: '/advance/diagnosis',
      name: 'advance-diagnosis',
      component: diagnosis,
      meta: {
        layout: 'primary',
        hasAside: true
      }
    },
    {
      path: '/advance/vpn',
      name: 'advance-vpn',
      component: vpn,
      meta: {
        layout: 'primary',
        hasAside: true
      }
    },
    {
      path: '/advance/tr069',
      name: 'advance.tr069',
      component: tr069,
      meta: {
        layout: 'primary',
        hasAside: true
      }
    },
    {
      path: '/advance/telnet',
      name: 'advance.telnet',
      component: telnet,
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
      path: '/advance/wwa',
      name: 'advance.wwa',
      component: wwa,
      meta: {
        layout: 'primary',
        hasAside: true
      }
    },
    {
      path: '/advance/backup',
      name: 'advance.backup',
      component: backup,
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

const router = new Router(routes);
router.beforeEach((to, from, next) => {
  if (to.name !== from.name) {
    store.commit('clearToken'); // 取消请求
  }
  next();
});

export default router;
