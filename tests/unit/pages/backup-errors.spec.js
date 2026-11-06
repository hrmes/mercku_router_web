/* eslint-env mocha */
const { expect } = require('chai');
const Backup = require('../../../base/src/pages/bussiness/advance/backup.vue').default;

describe('backup dedicated error owner', () => {
  it('shows its existing backup message once without a second global HTTP toast', async () => {
    const messages = [];
    const vm = {
      $loading: { open() {}, close() {} },
      $t: key => key,
      $toast: message => messages.push(message),
      $http: {
        getRouterConfigBackup(params, options = {}) {
          if (!options.hideToast) messages.push('global HTTP failure');
          return Promise.reject({ error: { code: 109999 } });
        },
      },
    };
    Backup.methods.getBackup.call(vm);
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(messages).to.deep.equal(['trans1023']);
    expect(vm.isDownloading).to.equal(false);
  });
});
