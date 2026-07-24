/* eslint-env mocha */
const { expect } = require('chai');

const { createHttp } = require('../../../unified/src/app/http/index.js');

describe('unified capability HTTP methods', () => {
  it('exposes the existing model-page APIs through one HTTP client', async () => {
    const http = createHttp({ store: { commit() {} } });
    const calls = [];
    http.request = (config, params) => {
      calls.push({ action: config.action, params });
      return Promise.resolve();
    };

    const expected = [
      ['getNewMeshNodeInfo', 'mesh.node.new.info'],
      ['getMeshWanIntf', 'mesh.wan.intf.get'],
      ['updateMeshWanIntf', 'mesh.wan.intf.update'],
      ['getMeshPowerSupplyMode', 'mesh.poe.mode.get'],
      ['updateMeshPowerSupplyMode', 'mesh.poe.mode.update'],
      ['getMeshFanMode', 'mesh.fan.mode.get'],
      ['updateMeshFanMode', 'mesh.fan.mode.update'],
      ['getRouterFrozenConfig', 'router.config.frozen.get'],
      ['updateRouterFrozenConfig', 'router.config.frozen.update'],
    ];

    await Promise.all(expected.map(([method]) => http[method]({ test: method })));
    expect(calls.map(call => call.action)).to.deep.equal(expected.map(([, action]) => action));
  });
});
