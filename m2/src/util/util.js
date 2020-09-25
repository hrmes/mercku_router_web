import semver from 'semver';

export const passwordRule = /^[a-zA-Z0-9\s!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~`]{8,24}$/;
export const ipReg = /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/;
export const hostReg = /^[a-z0-9]+(-[a-z0-9]+)*(\.[a-z0-9]+(-[a-z0-9]+)*)*$/i;
export const portReg = /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/;
export const IPAReg = /^10\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])$/;
export const IPBReg = /^172\.(1[6789]|2[0-9]|3[01])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])$/;
export const IPCReg = /^192\.168\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])$/;

export const getIpBefore = ip => {
  const pattern = /\d{1,3}\.\d{1,3}\.\d{1,3}\./;
  return pattern.exec(ip)[0];
};
export const getIpAfter = ip => {
  const pattern = /\d{1,3}\.\d{1,3}\.\d{1,3}\./;
  return ip.replace(pattern, '');
};
export const isIP = ip => {
  if (ip && ipReg.test(ip)) {
    return true;
  }
  return false;
};
export const hostRexp = host => {
  if (host && hostReg.test(host)) {
    return true;
  }
  return false;
};

function ip2int(ip) {
  return (
    ip.split('.').reduce((total, next) => (total << 8) + Number(next), 0) >>> 0
  );
}

export const isMulticast = ip => {
  const i = ip2int(ip);
  // 组播地址
  if (i >= ip2int('224.0.0.0') && i <= ip2int('239.255.255.255')) {
    return true;
  }
  return false;
};

function isMulticastMac(mac) {
  const number = mac.split(':')[0];
  const result = Number.parseInt(number, 16) & 0x01;
  return result === 0x01;
}
export const isMac = mac => {
  if (!/^([a-f0-9]{2}:){5}[a-f0-9]{2}$/i.test(mac)) {
    return false;
  }
  // 检查组播
  return !isMulticastMac(mac);
};

export const isLoopback = ip => {
  const i = ip2int(ip);
  // 环回地址
  if (i >= ip2int('127.0.0.0') && i <= ip2int('127.255.255.255')) {
    return true;
  }
  return false;
};

export const isValidMask = ip => {
  const i = ip2int(ip)
    .toString(2)
    .padStart(32, '0');
  const result = i.split('10');
  if (result.length !== 2) {
    return false;
  }
  // 有效mask
  if (result[0].includes('0') || result[1].includes('1')) {
    return false;
  }
  return true;
};

export const ipRule = (ip, mask) => {
  if (!mask || !ip) {
    return true;
  }
  if (!isIP(ip) || !isIP(mask)) {
    return false;
  }

  if (ip && mask) {
    if (isMulticast(ip) || isLoopback(ip)) {
      return false;
    }
    const i = ip2int(ip);
    const m = ~ip2int(mask);
    const reslut = i & m;
    if (reslut >= 1 && reslut < m) {
      return true;
    }
    return false;
  }
  return true;
};
export const privateIpReg = ip => {
  const masks = {
    A: '255.255.255.0',
    B: '255.255.255.0',
    C: '255.255.255.0'
  };
  const AIPMask = IPAReg.test(ip) && ipRule(ip, masks.A);
  const BIPMask = IPBReg.test(ip) && ipRule(ip, masks.B);
  const CIPMask = IPCReg.test(ip) && ipRule(ip, masks.C);
  return AIPMask || BIPMask || CIPMask;
};
export const compareVersion = (version1, version2) => {
  if (!version2) {
    return false;
  }
  return semver.gt(version2, version1);
};

export const getFileExtendName = file => {
  if (file) {
    const r = file.name.split('.');
    if (r.length) {
      return r[r.length - 1];
    }
  }
  return '';
};

export const getStringByte = str => {
  let total = 0;
  /**
   * js默认使用utf-16进行编码，同时codePointAt也会返回的utf-16的码点值
   * 但是存储是路由器，使用的是utf-8的编码方式，所以需要计算为utf-8的字节数
   * 转换的具体方式，通过取每个字符的codePointAt(0)得到该字符的unicode码点(code point)
   * 然后按照utf-8的转换方式去计算utf-8的字节数
   * */
  /*  eslint-disable  */
  for (const ch of str) {
    const charCode = ch.codePointAt(0);
    if (charCode <= 0x007f) {
      total += 1;
    } else if (charCode <= 0x07ff) {
      total += 2;
    } else if (charCode <= 0xffff) {
      total += 3;
    } else {
      total += 4;
    }
  }

  return total;
};

// 格式化网络数据流量单位，value的初始单位应为B
export const formatNetworkData = value => {
  const units = ['KB', 'MB', 'GB', 'TB', 'PB'];
  let index = -1;
  value = Number(value);
  if (!Number.isNaN(value)) {
    do {
      value /= 1000;
      index += 1;
    } while (value > 1000 && index < units.length - 1);
    return {
      value,
      unit: units[index]
    };
  }
  return { value: '-', unit: units[0] };
};

export const formatMac = mac => {
  if (mac.length === 12) {
    return mac.match(/.{2}/g).join(':');
  }
  return mac;
};

export const formatSpeed = value => {
  value /= 8;
  const units = ['KB', 'MB', 'GB', 'TB', 'PB'];
  let index = -1;
  value = Number(value);
  if (!Number.isNaN(value)) {
    do {
      value /= 1000;
      index += 1;
    } while (value > 1000 && index < units.length - 1);
    return {
      value,
      unit: units[index]
    };
  }
  return { value: '-', unit: units[0] };
};

export const formatBandWidth = value => {
  const units = ['bps', 'Kbps', 'Mbps', 'Gbps', 'Tbps', 'Pbps'];
  let index = 0;
  value = Number(value);
  if (!Number.isNaN(value)) {
    while (value > 1000 && index < units.length - 1) {
      value /= 1000;
      index += 1;
    }
    return {
      value,
      unit: units[index]
    };
  }
  return {
    value: '-',
    unit: 'bps'
  };
};

export const formatDate = (date, fmt = 'yyyy-MM-dd hh:mm:ss') => {
  date = new Date(date);
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      `${date.getFullYear()}`.substr(4 - RegExp.$1.length)
    );
  }

  Object.keys(o).forEach(k => {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length)
      );
    }
  });

  return fmt;
};

export const formatDuration = value => {
  const YEAR = 365; // 定义一年有多少天
  const MONTH = 30; // 定义一月有多少天
  const HOUR = 3600; // 定义一小时有多少秒
  const timeArr = [];

  const splits = [YEAR * 24 * HOUR, MONTH * 24 * HOUR, 24 * HOUR, HOUR, 60];
  splits.forEach(val => {
    let duration = 0;
    if (value >= val) {
      duration = parseInt(value / val, 10);
      value -= duration * val;
    }
    timeArr.push(duration);
  });
  // 添加剩下的秒数
  timeArr.push(value);

  return timeArr;
};
