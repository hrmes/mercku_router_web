import Vue from 'vue';
import Router from 'vue-router';
import welcome from '../pages/welcome/index.vue';
import login from '../pages/login/index.vue';
import wlan from '../pages/wlan/index.vue';
import checkNetwork from '../pages/check-network/index.vue';
import wanSuccess from '../pages/wan-success/index.vue';

Vue.use(Router);
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/welcome'
    },
    {
      path: '/welcome',
      component: welcome
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/wlan',
      component: wlan
    },
    {
      path: '/check-network',
      component: checkNetwork
    },
    {
      path: '/wan-success',
      component: wanSuccess
    }
  ]
});
