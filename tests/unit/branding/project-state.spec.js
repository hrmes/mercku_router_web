const path = require('path');
const { execFileSync } = require('child_process');
const { expect } = require('chai');

// Project-state sanity checks: run the real CLIs against the real unified/src
// tree and assert they pass. These guard against regressions where a new file
// adds a concrete ID outside profiles/ or a profile directory loses a required
// file. The unit tests in validate-profiles.spec.js and id-boundaries.spec.js
// exercise the CLI logic with throwaway fixtures; these tests exercise the
// actual project state.

const VALIDATE_PROFILES_SCRIPT = path.resolve(process.cwd(), 'scripts/validate-profiles.mjs');
const CHECK_ID_BOUNDARIES_SCRIPT = path.resolve(process.cwd(), 'scripts/check-unified-id-boundaries.mjs');

describe('project state: real unified/src passes the static CLIs', () => {
  it('validate-profiles.mjs exits 0 against unified/src/profiles', () => {
    const output = execFileSync(process.execPath, [VALIDATE_PROFILES_SCRIPT], {
      encoding: 'utf8',
      env: { ...process.env, NODE_OPTIONS: '--openssl-legacy-provider' },
    });
    expect(output, 'expected both 0001 and neutral to be reported valid').to.match(/0001/);
    expect(output).to.match(/neutral/);
    expect(output).to.match(/valid:/);
  });

  it('check-unified-id-boundaries.mjs exits 0 against unified/src', () => {
    const output = execFileSync(process.execPath, [CHECK_ID_BOUNDARIES_SCRIPT], {
      encoding: 'utf8',
      env: { ...process.env, NODE_OPTIONS: '--openssl-legacy-provider' },
    });
    expect(output).to.match(/^ok:/);
  });
});
