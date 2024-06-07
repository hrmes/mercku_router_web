// import upgradeM2 from 'base/assets/images/model/upgrade/img_m2.png';
// import upgradeBee from 'base/assets/images/model/upgrade/img_bee.png';
// import upgradeWwax from 'base/assets/images/model/upgrade/img_homeway.png';

// Upgrade router model imgs
import upgradeM6 from 'base/assets/images/model/upgrade/img_m6.png';
import upgradeM6a from 'base/assets/images/model/upgrade/img_m6a.png';
import upgradeM6aPlus from 'base/assets/images/model/upgrade/img_m6a-plus.png';
import upgradeM6c from 'base/assets/images/model/upgrade/img_m6c.png';
import upgradeM6s from 'base/assets/images/model/upgrade/img_m6s.svg';
import upgradeM6sSFP from 'base/assets/images/model/upgrade/img_m6s-sfp.svg';
import upgradeM6sNano from 'base/assets/images/model/upgrade/img_nano.svg';
//  Mesh router model line icon
import meshM6 from 'base/assets/images/model/mesh/ic_m6.svg';
import meshM6a from 'base/assets/images/model/mesh/ic_m6a.png';
import meshM6aPlus from 'base/assets/images/model/mesh/ic_m6a-plus.png';
import meshM6c from 'base/assets/images/model/mesh/ic_m6c.png';
import meshM6s from 'base/assets/images/model/mesh/ic_m6s.svg';
import meshM6sSFP from 'base/assets/images/model/mesh/ic_m6s-sfp.svg';
import meshM6sNano from 'base/assets/images/model/mesh/ic_nano.svg';
import meshUnknowRouter from 'base/assets/images/model/mesh/ic_unknow.svg';

import {
  RouterSnAB2Model,
  RouterHasModelDistinctionMap,
  Models
} from 'base/util/constant.js';

const RouterModelImgMap = {
  upgrade: {
    [RouterSnAB2Model.M6]: upgradeM6,
    [RouterSnAB2Model.M6a]: {
      [RouterHasModelDistinctionMap.M6a]: upgradeM6a,
      [RouterHasModelDistinctionMap.M6a_Plus]: upgradeM6aPlus,
      [RouterHasModelDistinctionMap.M6c]: upgradeM6c
    },
    [RouterSnAB2Model.M6s]: {
      [RouterHasModelDistinctionMap.M6s]: upgradeM6s,
      [RouterHasModelDistinctionMap.M6s_SFP]: upgradeM6sSFP
    },
    [RouterSnAB2Model.M6s_Nano]: upgradeM6sNano,
    default: upgradeM6
  },
  mesh: {
    [RouterSnAB2Model.M6]: meshM6,
    [RouterSnAB2Model.M6a]: {
      [RouterHasModelDistinctionMap.M6a]: meshM6a,
      [RouterHasModelDistinctionMap.M6a_Plus]: meshM6aPlus,
      [RouterHasModelDistinctionMap.M6c]: meshM6c
    },
    [RouterSnAB2Model.M6s]: {
      [RouterHasModelDistinctionMap.M6s]: meshM6s,
      [RouterHasModelDistinctionMap.M6s_SFP]: meshM6sSFP
    },
    [RouterSnAB2Model.M6s_Nano]: meshM6sNano,
    default: meshUnknowRouter
  }
};
const PageName = {
  upgrade: 'upgrade',
  mesh: 'mesh'
};

function getM6aProductsInfo() {
  let info;
  const modelVersion = localStorage.getItem('modelID');
  switch (modelVersion) {
    case RouterHasModelDistinctionMap.M6a:
      info = process.env.CUSTOMER_CONFIG.routers.M6a;
      break;
    case RouterHasModelDistinctionMap.M6a_Plus:
      info = process.env.CUSTOMER_CONFIG.routers.M6a_Plus;
      break;
    case RouterHasModelDistinctionMap.M6c:
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
export const getNodeImage = {
  methods: {
    getNodeImage(node, page = PageName.upgrade) {
      const modelID = node.sn.slice(0, 2);
      const modelVersion = node.sn.charAt(9);
      if (
        RouterModelImgMap[page]?.[modelID] &&
        typeof RouterModelImgMap[page]?.[modelID] === 'string'
      ) {
        return RouterModelImgMap[page][modelID];
      }
      if (
        RouterModelImgMap[page]?.[modelID]?.[modelVersion] &&
        typeof RouterModelImgMap[page]?.[modelID]?.[modelVersion] === 'string'
      ) {
        return RouterModelImgMap[page][modelID][modelVersion];
      }

      return RouterModelImgMap[page].default;
    }
  }
};
export const Products = {
  data() {
    return {
      Products: {
        [RouterSnAB2Model.M6a]: getM6aProductsInfo(),
        [RouterSnAB2Model.M6s]: getM6sProductsInfo(),
        [RouterSnAB2Model.M6s_Nano]:
          process.env.CUSTOMER_CONFIG.routers.M6s_Nano
      }
    };
  }
  // methods: {
  //   getNodeName(node) {
  //     const id = node.sn.slice(0, 2);
  //     const num = node.sn.slice(-4);
  //     const category = this.Products[id] || { shortName: 'Unknown' };
  //     return `${category.shortName}-${num}`;
  //   }
  // },
};
