import path from 'path';
import { defineConfig } from '@rsbuild/core';
import { pluginVue2 } from '@rsbuild/plugin-vue2';
import { pluginSass } from '@rsbuild/plugin-sass';

let CUSTOMER_ID = '';
if (process.env.CUSTOMER_ID) {
  CUSTOMER_ID = `${process.env.CUSTOMER_ID}`;
} else {
  CUSTOMER_ID = '0001';
}

const CUSTOMER_CONFIG = require(`../base/customer-conf/${CUSTOMER_ID}/conf.js`);
const { title, favicon } = CUSTOMER_CONFIG;

console.log(CUSTOMER_CONFIG.images)

const host = CUSTOMER_CONFIG.host || 'http://mywifi.mercku.tech';
console.log("host is:" + host);
const customerAbsPath = path.resolve(
  __dirname,
  `../base/src/style/customer/${CUSTOMER_ID}/theme.scss`
);

export default defineConfig({
  server: {
    open: false,
    port: 8080,
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
      },
      '/configs.dat': {
        target: host,
        changeOrigin: true,
        secure: true
      }
    }
  },
  plugins: [
    pluginSass({
      sassLoaderOptions: {
        api: 'legacy',
        warnRuleAsWarning: false,
        sassOptions: {
          quietDeps: true,
          verbose: false
        },
        additionalData: content =>
          `@import "${customerAbsPath}";
${content}`
      }
    }),
    pluginVue2({
      vueLoaderOptions: {
        hotReload: true
      }
    })
  ],
  tools: {
    cssLoader: {
      esModule: false,
      import: true,
      importLoaders: 2
    },
    bundlerChain: chain => {
      chain.module
        .rule('raw-html')
        .test(/policy-en.html/)
        .type('asset/source');
    }
  },
  output: {
    // injectStyles: true
  },
  source: {
    entry: {
      index: './src/main.js'
    },
    define: {
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
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
    },
    alias: {
      '@': './src/',
      vue$: 'vue/dist/vue.esm.js',
      components: './src/component',
      pages: './src/pages',
      style: './src/style',
      base: '../base/src',
      '@base': path.resolve(__dirname, '../base/src')
    }
  },

  html: {
    title,
    favicon: path.resolve(__dirname, '../base', favicon),
    template: './index.ejs'
  }
});
