import { RouterSnModel } from 'util/constant';

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
      let image = '';
      switch (id) {
        case RouterSnModel.M2:
          image = require('@/assets/images/img_m2.png');
          break;
        case RouterSnModel.Bee:
          image = require('@/assets/images/img_bee.png');
          break;
        case RouterSnModel.wifi6:
          image = require('@/assets/images/img_wifi6.png');
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
        [RouterSnModel.Bee]: process.env.CUSTOMER_CONFIG.routers.Bee
      }
    };
  }
};
