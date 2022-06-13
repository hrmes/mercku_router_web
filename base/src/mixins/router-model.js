import { RouterSnModel } from '../util/constant';

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
          // 获取到的sn前两位为‘08’，代表是m6a芯片，但是要判断model_version位，用以区分m6a和homeway
          // （model_version位 0=m6a 1=homeway_230v 2=homeway_PoE单脚 3=homeway_PoE双脚）
          if (modelVersion === '0') {
            image = require('../assets/images/img_wifi6.png');
            break;
          } else {
            image = require('../assets/images/img_homeway.png');
            break;
          }
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
        [RouterSnModel.M6a]: process.env.CUSTOMER_CONFIG.routers.M6a,
        [RouterSnModel.Homeway_PoE]:
          process.env.CUSTOMER_CONFIG.routers.Homeway_PoE,
        [RouterSnModel.Homeway_230v]:
          process.env.CUSTOMER_CONFIG.routers.Homeway_230v
      }
    };
  }
};
