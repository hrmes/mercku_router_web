/**
 * 临时构建配置：规避 mini-css-extract-plugin "Callback was already called"
 * 构建失败（历史会话结论）。CSS 内联进 JS + 关闭 terser 缓存。
 * 用法：
 *   $env:VUE_CLI_SERVICE_CONFIG_PATH = "<path>/vue.config.nocache.js"
 *   node node_modules\@vue\cli-service\bin\vue-cli-service.js build --dest dist-unified
 */
const base = require('./vue.config.js');

module.exports = {
  ...base,
  css: {
    ...base.css,
    extract: false,
  },
  // 单进程构建：thread-loader 多 worker 会成倍占用系统 commit 配额，
  // 在 commit 紧张的机器上直接 OOM（FATAL ERROR: Zone Allocation failed）。
  parallel: false,
  chainWebpack: (config) => {
    base.chainWebpack(config);
    const noCache = (args) => [{ ...args[0], cache: false }];
    // 不同 webpack-chain 版本 terser 挂载位置不同（minimizers 或 plugins）；
    // 不存在时不能 .tap（会创建空 entry 导致 toConfig 崩溃）
    const minimizers = config.optimization && config.optimization.minimizers;
    if (minimizers && typeof minimizers.has === 'function' && minimizers.has('terser')) {
      config.optimization.minimizer('terser').tap(noCache);
    } else if (config.plugins.has('terser')) {
      config.plugin('terser').tap(noCache);
    }
  },
};
