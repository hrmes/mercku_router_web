import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const lowerCaseModelId = process.env.MODEL_CONFIG.id.toLowerCase();

export default new Vuex.Store({
  state: {
    mode: localStorage.getItem('mode') || '',
    role: localStorage.getItem('role') || '',
    meshId: localStorage.getItem('meshId') || '',
    profile: {},
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
    }
  },
  actions: {
    loadProfile({ commit }) {
      return this.$http
        .getProfile()
        .then(res => {
          commit('setProfile', res.data.result);
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
