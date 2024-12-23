import path from 'path';
import fs from 'fs';
import { defineConfig } from '@rsbuild/core';
import { pluginVue2 } from '@rsbuild/plugin-vue2';
import { pluginSass } from '@rsbuild/plugin-sass';

function mergeObjects(obj1, obj2) {
  const merged = {};

  for (let key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      if (typeof obj1[key] === 'object' && obj1[key] !== null && !Array.isArray(obj1[key])) {
        merged[key] = mergeObjects(obj1[key], {});
      } else {
        merged[key] = obj1[key];
      }
    }
  }

  for (let key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (typeof obj2[key] === 'object' && obj2[key] !== null && !Array.isArray(obj2[key])) {
        if (!merged.hasOwnProperty(key)) {
          merged[key] = mergeObjects({}, obj2[key]);
        } else {
          merged[key] = mergeObjects(merged[key], obj2[key]);
        }
      } else {
        merged[key] = obj2[key];
      }
    }
  }

  return merged;
}
let CUSTOMER_ID = '';
if (process.env.CUSTOMER_ID) {
  CUSTOMER_ID = `${process.env.CUSTOMER_ID}`;
} else {
  CUSTOMER_ID = '0001';
}

const DFT_CONFIG = require(`../base/customer-conf/dft.json`);
const OVER_CONFIG = require(`../base/customer-conf/${CUSTOMER_ID}/conf.json`);
const CUSTOMER_CONFIG = mergeObjects(DFT_CONFIG, OVER_CONFIG);
console.log("CUSTOMER_CONFIG is:" + JSON.stringify(CUSTOMER_CONFIG));
const { title, favicon } = CUSTOMER_CONFIG;

const host = CUSTOMER_CONFIG.host || 'http://mywifi.mercku.tech';
console.log("host is:" + host);
var customerAbsPath = null;
try {
  customerAbsPath = path.resolve(__dirname, `../base/src/style/customer/${CUSTOMER_ID}/theme.scss`)
    .replace(/\\/g, '/');
  if (!fs.existsSync(customerAbsPath)) {
    throw new Error('File not found');
  }
  console.log("customerAbsPath is:" + customerAbsPath);
} catch (e) {
  console.error(`No theme file found for customer ${CUSTOMER_ID}`);
  customerAbsPath = path.resolve(__dirname, `../base/src/style/customer/dft/theme.scss`)
    .replace(/\\/g, '/');
}

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
          verbose: false,
          includePaths: [
            path.resolve(__dirname, '../base/src/style'),
            path.resolve(__dirname, '../base/src/style/customer')
          ]
        },
        additionalData: `@import "${customerAbsPath}";`
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
