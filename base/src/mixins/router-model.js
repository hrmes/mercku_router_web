import { RouterSnModel, M6aRouterSnModelVersion } from '../util/constant';

export default {
  methods: {
    getNodeName(node) {
      const id = node.sn.slice(0, 2);
      const num = node.sn.slice(-4);
      const category = this.Products[id] || { shortName: 'Unknown' };
      return `${category.shortName}-${num}`;
    },
    getNodeImage(node) {
      const id = node.sn.slice(0, 2);
      const modelID = localStorage.getItem('modelID');
      let image = '';
      switch (id) {
        case RouterSnModel.M2:
          image = require('../assets/images/img_m2.png');
          break;
        case RouterSnModel.Bee:
          image = require('../assets/images/img_bee.png');
          break;
        case RouterSnModel.M6:
          image = require('../assets/images/img_wifi6.png');
          break;
        case RouterSnModel.M6c:
          image = require('../assets/images/img_wifi6.png');
          break;
        case RouterSnModel.M6a:
          if (modelID === M6aRouterSnModelVersion.M6a) {
            image = require('../assets/images/img_m6a.png');
          } else if (modelID === M6aRouterSnModelVersion.M6a_Plus) {
            image = require('../assets/images/img-m6a_plus.png');
          } else if (modelID === M6aRouterSnModelVersion.M6c) {
            image = require('../assets/images/img-m6c.png');
          }
          break;
        case RouterSnModel.Homeway:
          image = require('../assets/images/img_homeway.png');
          break;
        default:
          break;
      }
      return image;
    }
  },
  data() {
    function getM6aProductsInfo() {
      let res;
      const modelID = localStorage.getItem('modelID');
      switch (modelID) {
        case M6aRouterSnModelVersion.M6a:
          res = process.env.CUSTOMER_CONFIG.routers.M6a;
          break;
        case M6aRouterSnModelVersion.M6a_Plus:
          res = process.env.CUSTOMER_CONFIG.routers.M6a_Plus;
          break;
        case M6aRouterSnModelVersion.M6c:
          res = process.env.CUSTOMER_CONFIG.routers.M6c;
          break;
        default:
          break;
      }
      return res;
    }
    return {
      Products: {
        [RouterSnModel.M2]: process.env.CUSTOMER_CONFIG.routers.M2,
        [RouterSnModel.Bee]: process.env.CUSTOMER_CONFIG.routers.Bee,
        [RouterSnModel.M6]: process.env.CUSTOMER_CONFIG.routers.M6,
        [RouterSnModel.M6c]: process.env.CUSTOMER_CONFIG.routers.M6c,
        [RouterSnModel.Homeway]: process.env.CUSTOMER_CONFIG.routers.Homeway,
        [RouterSnModel.M6a]: getM6aProductsInfo()
      }
    };
  }
};
