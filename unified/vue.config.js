/**
 * Unified uses the root package/lockfile, writes to dist-unified, and never
 * receives MODEL_ID or CUSTOMER_ID at build time.
 */
const path = require('path');
const serveIdentityFixture = require('./dev/runtime-config-middleware.js');
const serveOfflineApi = require('./dev/offline-api-middleware.js');

function resolve(dir) {
  const resolved = path.join(__dirname, dir);
  // Windows: 统一盘符大小写。vue-cli 传入的 __dirname 盘符为小写 'f:'，而
  // 入口相对路径按 cwd 解析为大写 'F:'，webpack 会把同一文件当成两个模块
  // （"multiple modules with names that only differ in casing"），导致 intl、
  // vue、lodash 等整包双份：bundle 翻倍，且 intl polyfill 双实例 locale 数据
  // 互不相通，NumberFormat 抛 "No locale data"（真机 dashboard 空白事故）。
  return resolved.replace(/^([a-z]):/, (m, drive) => `${drive.toUpperCase()}:`);
}

function createBackendProxy(target) {
  if (!target) return undefined;
  const proxy = {};
  [
    '/app',
    '/firmware_upload',
    '/file_upload',
    '/log.log',
    '/kernel.log',
    '/configs.dat',
  ].forEach((route) => {
    proxy[route] = {
      target,
      changeOrigin: true,
      secure: false,
    };
  });
  return proxy;
}

const backendProxy = createBackendProxy(process.env.MERCKU_BACKEND_TARGET);

module.exports = {
  publicPath: '/',
  outputDir: 'dist-unified',
  assetsDir: 'static',
  // Reused Base pages have a legacy lint backlog; lint remains an explicit job.
  lintOnSave: false,
  productionSourceMap: process.env.NODE_ENV !== 'production',
  pages: {
    index: {
      entry: 'unified/src/main.js',
      template: 'unified/index.ejs',
      filename: 'index.html',
      title: 'Router',
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
  },
  devServer: {
    host: '0.0.0.0',
    port: Number(process.env.UNIFIED_DEV_PORT || 8080),
    open: false,
    ...(backendProxy ? { proxy: backendProxy } : {}),
    before(app) {
      app.use(serveOfflineApi);
      app.use(serveIdentityFixture);
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('vue$', 'vue/dist/vue.esm.js')
      .set('@', resolve('src'))
      .set('base', resolve('../base/src'));
    config.module
      .rule('html')
      .test(/\.html$/)
      .use('html-loader')
      .loader('html-loader')
      .end();
    config.module
      .rule('ico')
      .test(/\.ico$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 100000,
        name: 'static/img/[name].[hash:8].[ext]',
      });
  },
  css: {
    loaderOptions: {
      sass: {
        data: `@import "~@/assets/branding/default/theme-baseline.scss";`,
      },
    },
  },
};
