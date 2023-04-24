import loading from './component/loading/index';
// 自定义指令
const directives = {
  loading
};

export default {
  install(Vue) {
    Object.keys(directives).forEach(key => {
      Vue.directive(key, directives[key]);
    });
  }
};
