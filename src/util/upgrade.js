export default function upgradeHelper(indexHtml) {
  const meta = document.querySelector('meta[name="x-web-version-hash"]');
  let oldHash = '';
  let newHash = '';
  if (meta) {
    oldHash = meta.getAttribute('content');
  }
  const result = /<meta name="x-web-version-hash" content="(\w*)">/g.exec(indexHtml);
  if (result !== null) {
    [, newHash] = result;
  }
  if (!oldHash || newHash !== oldHash) {
    console.log('the x-web-version-hash is not same, i think router has upgrade ');
    document.clear();
    document.write(indexHtml);
  } else {
    console.log('the x-web-version-hash is same, i think router not upgrade');
    // document.body.querySelector('#app-wrap').remove();
    // for test in here

    // const scripts = document.querySelectorAll('script');
    // scripts.forEach(s => s.remove());
    // // const links = document.querySelectorAll('link');
    // // links.forEach(l => l.remove());

    // const appWrap = document.body.querySelector('#app-wrap');
    // Array.from(appWrap.childNodes).forEach(node => {
    //   node.remove();
    // });

    // const el = document.createElement('div');
    // el.id = 'web';
    // appWrap.append(el);

    // meta.setAttribute('content', newHash);

    // // const script = document.createElement('script');
    // // script.src = '/index.js';
    // // document.body.append(script);
    // const newScripts = /<script src="([/\w.]*)".*><\/scirpt>/g.exec(indexHtml);
    // const newlinks = /<link href="([/\w.]*)">/g.exec(indexHtml);

    // console.log(newScripts, newlinks);
  }
}
