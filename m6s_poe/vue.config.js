const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const UUID = require('uuid');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//   .BundleAnalyzerPlugin;

// 这里给默认值的原因是vscode里面，eslint会自动从命令行启动进行检查
// 没有customer id报错，导致eslint不能加载webpack配置文件
// 最终导致eslint中的webpack import resolver失效
let CUSTOMER_ID = '';
if (process.env.CUSTOMER_ID) {
  CUSTOMER_ID = `${process.env.CUSTOMER_ID}`;
} else {
  CUSTOMER_ID = '0001';
}

const CUSTOMER_CONFIG = require(`../base/customer-conf/${CUSTOMER_ID}/conf.json`);
console.log(process.env.MODEL);
console.log(
  `get CUSTOMER_CONFIG for ${CUSTOMER_ID}:\n`,
  JSON.stringify(CUSTOMER_CONFIG, null, 2)
);
const { title } = CUSTOMER_CONFIG;
const { favicon } = CUSTOMER_CONFIG;

function resolve(dir) {
  return path.join(__dirname, dir);
}
const host = CUSTOMER_CONFIG.host || 'http://mywifi.mercku.tech';

module.exports = {
  publicPath: '/',
  // baseUrl: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: true,
  productionSourceMap: process.env.NODE_ENV !== 'production',
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'index.ejs',
      favicon: `../base/${favicon}`,
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
      '/kernel.log': {
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
      },
      '/configs.dat': {
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
          MODEL_CONFIG: {
            id: JSON.stringify(process.env.MODEL_ID)
          },
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
      new CleanWebpackPlugin(),
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          compress: {
            // drop_console: false, // 打包时删除console，默认false。此处不需要配置，如果配置了，则会清空所有console
            // drop_debugger: true, // 打包时删除 debugger，默认true。
            pure_funcs: ['console.log', 'console.warn'] // 删除console
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
      //	Webpack包文件分析器(https://github.com/webpack-contrib/webpack-bundle-analyzer)
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
      .set('style', resolve('src/style'))
      .set('base', resolve('../base/src'));
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
        data: `@import "base/style/customer/${CUSTOMER_ID}/theme.scss";`
      }
    }
  }
};
