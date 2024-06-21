/**
 *
 *
 * 绘制拓扑图部分
 *
 *
 *
 */
// unkonwn router
import picDefaultGateway from 'base/assets/images/topo/ic_router_gw.png';
import picDefaultGood from 'base/assets/images/topo/ic_router_normal.png';
import picDefaultBad from 'base/assets/images/topo/ic_router_bad.png';
import picDefaultOffline from 'base/assets/images/topo/ic_router_offline.png';
// M6
import picM6Gateway from 'base/assets/images/topo/ic_m6_gw.png';
import picM6Good from 'base/assets/images/topo/ic_m6_normal.png';
import picM6Bad from 'base/assets/images/topo/ic_m6_bad.png';
import picM6Offline from 'base/assets/images/topo/ic_m6_offline.png';
// M6a
import picM6aGateway from 'base/assets/images/topo/ic_m6a_gw.png';
import picM6aGood from 'base/assets/images/topo/ic_m6a_normal.png';
import picM6aBad from 'base/assets/images/topo/ic_m6a_bad.png';
import picM6aOffline from 'base/assets/images/topo/ic_m6a_offline.png';
import picM6aPlusGateway from 'base/assets/images/topo/ic_m6a_plus_gw.png';
import picM6aPlusGood from 'base/assets/images/topo/ic_m6a_plus_normal.png';
import picM6aPlusBad from 'base/assets/images/topo/ic_m6a_plus_bad.png';
import picM6aPlusOffline from 'base/assets/images/topo/ic_m6a_plus_offline.png';
import picM6cGateway from 'base/assets/images/topo/ic_m6c_gw.png';
import picM6cGood from 'base/assets/images/topo/ic_m6c_normal.png';
import picM6cBad from 'base/assets/images/topo/ic_m6c_bad.png';
import picM6cOffline from 'base/assets/images/topo/ic_m6c_offline.png';
// M6s
import picM6sGateway from 'base/assets/images/topo/ic_m6s_gw_green.png';
import picM6sGood from 'base/assets/images/topo/ic_m6s_normal.png';
import picM6sBad from 'base/assets/images/topo/ic_m6s_bad.png';
import picM6sOffline from 'base/assets/images/topo/ic_m6s_offline.png';
import picM6sSFPGateway from 'base/assets/images/topo/ic_m6s_sfp_gw_green.png';
import picM6sSFPGood from 'base/assets/images/topo/ic_m6s_sfp_normal.png';
import picM6sSFPBad from 'base/assets/images/topo/ic_m6s_sfp_bad.png';
import picM6sSFPOffline from 'base/assets/images/topo/ic_m6s_sfp_offline.png';
// M6s Nano
import picNanoGateway from 'base/assets/images/topo/ic_nano_gw_green.png';
import picNanoGood from 'base/assets/images/topo/ic_nano_normal.png';
import picNanoBad from 'base/assets/images/topo/ic_nano_bad.png';
import picNanoOffline from 'base/assets/images/topo/ic_nano_offline.png';
// M6s PoE
import picM6sPOEGateway from 'base/assets/images/topo/ic_m6s_poe_gw_green.png';
import picM6sPOEGood from 'base/assets/images/topo/ic_m6s_poe_normal.png';
import picM6sPOEBad from 'base/assets/images/topo/ic_m6s_poe_bad.png';
import picM6sPOEOffline from 'base/assets/images/topo/ic_m6s_poe_offline.png';

import {
  Color,
  Bands,
  RouterSnAB2Model,
  RouterStatus,
  RouterHasModelDistinctionMap
} from 'base/util/constant';

// 大于-70均认为优秀
const isGood = rssi => rssi >= -65;

const picModelColorMap = {
  [RouterSnAB2Model.M6]: {
    gw: picM6Gateway,
    [Color.good]: picM6Good,
    [Color.bad]: picM6Bad,
    [Color.offline]: picM6Offline
  },
  [RouterSnAB2Model.M6a]: {
    [RouterHasModelDistinctionMap.M6a]: {
      gw: picM6aGateway,
      [Color.good]: picM6aGood,
      [Color.bad]: picM6aBad,
      [Color.offline]: picM6aOffline
    },
    [RouterHasModelDistinctionMap.M6a_Plus]: {
      gw: picM6aPlusGateway,
      [Color.good]: picM6aPlusGood,
      [Color.bad]: picM6aPlusBad,
      [Color.offline]: picM6aPlusOffline
    },
    [RouterHasModelDistinctionMap.M6c]: {
      gw: picM6cGateway,
      [Color.good]: picM6cGood,
      [Color.bad]: picM6cBad,
      [Color.offline]: picM6cOffline
    }
  },
  [RouterSnAB2Model.M6s]: {
    [RouterHasModelDistinctionMap.M6s]: {
      gw: picM6sGateway,
      [Color.good]: picM6sGood,
      [Color.bad]: picM6sBad,
      [Color.offline]: picM6sOffline
    },
    [RouterHasModelDistinctionMap.M6s_SFP]: {
      gw: picM6sSFPGateway,
      [Color.good]: picM6sSFPGood,
      [Color.bad]: picM6sSFPBad,
      [Color.offline]: picM6sSFPOffline
    }
  },
  [RouterSnAB2Model.M6s_Nano]: {
    gw: picNanoGateway,
    [Color.good]: picNanoGood,
    [Color.bad]: picNanoBad,
    [Color.offline]: picNanoOffline
  },
  [RouterSnAB2Model.M6s_PoE_pp]: {
    gw: picM6sPOEGateway,
    [Color.good]: picM6sPOEGood,
    [Color.bad]: picM6sPOEBad,
    [Color.offline]: picM6sPOEOffline
  },
  default: {
    gw: picDefaultGateway,
    [Color.good]: picDefaultGood,
    [Color.bad]: picDefaultBad,
    [Color.offline]: picDefaultOffline
  }
};

