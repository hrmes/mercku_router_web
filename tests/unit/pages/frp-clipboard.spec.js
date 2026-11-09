/* eslint-env mocha */
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function createRuntime(clipboard, commandResult = true) {
  const calls = [];
  const active = {
    selectionStart: 1,
    selectionEnd: 3,
    focus() { calls.push('restore-focus'); },
    setSelectionRange(start, end) { calls.push([start, end]); }
  };
  const document = {
    activeElement: active,
    body: {
      appendChild() { calls.push('append'); },
      removeChild() { calls.push('remove'); }
    },
    createElement() {
      return {
        style: {},
        setAttribute() {},
        select() { calls.push(this.value); }
      };
    },
    execCommand(command) { calls.push(command); return commandResult; }
  };
  const source = fs.readFileSync(path.resolve(process.cwd(), 'base/src/util/clipboard.js'), 'utf8');
  const copyText = vm.runInNewContext(
    `${source.replace('export default function', 'function')}\ncopyText;`,
    { navigator: { clipboard }, document }
  );
  return { copyText, calls };
}

describe('FRP proxy name clipboard support', () => {
  it('uses the modern clipboard API without changing focus', async () => {
    const writes = [];
    const runtime = createRuntime({
      writeText: text => { writes.push(text); return Promise.resolve(); }
    });
    expect(await runtime.copyText('office_web')).to.equal(true);
    expect(writes).to.deep.equal(['office_web']);
    expect(runtime.calls).to.deep.equal([]);
  });

  it('copies on HTTP pages without the modern API and restores the current selection', async () => {
    const runtime = createRuntime(undefined);
    expect(await runtime.copyText('office_web')).to.equal(true);
    expect(runtime.calls).to.deep.equal(['append', 'office_web', 'copy', 'remove', 'restore-focus', [1, 3]]);
  });

  it('falls back when clipboard permissions are denied', async () => {
    const runtime = createRuntime({ writeText: () => Promise.reject(new Error('denied')) });
    expect(await runtime.copyText('office_ssh')).to.equal(true);
    expect(runtime.calls).to.include('office_ssh');
    expect(runtime.calls).to.include('remove');
  });

  it('reports unsuccessful copying and removes its temporary input', async () => {
    const runtime = createRuntime(undefined, false);
    expect(await runtime.copyText('office_web')).to.equal(false);
    expect(runtime.calls).to.include('remove');
  });
});
