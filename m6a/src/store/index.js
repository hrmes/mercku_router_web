import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    mode: '' || localStorage.getItem('mode'),
    role: '' || localStorage.getItem('role'),
    modelVersion: '' || localStorage.getItem('modelVersion'),
    isMobile: true,
    hasTransition: true,
    isConnected: '',
    theme: localStorage.getItem('theme') || 'light',
    cancelTokenArr: [], // 取消请求token数组
    deviceColor: localStorage.getItem('deviceColor') || 'black',
    modules: {
      limits: {},
      portfw: {},
      rsvdip: {},
      vpn: {}
    }
  },
  mutations: {
    pushToken(state, payload) {
      state.cancelTokenArr.push(payload.cancelToken);
    },
    clearToken({ cancelTokenArr }) {
      cancelTokenArr.forEach(item => {
        item('路由跳转取消请求');
      });
      cancelTokenArr = [];
    }
  }
});
