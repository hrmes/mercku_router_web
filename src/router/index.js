import Vue from 'vue';
import Router from 'vue-router';
import welcome from '../pages/welcome/index.vue';
import wanCheck from '../pages/wan-check/index.vue';
import wanHand from '../pages/wan-hand/index.vue';
import staticIp from '../pages/static-ip/index.vue';
import pppoe from '../pages/pppoe/index.vue';
import dhcp from '../pages/dhcp/index.vue';
import complete from '../pages/complete/index.vue';
import login from '../pages/login/index.vue';
import wlan from '../pages/wlan/index.vue';


Vue.use(Router);
export default new Router({
  routes: [

    {
      path: '/',
      redirect: '/wan-check'
    },
    {
      path: '/welcome',
      component: welcome
    },
    {

      path: '/wan-check',
      name: 'wan-check',
      component: wanCheck
    },
    {
      path: '/wan-hand',
      name: 'wan-hand',
      component: wanHand
    },
    {
      path: '/static-ip',
      name: 'static-ip',
      component: staticIp
    },
    {
      path: '/pppoe',
      name: 'pppoe',
      component: pppoe
    },
    {
      path: '/dhcp',
      name: 'dhcp',
      component: dhcp
    },
    {
      path: '/complete',
      name: 'complete',
      component: complete
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/wlan',
      component: wlan
    }

  ]
});
