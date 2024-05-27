import {
  RouterSnModel,
  M6aRouterSnModelVersion,
  M6sRouterSnModelVersion,
  Models
} from '../util/constant.js';

function getM6aProductsInfo() {
  let info;
  const modelID = localStorage.getItem('modelID');
  switch (modelID) {
    case M6aRouterSnModelVersion.M6a:
      info = process.env.CUSTOMER_CONFIG.routers.M6a;
      break;
    case M6aRouterSnModelVersion.M6a_Plus:
      info = process.env.CUSTOMER_CONFIG.routers.M6a_Plus;
      break;
    case M6aRouterSnModelVersion.M6c:
      info = process.env.CUSTOMER_CONFIG.routers.M6c;
      break;
    default:
      break;
  }
  return info;
}
function getM6sProductsInfo() {
  let info;
  switch (process.env.MODEL_CONFIG.id) {
    case Models.M6s_SFP:
      info = process.env.CUSTOMER_CONFIG.routers.M6s_SFP;
      break;
    default:
      info = process.env.CUSTOMER_CONFIG.routers.M6s;
      break;
  }
  return info;
}
export default {
  methods: {
    getNodeName(node) {
      const id = node.sn.slice(0, 2);
      const num = node.sn.slice(-4);
      const category = this.Products[id] || { shortName: 'Unknown' };
      return `${category.shortName}-${num}`;
    },
    getNodeImage(node) {
      const modelVersion = node.sn.slice(0, 2);
      const modelID = node.sn.charAt(9);
      let image = '';
      switch (modelVersion) {
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
          if (modelID === M6aRouterSnModelVersion.M6a) {
            image = require('../assets/images/model/img_m6a.png');
          } else if (modelID === M6aRouterSnModelVersion.M6a_Plus) {
            image = require('../assets/images/model/img_m6a_plus.png');
          } else if (modelID === M6aRouterSnModelVersion.M6c) {
            image = require('../assets/images/model/img_m6c.png');
          }
          break;
        case RouterSnModel.Homeway:
          image = require('../assets/images/model/img_homeway.png');
          break;
        case RouterSnModel.M6s:
          if (modelID === M6sRouterSnModelVersion.M6s) {
            image = require('../assets/images/model/img_m6s.svg');
          } else if (modelID === M6sRouterSnModelVersion.M6s_SFP) {
            image = require('../assets/images/model/img_m6s_sfp.svg');
          }
          break;
        case RouterSnModel.M6s_Nano:
          image = require('../assets/images/model/img_nano.svg');
          break;
        default:
          break;
      }
      return image;
    }
  },
  data() {
    return {
      Products: {
        [RouterSnModel.M2]: process.env.CUSTOMER_CONFIG.routers.M2,
        [RouterSnModel.Bee]: process.env.CUSTOMER_CONFIG.routers.Bee,
        [RouterSnModel.M6]: process.env.CUSTOMER_CONFIG.routers.M6,
        [RouterSnModel.Homeway]: process.env.CUSTOMER_CONFIG.routers.Homeway,
        [RouterSnModel.M6a]: getM6aProductsInfo(),
        [RouterSnModel.M6s]: getM6sProductsInfo(),
        [RouterSnModel.M6s_Nano]: process.env.CUSTOMER_CONFIG.routers.M6s_Nano
      }
    };
  }
};
