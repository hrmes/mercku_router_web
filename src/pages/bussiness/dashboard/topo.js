/**
 *
 *
 * 绘制拓扑图部分
 *
 *
 *
 */
import * as CONSTANTS from 'util/constant';
import picGateway from '../../../assets/images/ic_m2_gw_green.png';
import picM2Good from '../../../assets/images/ic_m2_green.png';
import picM2Bad from '../../../assets/images/ic_m2_orange.png';
import pciM2Offline from '../../../assets/images/ic_m2_offline.png';
import picBeeGood from '../../../assets/images/ic_bee_green.png';
import picBeeBad from '../../../assets/images/ic_bee_orange.png';
import picBeeOffline from '../../../assets/images/ic_bee_offline.png';

const Color = {
  good: '#00d061',
  bad: '#ff6f00',
  offline: '#000'
};

// 大于-50均认为优秀
const isGood = rssi => rssi > -65;

// 补充关系，a-b,b-a
function addConnection(source) {
  return source.map(s => {
    if (s.neighbors) {
      s.neighbors.forEach(n => {
        // 邻居节点
        const node = source.filter(ss => ss.sn === n.sn)[0];
        // 邻居中有该节点，但是该节点不在数据源中
        if (!node) {
          return;
        }
        const nodeSelf = node.neighbors.filter(nr => nr.sn === s.sn)[0];
        if (!nodeSelf) {
          node.neighbors.push({ ...n, sn: s.sn });
        }
      });
    }
    return s;
  });
}
// 去重
function distinct(source, gateway) {
  const result = source.map(r => {
    const neighbors = [];
    if (r.neighbors) {
      r.neighbors.forEach(n => {
        // 邻居节点
        const node = source.filter(s => s.sn === n.sn)[0];
        // 邻居中有该节点，但是该节点不在数据源中
        if (!node) {
          return;
        }

        const nIsHandled = n.entity !== undefined;

        // 邻居节点中的自己(n)
        const nr = node.neighbors.filter(nnn => {
          const sn = nnn.sn || nnn.entity.sn;
          if (sn === r.sn) {
            return true;
          }
          return false;
        })[0];
        const nrIsHandled = nr.entity !== undefined;
        node.neighbors = node.neighbors.filter(nn => nn.sn !== gateway.sn);

        // 选取最优信号
        const rssi1 = nIsHandled ? n.origin.rssi : n.rssi;
        const rssi2 = nrIsHandled ? nr.origin.rssi : nr.rssi;
        const rssi = rssi1 > rssi2 ? rssi1 : rssi2;

        if (!nIsHandled) {
          n.rssi = rssi;
        } else {
          n.origin.rssi = rssi;
        }
        if (!nrIsHandled) {
          nr.rssi = rssi;
        } else {
          nr.origin.rssi = rssi;
        }
        neighbors.push({
          entity: node,
          origin: n
        });
      });
    }
    r.neighbors = neighbors;
    return r;
  });
  return result;
}

// 找网关,此处认为sn为0就是网关
function findGateway(source) {
  return source.filter(s => s.is_gw)[0];
}

// 找绿色的节点
function findGreenNode(root, source, green) {
  root.neighbors.forEach(n => {
    if (!green.includes(n.entity) && isGood(n.origin.rssi) && root !== n.entity) {
      green.push(n.entity);
      findGreenNode(n.entity, source, green);
    }
  });
  return green;
}

// 找红色节点
function findRedNode(gateway, green, source) {
  const red = [];
  source.forEach(s => {
    if (!green.includes(s) && s !== gateway) {
      red.push(s);
    }
  });
  return red;
}

// 生成绘图需要的节点数据
function genNodes(gateway, green, red, offline) {
  const picModelColorMap = {
    [CONSTANTS.RouterSnModel.M2]: {
      [Color.good]: picM2Good,
      [Color.bad]: picM2Bad,
      [Color.offline]: pciM2Offline
    },
    [CONSTANTS.RouterSnModel.Bee]: {
      [Color.good]: picBeeGood,
      [Color.bad]: picBeeBad,
      [Color.offline]: picBeeOffline
    }
  };

  function genNode(node, color, symbolSize = 50) {
    let symbol = 'image://';
    if (node.is_gw) {
      symbol = `${symbol}${picGateway}`;
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
  const symbolSize = [70, 50];
  if (nodeCount >= 8) {
    symbolSize[0] = 50;
    symbolSize[1] = 30;
  }

  // m2
  nodes.push(genNode(gateway, Color.good, symbolSize[0]));

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
function genLines(gateway, green, red, fullLine) {
  function genLine(source, target, color, value = 0) {
    return {
      source: `${source.sn}${source.name}`,
      target: `${target.sn}${target.name}`,
      rssi: value,
      lineStyle: {
        color
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

  gateway.neighbors.forEach(n => {
    if (!exist(n.entity, gateway)) {
      if (isGood(n.origin.rssi)) {
        lines.push(genLine(gateway, n.entity, Color.good, n.origin.rssi));
      } else if (red.includes(n.entity)) {
        lines.push(genLine(gateway, n.entity, Color.bad, n.origin.rssi));
      } else if (fullLine) {
        lines.push(genLine(gateway, n.entity, Color.bad, n.origin.rssi));
      }
    }
  });

  red.forEach(r => {
    r.neighbors.forEach(n => {
      if (!exist(n.entity, r)) {
        if (isGood(n.origin.rssi)) {
          lines.push(genLine(r, n.entity, Color.good, n.origin.rssi));
        } else {
          lines.push(genLine(r, n.entity, Color.bad, n.origin.rssi));
        }
      }
    });
  });

  green.forEach(r => {
    r.neighbors.forEach(n => {
      if (!exist(n.entity, r)) {
        if (isGood(n.origin.rssi)) {
          lines.push(genLine(r, n.entity, Color.good, n.origin.rssi));
        } else if (!green.includes(n.entity)) {
          lines.push(genLine(r, n.entity, Color.bad, n.origin.rssi));
        } else if (fullLine) {
          lines.push(genLine(r, n.entity, Color.bad, n.origin.rssi));
        }
      }
    });
  });
  return lines;
}

// 找出离线节点
function findOfflineNode(array, offline) {
  array = array.filter(a => {
    if (a.status === CONSTANTS.RouterStatus.offline) {
      offline.push(a);
      return false;
    }
    return true;
  });
  return array;
}

// 生成所有绘图数据
function genData(array, fullLine = false) {
  let routers = JSON.parse(JSON.stringify(array));

  const offline = [];
  routers = findOfflineNode(routers, offline);

  routers = addConnection(routers);
  const gateway = findGateway(routers);

  const RouterDistincted = distinct(routers, gateway);

  const green = [];
  findGreenNode(gateway, RouterDistincted, green);

  const red = findRedNode(gateway, green, RouterDistincted);

  const nodes = genNodes(gateway, green, red, offline);

  const lines = genLines(gateway, green, red, fullLine);

  return {
    nodes,
    lines
  };
}
export default genData;
