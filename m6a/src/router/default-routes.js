// common page
import login from 'pages/login/index.vue';
import wlan from 'pages/bussiness/wlan/index.vue';
import unconnect from 'base/pages/error/unconnect/index.vue';
// dashboard page
import dashboard from 'pages/bussiness/dashboard/index.vue';
import device from 'pages/bussiness/dashboard/device.vue';
import mesh from 'pages/bussiness/dashboard/mesh.vue';
import internet from 'base/pages/bussiness/dashboard/internet.vue';
import limit from 'base/pages/bussiness/dashboard/limit/index.vue';
import timeLimit from 'base/pages/bussiness/dashboard/limit/time.vue';
import urlLimit from 'base/pages/bussiness/dashboard/limit/blacklist.vue';
import meshAdd from 'pages/bussiness/mesh/add.vue';

// setting page
// import wan from 'pages/bussiness/setting/wan.vue';
// import ipv6 from 'base/pages/bussiness/setting/ipv6.vue';
// import safe from 'base/pages/bussiness/setting/safe.vue';
// import superConfig from 'base/pages/bussiness/setting/super.vue';
// import blacklist from 'base/pages/bussiness/setting/blacklist.vue';
// import timezone from 'base/pages/bussiness/setting/timezone.vue';
// import region from 'base/pages/bussiness/setting/region.vue';
// import guest from 'base/pages/bussiness/setting/guest.vue';
// import upnp from 'base/pages/bussiness/setting/upnp.vue';
// import wifiSchedule from 'base/pages/bussiness/setting/wifi-schedule.vue';
// import led from 'base/pages/bussiness/setting/led.vue';

// advance page
import portforwarding from 'base/pages/bussiness/advance/port/index.vue';
import dmz from 'base/pages/bussiness/advance/dmz.vue';
import dhcp from 'base/pages/bussiness/advance/dhcp.vue';
import rsvdip from 'base/pages/bussiness/advance/rsvdip/index.vue';
import mac from 'base/pages/bussiness/advance/mac.vue';
import ddns from 'base/pages/bussiness/advance/ddns.vue';
import vpn from 'pages/bussiness/advance/vpn/index.vue';
import mode from 'base/pages/bussiness/advance/mode.vue';
import diagnosis from 'base/pages/bussiness/advance/diagnosis.vue';
import log from 'base/pages/bussiness/advance/log.vue';
import frozenConfig from 'pages/bussiness/advance/frozen-config/index.vue';
import firewall from 'base/pages/bussiness/advance/firewall.vue';
import wwa from 'base/pages/bussiness/advance/wwa.vue';
import tr069 from 'base/pages/bussiness/advance/tr069.vue';
import telnet from 'base/pages/bussiness/advance/telnet.vue';
import backup from 'base/pages/bussiness/advance/backup.vue';

// upgrade page
// import online from 'base/pages/bussiness/upgrade/online.vue';
// import offline from 'base/pages/bussiness/upgrade/offline.vue';
// import auto from 'base/pages/bussiness/upgrade/auto.vue';

