import axios from 'axios';

// Real HTTP methods, not daemon kinds. Every other receipt uses completed/settled.
const disconnect = ['mesh.config.update', 'mesh.config.wifi.update', 'mesh.guestwifi.update',
  'mesh.region.update', 'mesh.config.wan.net.update'];
const handoff = ['system.reboot', 'mesh.node.reboot', 'mesh.network.reboot', 'system.reset',
  'mesh.node.reset', 'mesh.node.upgrade', 'system.firmware.upgrade', 'router.config.backup.restore',
  'mesh.mode.update', 'mesh.apclient.update'];
export function operationPolicy(method) {
  if (handoff.includes(method)) return 'handoff';
  return disconnect.includes(method) ? 'reconnect' : 'wait';
}

export function operationError(id, reason = 'outcome-unknown', status = 'unknown') {
  return {
    response: {
      status: 409,
      data: { error: { code: 109999, reason }, async: { id, status } },
    },
  };
}

/** Browser observations only. Share in-flight reads, never submit/review/cancel work. */
export function createOperationTracker({ query, intervalMs = 2000, timeoutMs = 120000 } = {}) {
  const reads = new Map();
  function acquire(id) {
    let entry = reads.get(id);
    if (!entry) {
      const source = axios.CancelToken.source();
      entry = { users: 0, source };
      entry.promise = Promise.resolve().then(() => query(id, source.token));
      reads.set(id, entry);
      const remove = () => { if (reads.get(id) === entry) reads.delete(id); };
      entry.promise.then(remove, remove);
    }
    entry.users += 1;
    return {
      promise: entry.promise,
      release() {
        entry.users -= 1;
        if (!entry.users && reads.get(id) === entry) {
          reads.delete(id);
          entry.source.cancel('observation-ended');
        }
      },
    };
  }
  function wait(id, options = {}) {
    const budget = options.timeoutMs === undefined ? timeoutMs : options.timeoutMs;
    return new Promise((resolve, reject) => {
      let ended = false; let timer; let deadline; let read;
      const finish = (error, receipt) => {
        if (ended) return;
        ended = true; clearTimeout(timer); clearTimeout(deadline);
        if (read) { read.release(); read = null; }
        if (error) reject(error); else resolve(receipt);
      };
      const poll = () => {
        if (ended) return;
        read = acquire(id);
        read.promise.then(value => {
          const receipt = value || { status: 'unknown' };
          if (ended) return;
          read.release(); read = null;
          if (receipt.status === 'settled' && receipt.outcome === 'completed') { finish(null, receipt); return; }
          if (['not-accepted', 'rejected', 'expired', 'interrupted'].includes(receipt.status) ||
              receipt.status === 'settled' || (receipt.status === 'unknown' && receipt.reason !== 'unavailable')) {
            const reason = receipt.outcome === 'failed' ? 'apply-failed' : (receipt.reason || 'outcome-unknown');
            finish(operationError(id, reason, receipt.status)); return;
          }
          timer = setTimeout(poll, intervalMs);
        }, () => {
          if (ended) return;
          read.release(); read = null;
          timer = setTimeout(poll, intervalMs);
        });
      };
      deadline = setTimeout(() => finish(operationError(id)), Math.max(0, budget));
      const token = options.cancelToken;
      if (token) {
        if (token.reason) { finish(token.reason); return; }
        // axios 0.21 CancelToken has a Promise rather than an unsubscribe API.
        token.promise.then(cancel => finish(cancel));
      }
      poll();
    });
  }
  return { wait, size: () => reads.size };
}
