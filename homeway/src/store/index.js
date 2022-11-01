import Vue from 'vue';
import Store from 'base/store';

const store = new Store(Vue, {
  mode: localStorage.getItem('mode'),
  role: localStorage.getItem('role'),
  modelVersion: localStorage.getItem('modelVersion')
});

export default store;
