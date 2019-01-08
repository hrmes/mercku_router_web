const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin'); // Gzip
const webpack = require('webpack');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // Webpack包文件分析器
const customerConfig = require('./config/customer');

const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
const CUSTOMER_ID = `${process.env.CUSTOMER_ID}`;
console.log(`get CUSTOMER_ID in env：${CUSTOMER_ID}`);
const CUSTOMER_CONFIG = customerConfig(CUSTOMER_ID);
console.log(`get CUSTOMER_CONFIG for ${CUSTOMER_ID}:\n`, JSON.stringify(CUSTOMER_CONFIG, null, 2));
const title = CUSTOMER_CONFIG.TITLE.replace(/\"/g, '');
const favicon = CUSTOMER_CONFIG.FAVICO.replace(/\"/g, '');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  baseUrl: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: true,
  productionSourceMap: process.env.NODE_ENV !== 'production',
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.ejs',
      favicon,
      filename: 'index.html',
      title,
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    open: false,
    proxy: {
      '/app': {
        target: 'http://mywifi.mercku.tech',
        changeOrigin: true,
        secure: true
      },
      '/firmware_upload': {
        target: 'http://mywifi.mercku.tech',
        changeOrigin: true,
        secure: true
      },
      '/log.log': {
        target: 'http://mywifi.mercku.tech',
        changeOrigin: true,
        secure: true
      }
    }
  },
  configureWebpack: config => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"development"',
          CUSTOMER_CONFIG
        }
      })
    );
    const plugins = [
      new UglifyJsPlugin({
        uglifyOptions: {
          conpress: {
            warnings: false,
            drop_console: true,
            drop_debugger: true
          },
          sourceMap: false,
          parallel: true
        }
      }),
      new CompressionPlugin({
        // 文件开启Gzip，也可以通过服务端(如：nginx)(https://github.com/webpack-contrib/compression-web
        // pack-plugin)
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: productionGzipExtensions,
        threshold: 10240,
        minRatio: 0.8
      }),
      //	Webpack包文件分析器(https://github.com/webpack-contrib/webpack-bundle-analyzer)
      new BundleAnalyzerPlugin()
    ];
    if (process.env.NODE_ENV === 'production') {
      config.plugins.concat(plugins);
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
  }
};
