export default {

  adapt: (designWidth, maxWidth) => {
    const doc = document;
    const win = window;
    const docEl = doc.documentElement;
    let tid;
    let rootItem;
    let rootStyle;

    function refreshRem() {
      let width = docEl.getBoundingClientRect().width || 0;
      if (width > maxWidth) {
        width = maxWidth;
      }
      const rem = width * 100 / designWidth;
      rootStyle = `html{font-size:${rem}px !important}`;
      rootItem = document.getElementById('rootsize') || document.createElement('style');
      if (!document.getElementById('rootsize')) {
        document.getElementsByTagName('head')[0].appendChild(rootItem);
        rootItem.id = 'rootsize';
      }
      if (rootItem.styleSheet) {
        rootItem.styleSheet.disabled || (rootItem.styleSheet.cssText = rootStyle);
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
    win.addEventListener('resize', () => {
      clearTimeout(tid);
      tid = setTimeout(refreshRem, 300);
    }, false);

    win.addEventListener('pageshow', (e) => {
      if (e.persisted) { // 浏览器后退的时候重新计算
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
      }
    }, false);

    if (doc.readyState === 'complete') {
      doc.body.style.fontSize = '16px';
    } else {
      doc.addEventListener('DOMContentLoaded', () => {
        doc.body.style.fontSize = '16px';
      }, false);
    }
  }
};

export const isIphone = () => {
  const u = navigator.userAgent;
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
  const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  if (isiOS) {
    return true;
  }

  if (isAndroid) {
    return false;
  }

  return false;
};

