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
      rootStyle = `html{font-size:${rem}px !important;width:${needWidth}px !important;height:${height}px !important}`;
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
    // win.addEventListener(   'resize',   () => {     clearTimeout(tid);     tid =
    // setTimeout(refreshRem, 300);   },   false );

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

export const ipRexp = ip => {
  const pattern = /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/;
  if (ip && pattern.test(ip)) {
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
  console.log(result);
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
  if (!ipRexp(ip) || !ipRexp(mask)) {
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

export const compareVersion = (version1, version2) => {
  if (!version2) {
    return false;
  }
  const v1 = version1.split('.').reduce((sum, next) => {
    sum <<= 8;
    sum += parseInt(next, 10);
    return sum;
  }, 0);
  const v2 = version2.split('.').reduce((sum, next) => {
    sum <<= 8;
    sum += parseInt(next, 10);
    return sum;
  }, 0);

  return v2 > v1;
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
