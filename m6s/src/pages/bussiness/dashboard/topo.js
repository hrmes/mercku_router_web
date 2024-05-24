/**
 *
 *
 * 绘制拓扑图部分
 *
 *
 *
 */
import * as CONSTANTS from 'base/util/constant';

import picM6sGateway from '@/assets/images/topo/ic_m6s_gw_green.png';
import picM6sWifi6Good from '@/assets/images/topo/ic_m6s_normal.png';
import picM6sWifi6Bad from '@/assets/images/topo/ic_m6s_bad.png';
import picM6sWifi6Offline from '@/assets/images/topo/ic_m6s_offline.png';
import picM6sSFPGateway from '@/assets/images/topo/ic_m6s_sfp_gw_green.png';
import picM6sSFPWifi6Good from '@/assets/images/topo/ic_m6s_sfp_normal.png';
import picM6sSFPWifi6Bad from '@/assets/images/topo/ic_m6s_sfp_bad.png';
import picM6sSFPWifi6Offline from '@/assets/images/topo/ic_m6s_sfp_offline.png';

import { Color, Bands, M6sRouterSnModelVersion } from 'base/util/constant';

// 大于-70均认为优秀
const isGood = rssi => rssi >= -65;

function filterValidNeighbors(neighbors) {
  const isValidNeighbor = n => {
    if (!Object.prototype.hasOwnProperty.call(n, 'sn')) {
      console.log(`neighbors: ${n.sn} sn缺失`);
      return false;
    }
    if (!Object.prototype.hasOwnProperty.call(n, 'rssi')) {
      console.log(`neighbors: ${n.sn} rssi缺失`);
      return false;
    }
    if (!Object.prototype.hasOwnProperty.call(n, 'backhaul_type')) {
      console.log(`neighbors: ${n.sn} backhaul_type缺失`);
      return false;
    }
    // 检查是否存在 sn 且值为字符串，长度为15，且只包含数字
    if (typeof n.sn !== 'string' || n.sn.length !== 15 || !/^\d+$/.test(n.sn)) {
      console.log(`neighbors: ${n.sn} sn有误`);
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
      console.log(`neighbors: ${n.sn} backhaul_type值有误`);
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
    s.neighbors = filterValidNeighbors(s.neighbors);
    if (s.neighbors) {
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
  const picModelColorMap = {
    [CONSTANTS.RouterSnModel.M6s]: {
      [M6sRouterSnModelVersion.M6s]: {
        [Color.good]: picM6sWifi6Good,
        [Color.bad]: picM6sWifi6Bad,
        [Color.offline]: picM6sWifi6Offline
      },
      [M6sRouterSnModelVersion.M6s_SFP]: {
        [Color.good]: picM6sSFPWifi6Good,
        [Color.bad]: picM6sSFPWifi6Bad,
        [Color.offline]: picM6sSFPWifi6Offline
      }
    }
  };

  function genNode(node, color, symbolSize = 70) {
    let symbol = 'image://';
    const modelVersion = node.sn.charAt(9);

    if (node.is_gw) {
      switch (modelVersion) {
        case M6sRouterSnModelVersion.M6s_SFP:
          symbol = `${symbol}${picM6sSFPGateway}`;
          break;
        default:
          symbol = `${symbol}${picM6sGateway}`;
          break;
      }
    } else {
      const id = (node.model && node.model.id) || node.sn.slice(0, 2);
      const modelConfig = picModelColorMap[id];
      if (modelConfig) {
        symbol = `${symbol}${modelConfig[color]}`;
      }
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
      (a.status === CONSTANTS.RouterStatus.offline ||
        a.status === CONSTANTS.RouterStatus.installing) &&
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
