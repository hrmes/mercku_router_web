import Vue from 'vue';
import Router from 'vue-router';
import login from '../pages/login/index.vue';
import bussiness from '../pages/bussiness/index.vue';

Vue.use(Router);


const routes = [{
  path: '/',
  redirect: '/login'
}, {
  path: '/login',
  name: 'login',
  component: login
}, {
  path: '/bussiness',
  name: 'bussiness',
  component: bussiness,
  children: []
}];

export default new Router({
  routes
});
