import { RouterSnModel, M6aSeriesModelIDs } from '../util/constant';

export default {
  methods: {
    getRouterImage(sn) {
      const id = sn.slice(0, 2);
      const modelID = sn.charAt(9);
      let image = '';
      switch (id) {
        case RouterSnModel.M2:
          image = require('../assets/images/model/img_m2.png');
          break;
        case RouterSnModel.Bee:
          image = require('../assets/images/model/img_bee.png');
          break;
        case RouterSnModel.M6:
          image = require('../assets/images/model/img_m6.png');
          break;
        case RouterSnModel.M6a:
          if (modelID === M6aSeriesModelIDs.M6a) {
            image = require('../assets/images/model/img_m6a.png');
          } else if (modelID === M6aSeriesModelIDs.M6a_Plus) {
            image = require('../assets/images/model/img_m6a_plus.png');
          } else if (modelID === M6aSeriesModelIDs.M6c) {
            image = require('../assets/images/model/img_m6c.png');
          }
          break;
        case RouterSnModel.Homeway:
          image = require('../assets/images/model/img_homeway.png');
          break;
        case RouterSnModel.M6s:
          image = require('../assets/images/model/img_m6s.svg');
          break;
        case RouterSnModel.M6s_Nano:
          image = require('../assets/images/model/img_nano.svg');
          break;
        case RouterSnModel['M6s_PoE++']:
          image = require('../assets/images/model/img_m6s_poe.svg');
          break;
        default:
          break;
      }
      return image;
    },
    productsInfo(id, modelID) {
      let productInfo;
      switch (id) {
        case RouterSnModel.M2:
          productInfo = process.env.CUSTOMER_CONFIG.routers.M2;
          break;
        case RouterSnModel.Bee:
          productInfo = process.env.CUSTOMER_CONFIG.routers.Bee;
          break;
        case RouterSnModel.M6:
          productInfo = process.env.CUSTOMER_CONFIG.routers.M6;
          break;
        case RouterSnModel.M6a:
          this.getM6aProductsInfo(modelID);
          break;
        case RouterSnModel.Homeway:
          productInfo = process.env.CUSTOMER_CONFIG.routers.Homeway;
          break;
        case RouterSnModel.M6s:
          productInfo = process.env.CUSTOMER_CONFIG.routers.M6s;
          break;
        case RouterSnModel.M6s_Nano:
          productInfo = process.env.CUSTOMER_CONFIG.routers.M6s_Nano;
          break;
        case RouterSnModel['M6s_PoE++']:
          productInfo = process.env.CUSTOMER_CONFIG.routers['M6s_PoE++'];
          break;
        default:
          break;
      }
      return productInfo;
    },
    getM6aProductsInfo(modelID) {
      let res;
      switch (modelID) {
        case M6aSeriesModelIDs.M6a:
          res = process.env.CUSTOMER_CONFIG.routers.M6a;
          break;
        case M6aSeriesModelIDs.M6a_Plus:
          res = process.env.CUSTOMER_CONFIG.routers.M6a_Plus;
          break;
        case M6aSeriesModelIDs.M6c:
          res = process.env.CUSTOMER_CONFIG.routers.M6c;
          break;
        default:
          break;
      }
      return res;
    }
  }
};
