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
  console.log(`old hash is: ${oldHash}`);
  console.log(`new hash is: ${newHash}`);
  console.log(`html is: ${indexHtml}`);
  if (!oldHash || newHash !== oldHash) {
    console.log('the x-web-version-hash is not same, i think router has upgrade ');
    console.log(`document is: ${document.body}`);
    document.write(indexHtml);
    console.log(`after write document is: ${document.body}`);
  } else {
    console.log('the x-web-version-hash is same, i think router not upgrade');
  }
}
