import Http, { createMethod } from 'base/http';
import axios from 'axios';
import store from '../store/index'; // 引入vuex

const methods = {
  updateSuper: createMethod('mesh.config.super.update'),
  getNewMeshNodeInfo: createMethod('mesh.node.new.info'),
  getMeshWps: createMethod('mesh.wps.get'),
  updateMeshWps: createMethod('mesh.wps.update'),
  startMeshApclientScan: createMethod('mesh.apclient.scan'),
  getMeshApclientScanList: createMethod('mesh.apclient.get'),
  updateMeshApclient: createMethod('mesh.mode.update'),
  getMeshLogsSetting: createMethod('mesh.logs.setting.get'),
  updateMeshLogsSetting: createMethod('mesh.logs.setting.update'),
  updateMeshEnabled: createMethod('mesh_mode_cfg'),
  setMeshDeviceToGameMode: createMethod('mesh.device.game.set'),
  getMeshRepeaterStatus: createMethod('mesh.repeater.status.get')
};

class X1ProHttp extends Http {}

Object.keys(methods).forEach(methodName => {
  X1ProHttp.prototype[methodName] = function name(params, httpConf) {
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

export default X1ProHttp;
