import axios from 'axios';

axios.defaults.timeout = 60000;
const defaultUrl = '/app';
export const createMethod = (action, url = defaultUrl) => ({
  url,
  action
});

class Http {
  constructor() {
    this.exHandler = error => {
      throw error;
    };
  }

  setExHandler(fn) {
    this.exHandler = fn;
  }

  request(config, params, axiosCfg = {}) {
    const data = { method: config.action };

    if (params) {
      data.params = params;
    }
    const options = {
      ...axiosCfg,
      url: config.url,
      method: 'post',
      data
    };
    return axios(options).catch(err => {
      this.exHandler(err, options);
    });
  }
}

// 获取主页
Http.prototype.getHomePage = function getHomePage() {
  return axios.get(`/index.html?t=${Date.now()}`);
};
// 系统日志
Http.prototype.getSysLog = function getSysLog() {
  return axios.get(`/log.log?t=${Date.now()}`);
};

// 上传镜像
Http.prototype.uploadFirmware = function uploadFirmware(params, callback) {
  const { CancelToken } = axios;
  const source = CancelToken.source();
  return axios({
    url: '/firmware_upload',
    method: 'post',
    data: params,
    cancelToken: source.token,
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: progressEvent => {
      callback(progressEvent, source);
    }
  });
};

// 上传文件
Http.prototype.uploadFile = function uploadFile(params, callback) {
  const { CancelToken } = axios;
  const source = CancelToken.source();
  return axios({
    url: '/file_upload',
    method: 'post',
    data: params,
    cancelToken: source.token,
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: progressEvent => {
      callback(progressEvent, source);
    }
  });
};

export default Http;
