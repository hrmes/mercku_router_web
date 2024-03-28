import Vue from 'vue';
import Vuex from 'vuex';
import { RouterMode } from 'base/util/constant';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    mode: localStorage.getItem('mode') || RouterMode.router,
    role: localStorage.getItem('role'),
    isMobile: false,
    isConnected: '',
    theme: '',
    cancelTokenArr: [], // 取消请求token数组
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