function filterValidNeighbors(neighbors) {
  const isValidNeighbor = n => {
    if (!Object.prototype.hasOwnProperty.call(n, 'sn')) {
      console.error(`neighbors: ${n.sn} sn缺失`);
      return false;
    }
    if (!Object.prototype.hasOwnProperty.call(n, 'rssi')) {
      console.error(`neighbors: ${n.sn} rssi缺失`);
      return false;
    }
    if (!Object.prototype.hasOwnProperty.call(n, 'backhaul_type')) {
      console.error(`neighbors: ${n.sn} backhaul_type缺失`);
      return false;
    }
    // 检查是否存在 sn 且值为字符串，长度为15，且只包含数字
    if (typeof n.sn !== 'string' || n.sn.length !== 15 || !/^\d+$/.test(n.sn)) {
      console.error(`neighbors: ${n.sn} sn有误`);
      return false;
    }
    // 检查 backhaul_type 是否为合法值
    const validBackhaulTypes = [
      'wireless_2g',
      'wireless_5g',
      'wired',
      'unknown'
    ];
    if (!validBackhaulTypes.includes(n.backhaul_type)) {
      console.error(`neighbors: ${n.sn} backhaul_type值有误`);
      return false;
    }
    // 如果所有条件都满足，说明对象结构是合法的
    return true;
  };

  // 使用 filter 函数过滤出符合条件的对象数组
  return neighbors.filter(n => isValidNeighbor(n));
}
// 补充关系，a-b,b-a
function addConnection(source) {
  return source.map(s => {
    if (s.neighbors && Array.isArray(s.neighbors)) {
      s.neighbors = filterValidNeighbors(s.neighbors);
      s.neighbors.forEach(n => {
        const rssi1 = n.rssi;
        // 邻居节点
        const node = source.filter(ss => ss.sn === n.sn)[0];
        // 邻居中有该节点，但是该节点不在数据源中
        if (!node) {
          return;
        }
        const nodeSelf = node.neighbors.filter(nr => nr.sn === s.sn)[0];

        // 检查rssi，取连接中较好的一个值
        let rssi2 = rssi1;
        let rssi;
        if (nodeSelf) {
          rssi2 = nodeSelf.rssi;
          rssi = rssi1 > rssi2 ? rssi1 : rssi2;
          n.rssi = rssi;
        }

        if (!nodeSelf) {
          node.neighbors.push({ ...n, rssi: n.rssi, sn: s.sn });
        }
      });
    }
    return s;
  });
}

// 找网关,此处认为sn为0就是网关
function findGateway(source) {
  return source.filter(s => s.is_gw)[0];
}

// 找绿色的节点
function findGreenNode(root, source, visited) {
  let green = [];
  if (root && root.neighbors) {
    root.neighbors.forEach(n => {
      const node = source.find(s => s.sn === n.sn);
      if (visited.includes(node)) {
        return;
      }
      visited.push(node);
      if (isGood(n.rssi)) {
        green.push(node);
        green = green.concat(findGreenNode(node, source, visited));
      }
    });
  }
  return green;
}

// 找红色节点
function findRedNode(green, nodes) {
  const red = [];
  nodes.forEach(s => {
    if (!green.includes(s)) {
      red.push(s);
    }
  });
  return red;
}

