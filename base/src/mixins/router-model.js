import { RouterSnModel, M6aRouterSnModelVsersion } from '../util/constant';

export default {
  methods: {
    getNodeName(node) {
      const id = node.sn.slice(0, 2);
      // const modelVersion = node.sn.slice(9, 10);
      const num = node.sn.slice(-4);
      const category = this.Products[id] || { shortName: 'Unknown' };
      return `${category.shortName}-${num}`;
    },
    getNodeImage(node) {
      const id = node.sn.slice(0, 2);
      const modelVersion = node.sn.slice(9, 10);
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
          if (modelVersion === M6aRouterSnModelVsersion.M6a) {
            image = require('../assets/images/img_m6a.png');
          } else if (modelVersion === M6aRouterSnModelVsersion.M6a_Plus) {
            image = require('../assets/images/model/m6a_plus/img-m6a_plus.png');
          }
          break;
        case RouterSnModel.homeway:
          image = require('../assets/images/img_homeway.png');
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
        [RouterSnModel.M6c]: process.env.CUSTOMER_CONFIG.routers.M6c,
        [RouterSnModel.homeway]: process.env.CUSTOMER_CONFIG.routers.homeway,
        [RouterSnModel.M6a]:
          this.$store.modelVersion === M6aRouterSnModelVsersion.M6a
            ? process.env.CUSTOMER_CONFIG.routers.M6a
            : process.env.CUSTOMER_CONFIG.routers.M6a_plus
      }
    };
  }
};
