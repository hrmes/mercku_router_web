/* eslint-env mocha */
const { expect } = require('chai');
const axios = require('axios');
const { createHttp } = require('../../../unified/src/app/http');
const { createOperationTracker, operationPolicy } = require('../../../unified/src/app/http/operations');
const id = 'e02b3422-715d-4d45-ae5a-1bbaf8baf6bd';
const id2 = 'e02b3422-715d-4d45-ae5a-1bbaf8baf6be';
const flush = () => new Promise(resolve => setTimeout(resolve, 0));
const completed = { status: 'settled', outcome: 'completed' };

describe('async operation HTTP contract', () => {
  it('waits past prepared and preserves the original AxiosResponse and single mutation', async () => {
    const previous = axios.defaults.adapter;
    let reads = 0; let writes = 0; let release;
    const gate = new Promise(resolve => { release = resolve; });
    const response = { status: 200, data: { result: { status: true }, async: { id, status: 'running' } } };
    axios.defaults.adapter = async config => {
      const data = JSON.parse(config.data);
      if (data.method === 'router.operation.query') { reads++; await gate; return { status: 200, data: { result: completed }, config }; }
      writes++; return response;
    };
    try {
      const http = createHttp({ store: { commit() {} } });
      let resolved = false;
      const request = http.updateWIFITimeLimit({}).then(res => { resolved = true; return res; });
      await flush(); expect(resolved).to.equal(false); expect(reads).to.equal(1);
      release(); expect(await request).to.equal(response); expect(writes).to.equal(1);
    } finally { release(); axios.defaults.adapter = previous; }
  });
  it('returns disconnect responses early, passes through old responses, and never tracks query', async () => {
    const previous = axios.defaults.adapter;
    const calls = [];
    axios.defaults.adapter = async config => { calls.push(JSON.parse(config.data).method); return { status: 200, config, data: { result: true, async: { id, status: 'running' } } }; };
    try {
      const http = createHttp({ store: { commit() {} } });
      await http.meshWifiUpdate({}); await http.request({ action: 'router.operation.query', url: '/app' }, { id });
      expect(calls).to.deep.equal(['mesh.config.wifi.update', 'router.operation.query']);
      expect(operationPolicy('mesh.config.update')).to.equal('reconnect');
      ['mesh.mode.update', 'system.reboot', 'mesh.node.reboot', 'mesh.node.upgrade', 'system.reset', 'router.config.backup.restore', 'system.firmware.upgrade'].forEach(method => expect(operationPolicy(method)).to.equal('handoff'));
      axios.defaults.adapter = async config => ({ status: 200, config, data: { result: true } });
      expect((await http.setTimezone({})).data).to.deep.equal({ result: true });
    } finally { axios.defaults.adapter = previous; }
  });
  it('deduplicates queries per id while observing two ids independently', async () => {
    const counts = {}; const release = {};
    const tracker = createOperationTracker({ query: key => {
      counts[key] = (counts[key] || 0) + 1;
      return new Promise(resolve => { release[key] = resolve; });
    }, timeoutMs: 100 });
    const a = tracker.wait(id); const b = tracker.wait(id); const c = tracker.wait(id2);
    await flush(); expect(counts).to.deep.equal({ [id]: 1, [id2]: 1 });
    release[id](completed); await Promise.all([a, b]); release[id2](completed); await c;
    expect(tracker.size()).to.equal(0);
  });
  it('never succeeds on unknown, history loss, interrupted, resolved or failed', async () => {
    for (const receipt of [{ status: 'unknown' }, { status: 'unknown', code: 'expired-history' }, { status: 'interrupted' }, { status: 'settled', outcome: 'resolved' }, { status: 'settled', outcome: 'failed' }, { status: 'rejected', reason: 'busy' }, { status: 'expired' }]) {
      const tracker = createOperationTracker({ query: async () => receipt });
      let error;
      try { await tracker.wait(id); } catch (e) { error = e; }
      expect(error, JSON.stringify(receipt)).to.have.property('response');
      expect(error.response.data.async.id).to.equal(id);
      expect(error.response.data.error.reason).to.equal(receipt.outcome === 'failed' ? 'apply-failed' : (receipt.reason || 'outcome-unknown'));
      expect(tracker.size()).to.equal(0);
    }
  });
  it('bounds unavailable reads, cleans timers and supports a manual read of the same id', async () => {
    let calls = 0;
    const tracker = createOperationTracker({ query: async () => { calls++; throw Error('offline'); }, intervalMs: 2, timeoutMs: 12 });
    let error; try { await tracker.wait(id); } catch (e) { error = e; }
    expect(error.response.data.error.reason).to.equal('outcome-unknown');
    const before = calls; await new Promise(resolve => setTimeout(resolve, 10)); expect(calls).to.equal(before); expect(tracker.size()).to.equal(0);
    try { await tracker.wait(id, { timeoutMs: 3 }); } catch (e) { /* still unknown */ }
    expect(calls).to.be.greaterThan(before);
  });
  it('cancels browser observation, never a mutation, without cancelling another observer', async () => {
    const source = axios.CancelToken.source(); let release;
    const tracker = createOperationTracker({ query: () => new Promise(resolve => { release = resolve; }) });
    const a = tracker.wait(id, { cancelToken: source.token }).catch(e => e);
    const b = tracker.wait(id); await flush(); source.cancel('route change');
    expect(axios.isCancel(await a)).to.equal(true); release(completed); await b; expect(tracker.size()).to.equal(0);
  });
  it('route cancellation ends HTTP observation and its query without a toast or a resubmit', async () => {
    const previous = axios.defaults.adapter;
    const cancels = [];
    let queries = 0; let writes = 0; let stopped = 0; let exceptions = 0; let resolved = false;
    axios.defaults.adapter = config => {
      if (JSON.parse(config.data).method === 'router.operation.query') {
        queries += 1;
        return new Promise((resolve, reject) => config.cancelToken.promise.then(reject));
      }
      writes += 1;
      return Promise.resolve({ status: 200, config, data: { result: true, async: { id, status: 'running' } } });
    };
    try {
      const http = createHttp({ store: { commit(name, value) { cancels.push(value.cancelToken); } } });
      http.onOperationWaiting = () => () => { stopped += 1; };
      http.setExHandler(() => { exceptions += 1; });
      http.updateWIFITimeLimit({}).then(() => { resolved = true; });
      await flush(); expect(queries).to.equal(1);
      cancels.forEach(cancel => cancel('route-change'));
      await flush();
      expect(http.operations.size()).to.equal(0);
      expect(stopped).to.equal(1); expect(exceptions).to.equal(0); expect(resolved).to.equal(false);
      expect(writes).to.equal(1);
    } finally { axios.defaults.adapter = previous; }
  });

  it('continues observing real admission/publication states until completion', async () => {
    const statuses = ['queued', 'admitting', 'publishing', 'accepted', 'running', 'waiting'];
    let reads = 0;
    const tracker = createOperationTracker({ intervalMs: 1, query: async () => {
      const status = statuses[reads]; reads += 1;
      return status ? { status } : completed;
    } });
    expect(await tracker.wait(id)).to.deep.equal(completed);
    expect(reads).to.equal(statuses.length + 1);
    expect(tracker.size()).to.equal(0);
  });

});
