export default function upgradeHelper(indexHtml) {
  const meta = document.querySelector('meta[name="x-web-version-hash"]');
  let oldHash = '';
  let newHash = '';
  if (meta) {
    oldHash = meta.getAttribute('content');
  }
  const result = /<meta name="*x-web-version-hash"* content="*(\w*)"*>/g.exec(indexHtml);
  if (result !== null) {
    [, newHash] = result;
  }
  if (!oldHash || newHash !== oldHash) {
    console.log('the x-web-version-hash is not same, i think router has upgrade ');
    window.location.reload(true);
  } else {
    console.log('the x-web-version-hash is same, i think router not upgrade');
  }
}
