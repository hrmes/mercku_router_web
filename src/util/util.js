import semver from 'semver';

export default {
  adapt: () => {
    const doc = document;
    const win = window;
    const docEl = doc.documentElement;
    let tid;
    let rootItem;
    let rootStyle;

    function refreshRem() {
      const width = docEl.clientWidth || 0;
      const height = docEl.clientHeight || 0;
      const ratio = 375 / 667;
      const needHeight = width / ratio;

      let needWidth;
      let rem;
      if (needHeight > height) {
        needWidth = height * ratio;
      } else {
        needWidth = width;
      }
      rem = needWidth / 3.75;
      rem = rem > 100 ? 100 : rem;
      // const rem = width / 3.75;
      rootStyle = `html{font-size:${rem}px !important;height:${height}px !important}`;
      rootItem =
        document.getElementById('rootsize') || document.createElement('style');
      if (!document.getElementById('rootsize')) {
        document.getElementsByTagName('head')[0].appendChild(rootItem);
        rootItem.id = 'rootsize';
      }
      if (rootItem.styleSheet) {
        rootItem.styleSheet.disabled ||
          (rootItem.styleSheet.cssText = rootStyle);
      } else {
        try {
          rootItem.innerHTML = rootStyle;
        } catch (f) {
          rootItem.innerText = rootStyle;
        }
      }
      docEl.style.fontSize = `${rem}px`;
    }

    refreshRem();
    win.addEventListener(
      'pageshow',
      e => {
        if (e.persisted) {
          // 浏览器后退的时候重新计算
          clearTimeout(tid);
          tid = setTimeout(refreshRem, 300);
        }
      },
      false
    );

    if (doc.readyState === 'complete') {
      doc.body.style.fontSize = '16px';
    } else {
      doc.addEventListener(
        'DOMContentLoaded',
        () => {
          doc.body.style.fontSize = '16px';
        },
        false
      );
    }
  }
};

export const isIphone = () => {
  const u = navigator.userAgent;
  // const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
  const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  return isiOS;
};

export const passwordRule = /^[a-zA-Z0-9\s!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~`]{8,24}$/;
export const ipReg = /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/;
export const hostReg = /^\.*[a-zA-Z0-9]+([\w-][a-zA-Z0-9])*(\.[a-zA-Z0-9]+((\w|-)*[a-zA-Z0-9]+)*)*\.*$/;
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

function mac2int(mac) {
  let result = '';
  mac
    .replace(/:/g, '')
    .split('')
    .reduce((total, next) => {
      result += parseInt(next, 16)
        .toString(2)
        .padStart(4, '0');
      return result;
    });
  return parseInt(result, 2);
}

export const isMulticast = ip => {
  const i = ip2int(ip);
  // 组播地址
  if (i >= ip2int('224.0.0.0') && i <= ip2int('239.255.255.255')) {
    return true;
  }
  return false;
};

export const isMac = mac => {
  if (!/^([a-z0-9]{2}:){5}[a-z0-9]{2}$/i.test(mac)) {
    return false;
  }
  // 检查组播
  const r = mac2int(mac);
  const min = mac2int('01:00:5e:00:00:00');
  const max = mac2int('01:00:5e:7f:ff:ff');
  if (r >= min && r <= max) {
    return false;
  }
  return true;
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
    A: '255.0.0.0',
    B: '255.255.0.0',
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
  let charCode;
  const len = str.length;
  /**
   * 高位编码单元（higher code point）使用一对（低位编码（lower valued））
   * 代理伪字符（”surrogate” pseudo-characters）来表示，从而构成一个真正的字符。
   * 所以这里有个BUG，在计算高位字符会计算成6个
   * */
  for (let i = 0; i < len; i += 1) {
    charCode = str.charCodeAt(i);
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
  if (!isNaN(value)) {
    do {
      value /= 1000;
      index += 1;
    } while (value > 1000 && index < units.length - 1);
    return {
      value: value.toFixed(1),
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
  if (!isNaN(value)) {
    do {
      value /= 1000;
      index += 1;
    } while (value > 1000 && index < units.length - 1);
    return {
      value: value.toFixed(1),
      unit: units[index]
    };
  }
  return { value: '-', unit: units[0] };
};

export const formatBandWidth = value => {
  const units = ['bps', 'Kbps', 'Mbps', 'Gbps', 'Tbps', 'Pbps'];
  let index = 0;
  if (!isNaN(value)) {
    while (value > 1000 && index < units.length - 1) {
      value /= 1000;
      index += 1;
    }
    return {
      value: value.toFixed(1),
      unit: units[index]
    };
  }
  return {
    value: '-',
    unit: 'M'
  };
};

export const formatDate = (date, fmt = 'yyyy-MM-dd HH:mm:ss') => {
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
