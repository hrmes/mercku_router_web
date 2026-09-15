/**
 * Root-level vue.config.js used by `vue-cli-service test:unit` (which runs
 * from the repo root, not from `unified/` or any legacy build dir).
 *
 * The legacy per-model builds (m6, m6s, …) each carry their own
 * `vue.config.js` and are invoked via `cd <model> && vue-cli-service build`;
 * they do NOT pick up this file. `npm run build` at the repo root is a
 * legacy no-op (no `src/main.js`) and is not used — `build:unified` is the
 * real build command and uses `unified/vue.config.js`.
 *
 * This file teaches the test webpack config how to:
 *   - resolve the `base` alias (mirrors `unified/vue.config.js`) so unified
 *     source files that import `base/util/constant` etc. can be required
 *     from tests; and
 *   - load `.ico` asset files (Customer Profile `index.js` imports
 *     `favicon.ico`). The default vue-cli image rule covers
 *     png/jpg/gif/webp/svg but not ico.
 */
const path = require('path');

module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias.set('base', path.resolve(__dirname, 'base/src'));
    // Mirror unified/vue.config.js so test webpack can resolve the same
    // `@` -> unified/src alias that the unified build uses.
    config.resolve.alias.set('@', path.resolve(__dirname, 'unified/src'));
    config.module
      .rule('ico')
      .test(/\.ico$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 100000,
        name: 'static/img/[name].[hash:8].[ext]',
      });
    config.module
      .rule('html')
      .test(/\.html$/)
      .use('html-loader')
      .loader('html-loader');
  },
  css: {
    loaderOptions: {
      // Mirror unified/vue.config.js: legacy SCSS files imported by unified
      // pages rely on `@mixin light-theme` / `@mixin dark-theme` defined in
      // base/style/customer/0001/theme.scss. Inject it at the top of every
      // SCSS file so mocha-webpack can compile .vue style blocks.
      sass: {
        // 关闭 webpackImporter：sass-loader 7.3.1 的 webpackImporter 与本机
        // dart-sass 1.32 不兼容 —— dart-sass 会把绝对路径 canonicalize 成
        // `file:///F:/...` 再交给 importer，webpack importer 解析不了该 URL，
        // 回退值同样加载失败，报 "Can't find stylesheet to import"，导致所有
        // 含 .vue 样式块的单测编译失败。仓库内（src/**/*.vue、**/*.scss）没有任何
        // `~pkg` 形式的导入，关闭后由 dart-sass 原生解析。
        webpackImporter: false,
        // 不在 @import 里写绝对路径：dart-sass 1.32 会把 `F:/...` 的盘符
        // 当成 URL scheme 处理，无论走 webpack importer 还是自身解析都报
        // "Can't find stylesheet to import"。改为把 theme.scss 所在目录放进
        // includePaths（dart-sass 原生解析，纯文件系统路径），再按文件名导入。
        includePaths: [path.resolve(__dirname, 'base/src/style/customer/0001')],
        data: `@import "theme.scss";`,
      },
    },
  },
};
