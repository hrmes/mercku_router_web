import Http, { createMethod } from 'base/http';
import axios from 'axios';
import store from '../store/index'; // 引入vuex

const methods = {
  updateSuper: createMethod('mesh.config.super.update'),
  getMeshAutoUpgrade: createMethod('mesh.auto_upgrade.get'),
  setMeshAutoUpgrade: createMethod('mesh.auto_upgrade.set'),
  getNewMeshNodeInfo: createMethod('mesh.node.new.info'),
  getRouterFrozenConfig: createMethod('router.config.frozen.get'),
  updateRouterFrozenConfig: createMethod('router.config.frozen.update')
};

class M6aHttp extends Http {}

Object.keys(methods).forEach(methodName => {
  M6aHttp.prototype[methodName] = function name(params, httpConf) {
    return this.request(methods[methodName], params, httpConf);
  };
});

// CancelToken存放了当前页面的所有请求，如果进行了路由跳转，则取消上一个页面的所有请求;
// 防止下一个页面的请求被上一个页面pending请求阻塞
axios.interceptors.request.use(config => {
  config.cancelToken = new axios.CancelToken(cancel => {
    store.commit('pushToken', { cancelToken: cancel });
  });
  return config;
});

axios.interceptors.response.use(
  response => response,
  error => {
    // 取消请求的情况下，终止Pormise调用链
    if (axios.isCancel(error)) {
      return new Promise(() => {});
    }
    return Promise.reject(error);
  }
);

export default M6aHttp;
