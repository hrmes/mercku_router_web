import Vue from 'vue';
import Vuex from 'vuex';
import Http from '../http';

Vue.use(Vuex);
const lowerCaseModelId = process.env.MODEL_CONFIG.id.toLowerCase();

const http = new Http();

export default new Vuex.Store({
  state: {
    profile: {},
    profileLoaded: false,
    mode: '' || localStorage.getItem('mode'),
    role: '' || localStorage.getItem('role'),
    modelVersion: '' || localStorage.getItem('modelVersion'),
    isMobile: true,
    hasTransition: true,
    isConnected: '',
    theme: localStorage.getItem('theme') || 'light',
    cancelTokenArr: [], // 取消请求token数组
    deviceColor:
      localStorage.getItem(`${lowerCaseModelId}_deviceColor`) || 'black',
    modules: {
      limits: {},
      portfw: {},
      rsvdip: {},
      vpn: {}
    },
    logined: false,
    settings: {}
  },
  actions: {
    loadProfile({ commit }) {
      return http
        .getSessionProfile()
        .then(res => {
          console.log('get session profile success', res);
          commit('setProfile', res);
        })
        .catch(err => {
          console.error('get profile error', err);
        });
    }
  },
  mutations: {
    setProfile(state, profile) {
      console.log("setProfile: ", profile);
      state.profile = profile;
      state.profileLoaded = true;
    },
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
