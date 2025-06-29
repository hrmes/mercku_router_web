export default function upgradeHelper(indexHtml, isUpgrading, component) {
  const meta = document.querySelector('meta[name="x-web-version-hash"]');
  let oldHash = '';
  let newHash = '';
  if (meta) {
    oldHash = meta.getAttribute('content');
  }
  const result = /<meta name="*x-web-version-hash"* content="*(\w*)"*>/g.exec(
    indexHtml
  );
  if (result !== null) {
    [, newHash] = result;
  }
  console.log(`old hash is: ${oldHash}`);
  console.log(`new hash is: ${newHash}`);
  if (!oldHash || newHash !== oldHash) {
    console.log(
      'the x-web-version-hash is not same, i think router has upgrade'
    );
    // document.write(indexHtml); document.write not works sometimes
    window.location.pathname = '/web/login'; // true means force reload
  }
  console.log('the x-web-version-hash is same, i think router not upgrade');
  if (isUpgrading && component) {
    isUpgrading = false;
    component.close();
  }
}
