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

function move_bit(arr) {
  return arr
    .reverse()
    .map((v, index) => Number(v) << (index * 8))
    .reduce((pre, next) => pre + next);
}
export const ipRule = (ip, gateway) => {
  if (!gateway || !ip || !ipRexp(ip) || !ipRexp(gateway)) {
    return true;
  }
  if (ip && gateway) {
    const ips = ip.split('.');
    const gateways = gateway.split('.');
    const reslut = move_bit(ips) & ~move_bit(gateways);
    if (reslut >= 1 && reslut <= 254) {
      return true;
    }
    return false;
  }
};
