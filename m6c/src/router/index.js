import Vue from 'vue';
import Router from 'vue-router';
import login from '../../../base/src/pages/login/index.vue';
import dashboard from '../../../base/src/pages/bussiness/dashboard/index.vue';
import device from '../../../base/src/pages/bussiness/dashboard/device.vue';
import mesh from '../../../base/src/pages/bussiness/dashboard/mesh.vue';
import internet from '../../../base/src/pages/bussiness/dashboard/internet.vue';
import wan from '../../../base/src/pages/bussiness/setting/wan.vue';
import ipv6 from '../../../base/src/pages/bussiness/setting/ipv6.vue';
import upnp from '../../../base/src/pages/bussiness/setting/upnp.vue';
import timezone from '../../../base/src/pages/bussiness/setting/timezone.vue';
import blacklist from '../../../base/src/pages/bussiness/setting/blacklist.vue';
import wifi from '../../../base/src/pages/bussiness/setting/wifi.vue';
import safe from '../../../base/src/pages/bussiness/setting/safe.vue';
import wlan from '../../../base/src/pages/bussiness/wlan/index.vue';
import unconnect from '../../../base/src/pages/error/unconnect/index.vue';
import online from '../../../base/src/pages/bussiness/upgrade/online.vue';
import offline from '../../../base/src/pages/bussiness/upgrade/offline.vue';
import meshAdd from '../../../base/src/pages/bussiness/mesh/add.vue';
import limit from '../../../base/src/pages/bussiness/dashboard/limit/index.vue';
import timeLimit from '../../../base/src/pages/bussiness/dashboard/limit/time.vue';
import speedLimit from '../../../base/src/pages/bussiness/dashboard/limit/speed.vue';
import urlLimit from '../../../base/src/pages/bussiness/dashboard/limit/blacklist.vue';
import portforwarding from '../../../base/src/pages/bussiness/advance/port/index.vue';
import portfwForm from '../../../base/src/pages/bussiness/advance/port/form.vue';
import rsvdip from '../../../base/src/pages/bussiness/advance/rsvdip/index.vue';
import rsvdipForm from '../../../base/src/pages/bussiness/advance/rsvdip/form.vue';
import dhcp from '../../../base/src/pages/bussiness/advance/dhcp/index.vue';
import dmz from '../../../base/src/pages/bussiness/advance/dmz.vue';
import firewall from '../../../base/src/pages/bussiness/advance/firewall.vue';
import ddns from '../../../base/src/pages/bussiness/advance/ddns.vue';
import mac from '../../../base/src/pages/bussiness/advance/mac.vue';
import log from '../../../base/src/pages/bussiness/advance/log.vue';
import diagnosis from '../../../base/src/pages/bussiness/advance/diagnosis.vue';
import vpn from '../../../base/src/pages/bussiness/advance/vpn/index.vue';
import vpnForm from '../../../base/src/pages/bussiness/advance/vpn/form.vue';
import guest from '../../../base/src/pages/bussiness/setting/guest.vue';
import remote from '../../../base/src/pages/bussiness/advance/remote.vue';
import mode from '../../../base/src/pages/bussiness/advance/mode.vue';
import region from '../../../base/src/pages/bussiness/setting/region.vue';
import wwa from '../../../base/src/pages/bussiness/advance/wwa.vue';

Vue.use(Router);
export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/dashboard'
    },
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
      path: '/advance/remote/:category',
      name: 'advance-remote',
      component: remote
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
    }
  ]
});
