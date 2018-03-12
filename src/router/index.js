import Vue from 'vue';
import Router from 'vue-router';
import welcome from '../pages/welcome/index.vue';
import login from '../pages/login/index.vue';

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
    }
  ]
});
