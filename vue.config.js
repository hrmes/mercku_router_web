const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const UUID = require('uuid');

// 这里给默认值的原因是vscode里面，eslint会自动从命令行启动进行检查
// 没有customer id报错，导致eslint不能加载webpack配置文件
// 最终导致eslint中的webpack import resolver失效
let CUSTOMER_ID = '';
if (process.env.CUSTOMER_ID) {
  CUSTOMER_ID = `${process.env.CUSTOMER_ID}`;
} else {
  CUSTOMER_ID = '0001';
}

let CUSTOMER_CONFIG = require(`./customer-conf/${CUSTOMER_ID}/conf.json`);
console.log(
  `get CUSTOMER_CONFIG for ${CUSTOMER_ID}:\n`,
  JSON.stringify(CUSTOMER_CONFIG, null, 2)
);
const title = CUSTOMER_CONFIG.title;
const favicon = CUSTOMER_CONFIG.favicon;

function resolve(dir) {
  return path.join(__dirname, dir);
}
const host = CUSTOMER_CONFIG.host || 'http://mywifi.mercku.tech';

module.exports = {
  baseUrl: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: true,
  productionSourceMap: process.env.NODE_ENV !== 'production',
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'index.ejs',
      favicon,
      filename: 'index.html',
      title,
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
      meta: {
        'x-web-version-hash': UUID.v1().replace(/-/g, '')
      }
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    open: false,
    proxy: {
      '/app': {
        target: host,
        changeOrigin: true,
        secure: true
      },
      '/firmware_upload': {
        target: host,
        changeOrigin: true,
        secure: true
      },
      '/log.log': {
        target: host,
        changeOrigin: true,
        secure: true
      },
      '/index.html': {
        target: host,
        changeOrigin: true,
        secure: true
      },
      '/index.js': {
        target: host,
        changeOrigin: true,
        secure: true
      },
      '/file_upload': {
        target: host,
        changeOrigin: true,
        secure: true
      }
    }
  },
  configureWebpack: config => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: process.env.NODE_ENV,
          CUSTOMER_CONFIG: (() => {
            const result = {};
            Object.keys(CUSTOMER_CONFIG).forEach(key => {
              result[key] = JSON.stringify(CUSTOMER_CONFIG[key]);
            });
            return result;
          })()
        }
      })
    );
    const plugins = [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          compress: {
            drop_console: true, // drop console
            drop_debugger: true
            // add some test comments
          }
        }
      })
      // new CompressionPlugin({
      //   // 文件开启Gzip，也可以通过服务端(如：nginx)(https://github.com/webpack-contrib/compression-web
      //   // pack-plugin)
      //   filename: '[path].gz[query]',
      //   algorithm: 'gzip',
      //   test: productionGzipExtensions,
      //   threshold: 10240,
      //   minRatio: 0.8
      // }),
      // //	Webpack包文件分析器(https://github.com/webpack-contrib/webpack-bundle-analyzer)
      // new BundleAnalyzerPlugin()
    ];
    if (process.env.NODE_ENV === 'production') {
      config.plugins = [...config.plugins, ...plugins];
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('vue$', 'vue/dist/vue.esm.js')
      .set('components', resolve('src/component'))
      .set('pages', resolve('src/pages'))
      .set('util', resolve('src/util'))
      .set('style', resolve('src/style'));
    config.module
      .rule('html')
      .test(/\.html$/)
      .use('html-loader')
      .loader('html-loader')
      .end();
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        options.limit = 50000;
        return options;
      });
  },
  css: {
    loaderOptions: {
      sass: {
        // @/ is an alias to src/
        data: `@import "@/style/${CUSTOMER_ID}/theme.scss";`
      }
    }
  }
};
