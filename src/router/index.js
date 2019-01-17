import Vue from 'vue';
import Router from 'vue-router';
import login from 'pages/login/index.vue';
import dashboard from 'pages/bussiness/dashboard/index.vue';
import device from 'pages/bussiness/dashboard/device.vue';
import mesh from 'pages/bussiness/dashboard/mesh.vue';
import internet from 'pages/bussiness/dashboard/internet.vue';
import wan from 'pages/bussiness/setting/wan.vue';
import timezone from 'pages/bussiness/setting/timezone.vue';
import blacklist from 'pages/bussiness/setting/blacklist.vue';
import wifi from 'pages/bussiness/setting/wifi.vue';
import safe from 'pages/bussiness/setting/safe.vue';
import wlan from 'pages/bussiness/wlan/index.vue';
import unconnect from 'pages/error/unconnect/index.vue';
import online from 'pages/bussiness/upgrade/online.vue';
import offline from 'pages/bussiness/upgrade/offline.vue';
import meshAdd from 'pages/bussiness/mesh/add.vue';
import timeLimit from 'pages/bussiness/dashboard/limit/time.vue';
import speedLimit from 'pages/bussiness/dashboard/limit/speed.vue';
import blacklistLimit from 'pages/bussiness/dashboard/limit/blacklist.vue';
import portforwarding from 'pages/bussiness/advance/port/index.vue';
import portfwForm from 'pages/bussiness/advance/port/form.vue';
import rsvdip from 'pages/bussiness/advance/rsvdip/index.vue';
import rsvdipForm from 'pages/bussiness/advance/rsvdip/form.vue';
import dhcp from 'pages/bussiness/advance/dhcp/index.vue';
import dmz from 'pages/bussiness/advance/dmz.vue';
import firewall from 'pages/bussiness/advance/firewall.vue';
import ddns from 'pages/bussiness/advance/ddns.vue';
import mac from 'pages/bussiness/advance/mac.vue';
import log from 'pages/bussiness/advance/log.vue';
import diagnosis from 'pages/bussiness/advance/diagnosis.vue';
import vpn from 'pages/bussiness/advance/vpn/index.vue';
import vpnForm from 'pages/bussiness/advance/vpn/form.vue';
import guest from 'pages/bussiness/setting/guest.vue';
import remote from 'pages/bussiness/advance/remote.vue';

Vue.use(Router);
const routes = [
  {
    path: '*',
    redirect: '/dashboard'
  }, {
    path: '/',
    redirect: '/login'
  }, {
    path: '/login',
    name: 'login',
    component: login
  }, {
    path: '/dashboard',
    name: 'dashboard',
    component: dashboard,
    redirect: '/dashboard/mesh/topo',
    children: [
      {
        path: '/dashboard/device/:id?',
        name: 'device',
        component: device
      }, {
        path: '/dashboard/mesh/:category',
        name: 'mesh',
        component: mesh
      }, {
        path: '/dashboard/internet',
        name: 'internet',
        component: internet
      }
    ]
  }, {
    path: '/mesh/add',
    name: 'mesh-add',
    component: meshAdd
  }, {
    path: '/limit/speed/:mac',
    name: 'device-speed-limit',
    component: speedLimit
  }, {
    path: '/limit/time/:mac',
    name: 'device-time-limit',
    component: timeLimit
  }, {
    path: '/limit/blacklist/:mac',
    name: 'device-blacklist-limit',
    component: blacklistLimit
  }, {
    path: '/setting/wan',
    name: 'wan',
    component: wan
  }, {
    path: '/setting/wifi',
    name: 'wifi',
    component: wifi
  }, {
    path: '/setting/safe',
    name: 'safe',
    component: safe
  }, {
    path: '/setting/guest',
    name: 'guest',
    component: guest
  }, {
    path: '/setting/timezone',
    name: 'timezone',
    component: timezone
  }, {
    path: '/setting/blacklist',
    name: 'blacklist',
    component: blacklist
  }, {
    path: '/wlan',
    name: 'wlan',
    component: wlan
  }, {
    path: '/unconnect',
    name: 'unconnect',
    component: unconnect
  }, {
    path: '/upgrade/online',
    name: 'online',
    component: online
  }, {
    path: '/upgrade/offline',
    name: 'offline',
    component: offline
  }, {
    path: '/advance/portforwarding',
    name: 'advance-portforwarding',
    component: portforwarding
  }, {
    path: '/advance/portforwarding/form/:id?',
    name: 'advance-portforwarding-form',
    component: portfwForm
  }, {
    path: '/advance/rsvdip',
    name: 'advance-rsvdip',
    component: rsvdip
  }, {
    path: '/advance/rsvdip/form/:id?',
    name: 'advance-rsvdip-form',
    component: rsvdipForm
  }, {
    path: '/advance/dhcp',
    name: 'advance-dhcp',
    component: dhcp
  }, {
    path: '/advance/dmz',
    name: 'advance-dmz',
    component: dmz
  }, {
    path: '/advance/firewall',
    name: 'advance-firewall',
    component: firewall
  }, {
    path: '/advance/ddns',
    name: 'advance-ddns',
    component: ddns
  }, {
    path: '/advance/mac',
    name: 'advance-mac',
    component: mac
  }, {
    path: '/advance/log',
    name: 'advance-log',
    component: log
  }, {
    path: '/advance/diagnosis',
    name: 'advance-diagnosis',
    component: diagnosis
  }, {
    path: '/advance/vpn',
    name: 'advance-vpn',
    component: vpn
  }, {
    path: '/advance/vpn/form/:id?',
    name: 'advance-vpn-form',
    component: vpnForm
  }, {
    path: '/advance/remote/:category',
    name: 'advance-remote',
    component: remote
  }
];
export default new Router({ routes });