// 生成绘图需要的节点数据
function genNodes(gateway, green, red, offline) {
  function genNode(node, color, symbolSize = 70) {
    const getImageConfig = (id, version) => {
      if (picModelColorMap?.[id]?.[version]) {
        return picModelColorMap[id][version];
      }
      if (picModelColorMap?.[id]) {
        return picModelColorMap[id];
      }
      console.error(
        `Model ID '${id}' Model version '${version}' is not found in picModelColorMap`
      );
      return picModelColorMap.default;
    };

    let symbol = 'image://';
    const modelID = (node.model && node.model.id) || node.sn.slice(0, 2);
    const modelVersion = node.sn.charAt(9);
    const modelConfig = getImageConfig(modelID, modelVersion);

    if (node.is_gw) {
      symbol = `${symbol}${modelConfig.gw}`;
    } else {
      symbol = `${symbol}${modelConfig[color]}`;
    }
    const n = {
      name: `${node.sn}${node.name}`, // 避免节点同名echarts报错不能绘图
      originName: node.name, // 用于节点的label显示
      sn: node.sn,
      isGateway: node.is_gw,
      stationsCount: node?.stations?.length || 0,
      itemStyle: {
        color
      },
      symbol,
      symbolSize
    };
    return n;
  }
  const nodes = [];

  const nodeCount = 1 + green.length + red.length + offline.length;
  const symbolSize = [90, 70];
  if (nodeCount >= 8) {
    symbolSize[0] = 70;
    symbolSize[1] = 50;
  }

  if (gateway) nodes.push(genNode(gateway, Color.good, symbolSize[0]));

  // 绿点
  green.forEach(g => {
    nodes.push(genNode(g, Color.good, symbolSize[1]));
  });

  // 红点
  red.forEach(r => {
    nodes.push(genNode(r, Color.bad, symbolSize[1]));
  });

  offline.forEach(o => {
    nodes.push(genNode(o, Color.offline, symbolSize[1]));
  });

  return nodes;
}

// 生成绘图需要的线条信息
function genLines(gateway, green, red, nodes, fullLine) {
  function genLine(source, target, color, neighbor) {
    // 有线实线显示，无线虚线显示
    if (neighbor.rssi === 5555 || neighbor?.backhaul_type === Bands.wired) {
      return {
        source: `${source.sn}${source.name}`,
        target: `${target.sn}${target.name}`,
        rssi: neighbor.rssi,
        lineStyle: {
          color,
          type: 'solid'
        }
      };
    }
    return {
      source: `${source.sn}${source.name}`,
      target: `${target.sn}${target.name}`,
      rssi: neighbor.rssi,
      lineStyle: {
        color,
        type: 'dotted'
      }
    };
  }

  const drawed = [];
  function exist(node1, node2) {
    const temp1 = `${node1.sn}${node2.sn}`;
    const temp2 = `${node2.sn}${node1.sn}`;
    if (!drawed.includes(temp1) && !drawed.includes(temp2)) {
      drawed.push(temp1);
      drawed.push(temp2);
      return false;
    }
    return true;
  }

  const lines = [];
  if (gateway && gateway.neighbors.length) {
    gateway.neighbors.forEach(n => {
      const node = nodes.find(s => s.sn === n.sn);
      if (!exist(node, gateway)) {
        if (isGood(n.rssi)) {
          lines.push(genLine(gateway, node, Color.good, n));
        } else if (red.includes(node)) {
          lines.push(genLine(gateway, node, Color.bad, n));
        } else if (fullLine) {
          lines.push(genLine(gateway, node, Color.bad, n));
        }
      }
    });
  }

  red.forEach(r => {
    r.neighbors.forEach(n => {
      const node = nodes.find(s => s.sn === n.sn);
      if (!exist(node, r)) {
        if (isGood(n.rssi)) {
          lines.push(genLine(r, node, Color.good, n));
        } else {
          lines.push(genLine(r, node, Color.bad, n));
        }
      }
    });
  });

  green.forEach(r => {
    r.neighbors.forEach(n => {
      const node = nodes.find(s => s.sn === n.sn);
      if (!exist(node, r)) {
        if (isGood(n.rssi)) {
          lines.push(genLine(r, node, Color.good, n));
        } else if (!green.includes(node)) {
          lines.push(genLine(r, node, Color.bad, n));
        } else if (fullLine) {
          lines.push(genLine(r, node, Color.bad, n));
        }
      }
    });
  });
  return lines;
}

// 找出离线节点
function findOfflineNode(array, offline) {
  array = array.filter(a => {
    if (
      (a.status === RouterStatus.offline ||
        a.status === RouterStatus.installing) &&
      !a.is_gw
    ) {
      offline.push(a);
      return false;
    }
    return true;
  });
  return array;
}

// 生成所有绘图数据
function genData(array, fullLine = false) {
  if (!array[0].is_gw) {
    // 将网关放在数组第一个，始终保证网关是绘图的起始 node
    // eslint-disable-next-line no-nested-ternary
    array.sort((a, b) => (a.is_gw ? -1 : b.is_gw ? 1 : 0));
  }

  let routers = JSON.parse(JSON.stringify(array));

  const offline = [];
  routers = findOfflineNode(routers, offline);

  routers = addConnection(routers);

  const gateway = findGateway(routers);

  const visited = [gateway];
  const green = findGreenNode(gateway, routers, visited);

  const meshNodes = routers.filter(r => r.sn !== gateway.sn);

  const red = findRedNode(green, meshNodes);

  const nodes = genNodes(gateway, green, red, offline);

  const lines = genLines(gateway, green, red, routers, fullLine);

  return {
    nodes,
    lines
  };
}
export default genData;
