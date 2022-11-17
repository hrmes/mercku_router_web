import Vue from 'vue';
import Store from 'base/store';

const store = new Store(Vue, {
  mode: localStorage.getItem('mode'),
  role: localStorage.getItem('role')
});

export default store;
