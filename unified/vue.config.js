/**
 * Unified app webpack / Vue CLI config.
 *
 * §1.1: Single web artifact. Build once, single dist. The build command MUST
 * NOT receive MODEL_ID or CUSTOMER_ID — all device installs are byte-identical
 * and only `runtime-config.v1.json` differs per device. There is therefore no
 * DefinePlugin for MODEL_ID / CUSTOMER_ID and no Sass entry selected by
 * customer id. Branding/policy come from runtime-loaded Customer Profiles.
 *
 * §1.2: `unified/` has NO package.json. vue-cli-service 3.x loads its
 * plugins (@vue/cli-plugin-babel etc.) from the package.json in its context
 * directory, so the build MUST run from the repo root (which has package.json)
 * with `VUE_CLI_SERVICE_CONFIG_PATH=unified/vue.config.js`. Dependencies are
 * installed once at the repo root via `npm ci`.
 *
 * Because the context is the repo root, context-relative paths below (entry,
 * template, outputDir) are prefixed with `unified/`. Alias `resolve()` calls
 * use `__dirname` (this file's dir = unified/) so they are context-independent.
 *
 * Aliases:
 *   @    → unified/src        (the new bypass source tree)
 *   base → ../base/src        (READ-ONLY reuse of the existing source tree)
 *
 * Output goes to repo-root `dist-unified/` so the six legacy builds and the
 * unified build never clobber each other.
 *
 * The dev server registers `dev/runtime-config-middleware.js` so the bootstrap
 * flow can fetch `/runtime-config.v1.json` from a selected fixture. The
 * production bundle contains NO fixture selection logic.
 *
 * Task 3 ships only the skeleton — there is no `src/main.js` yet (Task 7
 * adds it). `npm run build:unified` is therefore expected to fail until
 * Task 7 lands; the config itself is valid and `npm run dev:unified` will
 * boot the dev server once `src/main.js` exists.
 */
const path = require('path');
const serveIdentityFixture = require('./dev/runtime-config-middleware.js');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: '/',
  outputDir: 'dist-unified',
  assetsDir: 'static',
  lintOnSave: true,
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
    port: 8080,
    open: false,
    before(app) {
      // Dev-only: serve the selected identity fixture as the runtime config.
      // Production bundle has no fixture selection logic.
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
    // .ico is not in the vue-cli default image rule (png/jpg/gif/webp/svg).
    // Customer Profile index.js imports favicon.ico as a module so webpack
    // needs a loader. url-loader inlines small favicons as base64 data URLs;
    // anything larger falls through to file-loader via genAssetSubPath.
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
      // Legacy SCSS relies on `@mixin light-theme` / `@mixin dark-theme`
      // defined in base/style/customer/<id>/theme.scss. Legacy builds
      // injected this via sass-loader `data` per-customer at build time.
      // The unified build ships ONE dist for every customer, so we inject
      // the Mercku (0001) theme as the compile-time baseline. Customer
      // Profile branding.theme overrides `--brand-primary` / `--brand-loading`
      // at runtime via apply-branding.js; other CSS variables still come
      // from this baseline.
      // TODO(Task 9): replace per-customer theme.scss with a runtime theme
      // switcher or expand Customer Profile branding.theme whitelist so
      // no compile-time customer id is referenced.
      sass: {
        data: `@import "~base/style/customer/0001/theme.scss";`,
      },
    },
  },
};