const defaultRoutes = [
  {
    path: '/login',
    name: 'login',
    component: login,
    meta: {
      noMountedLoading: true
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: dashboard,
    meta: {
      noMountedLoading: true
    }
  },
  {
    path: '/wlan',
    name: 'wlan',
    component: wlan
  },
  {
    path: '/unconnect',
    name: 'unconnect',
    component: unconnect,
    meta: {
      noMountedLoading: true
    }
  },
  {
    path: '/dashboard/device/:id?',
    name: 'device',
    component: device,
    meta: {
      text: 'trans0235',
      layout: 'primary',
      parentPath: '/dashboard',
      noMountedLoading: true
    }
  },
  {
    path: '/dashboard/mesh',
    name: 'mesh',
    component: mesh,
    meta: {
      text: 'trans0312',
      layout: 'primary',
      parentPath: '/dashboard',
      noMountedLoading: true
    }
  },
  {
    path: '/dashboard/internet',
    name: 'internet',
    component: internet,
    meta: {
      text: 'trans0366',
      layout: 'primary',
      parentPath: '/dashboard',
      noMountedLoading: true
    }
  },
  {
    path: '/mesh/add',
    name: 'mesh-add',
    component: meshAdd,
    meta: {
      text: 'trans1117',
      layout: 'primary',
      noMountedLoading: true
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
    path: '/setting/wifi',
    name: 'wifi',
    component: () => import('pages/bussiness/setting/wifi.vue'),
    meta: {
      layout: 'primary',
      hasAside: true
    }
  },
  {
    path: '/setting/wan',
    name: 'wan',
    component: () => import('pages/bussiness/setting/wan.vue'),
    meta: {
      layout: 'primary',
      hasAside: true
    }
  },
  {
    path: '/setting/ipv6',
    name: 'ipv6',
    component: () => import('base/pages/bussiness/setting/ipv6.vue'),
    meta: {
      layout: 'primary',
      hasAside: true
    }
  },
  {
    path: '/setting/safe',
    name: 'safe',
    component: () => import('base/pages/bussiness/setting/safe.vue'),
    meta: {
      layout: 'primary',
      hasAside: true,
      noMountedLoading: true
    }
  },
  {
    path: '/setting/super',
    name: 'super',
    component: () => import('base/pages/bussiness/setting/super.vue'),
    meta: {
      layout: 'primary',
      hasAside: true,
      noMountedLoading: true
    }
  },
  {
    path: '/setting/blacklist',
    name: 'blacklist',
    component: () => import('base/pages/bussiness/setting/blacklist.vue'),
    meta: {
      layout: 'primary',
      hasAside: true
    }
  },
  {
    path: '/setting/timezone',
    name: 'timezone',
    component: () => import('base/pages/bussiness/setting/timezone.vue'),
    meta: {
      layout: 'primary',
      hasAside: true
    }
  },
  {
    path: '/setting/region',
    name: 'region',
    component: () => import('base/pages/bussiness/setting/region.vue'),
    meta: {
      layout: 'primary',
      hasAside: true
    }
  },
  {
    path: '/setting/guest',
    name: 'guest',
    component: () => import('base/pages/bussiness/setting/guest.vue'),
    meta: {
      layout: 'primary',
      hasAside: true
    }
  },
  {
    path: '/setting/upnp',
    name: 'upnp',
    component: () => import('base/pages/bussiness/setting/upnp.vue'),
    meta: {
      layout: 'primary',
      hasAside: true
    }
  },
  {
    path: '/setting/schedule',
    name: 'schedule',
    component: () => import('base/pages/bussiness/setting/wifi-schedule.vue'),
    meta: {
      layout: 'primary',
      hasAside: true
    }
  },
  {
    path: '/setting/led',
    name: 'led',
    component: () => import('base/pages/bussiness/setting/led.vue'),
    meta: {
      layout: 'primary',
      hasAside: true
    }
  },
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
    path: '/advance/frozenCofig',
    name: 'advance-frozen-cofig',
    component: frozenConfig,
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
      hasAside: true,
      noMountedLoading: true
    }
  },
  {
    path: '/upgrade/offline',
    name: 'offline',
    component: () => import('base/pages/bussiness/upgrade/offline.vue'),
    meta: {
      layout: 'primary',
      hasAside: true,
      noMountedLoading: true
    }
  },
  {
    path: '/upgrade/online',
    name: 'online',
    component: () => import('base/pages/bussiness/upgrade/online.vue'),
    meta: {
      layout: 'primary',
      hasAside: true
    }
  },

  {
    path: '/upgrade/auto',
    name: 'auto',
    component: () => import('base/pages/bussiness/upgrade/auto.vue'),
    meta: {
      layout: 'primary',
      hasAside: true
    }
  }
];

export default defaultRoutes;
