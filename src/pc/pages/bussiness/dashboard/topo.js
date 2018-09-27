/**
 *
 *
 * 绘制拓扑图部分
 *
 *
 *
 */
import picGateway from '../../../assets/images/ic_m2_green_80x80px@2x.png';
import picM2Good from '../../../assets/images/ic_m2_green_60x60px@2x.png';
import picM2Bad from '../../../assets/images/ic_m2_orange_60x60px@2x.png';
import picBeeGood from '../../../assets/images/ic_bee_green_60x60px@2x.png';
import picBeeBad from '../../../assets/images/ic_bee_orange_60x60px@2x.png';
import * as CONSTANTS from '../../../../util/constant';

const Color = {
  good: '#00d061',
  bad: '#ff6f00'
};

// 大于-50均认为优秀
const isGood = rssi => rssi > -60;

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
    if (
      !green.includes(n.entity) &&
      isGood(n.origin.rssi) &&
      root !== n.entity
    ) {
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
function genNodes(gateway, green, red) {
  function getPositions() {
    const count = 1 + green.length + red.length;
    const radius = 10;
    const pos = [];
    if (count === 1) {
      pos.push({ x: 0, y: 0, angle: 180 });
      return pos;
    }
    if (count === 2) {
      pos.push({ x: 0, y: 0, angle: 0 });
      pos.push({ x: 0, y: 2, angle: 180 });
      return pos;
    }

    const angle = (2 * Math.PI) / count;
    for (let i = 0; i < count; i += 1) {
      pos.push({
        x: radius * Math.sin(angle * i),
        y: -radius * Math.cos(angle * i),
        angle: (360 / count) * i
      });
    }
    return pos;
  }
  const pos = getPositions();
  let currentIndex = 0;
  function genNode(node, color, symbolSize = 50) {
    let symbol = 'image://';
    let labelPosition;
    if (node.is_gw) {
      symbol += picGateway;
    } else {
      const id = (node.model && node.model.id) || node.sn.slice(0, 2);
      if (id === CONSTANTS.RouterSnModel.M2) {
        symbol += color === Color.good ? picM2Good : picM2Bad;
      } else if (id === CONSTANTS.RouterSnModel.Bee) {
        symbol += color === Color.good ? picBeeGood : picBeeBad;
      }
    }
    const angle = pos[currentIndex].angle;
    const Positions = {
      top: 'top',
      bottom: 'bottom',
      left: 'left',
      right: 'right'
    };

    if (angle >= 0 && angle <= 90) {
      labelPosition = Positions.top;
    } else if (angle > 90 && angle < 270) {
      labelPosition = Positions.bottom;
    } else if (angle >= 270 && angle <= 360) {
      labelPosition = Positions.top;
    }
    const n = {
      name: [node.name, node.sn].join(':'), // 避免节点同名echarts报错不能绘图
      sn: node.sn,
      ...pos[currentIndex],
      itemStyle: {
        color
      },
      label: {
        normal: {
          position: labelPosition
        }
      },
      symbol,
      symbolSize
    };
    currentIndex += 1;
    return n;
  }
  const nodes = [];
  // m2
  nodes.push(genNode(gateway, Color.good, 70));

  // 绿点
  green.forEach(g => {
    nodes.push(genNode(g, Color.good));
  });

  // 红点
  red.forEach(r => {
    nodes.push(genNode(r, Color.bad));
  });

  return nodes;
}

// 生成绘图需要的线条信息
function genLines(gateway, green, red) {
  function genLine(source, target, color) {
    return {
      source: [source.name, source.sn].join(':'),
      target: [target.name, target.sn].join(':'),
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
        lines.push(genLine(gateway, n.entity, Color.good));
      } else if (red.includes(n.entity)) {
        lines.push(genLine(gateway, n.entity, Color.bad));
      }
    }
  });

  red.forEach(r => {
    r.neighbors.forEach(n => {
      if (!exist(n.entity, r)) {
        if (isGood(n.origin.rssi)) {
          lines.push(genLine(r, n.entity, Color.good));
        } else {
          lines.push(genLine(r, n.entity, Color.bad));
        }
      }
    });
  });

  green.forEach(r => {
    r.neighbors.forEach(n => {
      if (!exist(n.entity, r)) {
        if (isGood(n.origin.rssi)) {
          lines.push(genLine(r, n.entity, Color.good));
        } else if (!green.includes(n.entity)) {
          // 双绿点过滤红线
          lines.push(genLine(r, n.entity, Color.bad));
        }
      }
    });
  });
  return lines;
}

// 生成所有绘图数据
function genData(array) {
  array = addConnection(array);
  const gateway = findGateway(array);

  const RouterDistincted = distinct(array, gateway);

  const green = [];
  findGreenNode(gateway, RouterDistincted, green);

  const red = findRedNode(gateway, green, RouterDistincted);

  const nodes = genNodes(gateway, green, red);

  const lines = genLines(gateway, green, red);

  return {
    nodes,
    lines
  };
}
export default genData;
