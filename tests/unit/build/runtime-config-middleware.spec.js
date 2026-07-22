const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const { expect } = require('chai');

const serveIdentityFixture = require('../../../unified/dev/runtime-config-middleware.js');

// Use process.cwd() (NOT __dirname) for repo-relative path resolution in tests.
// mocha-webpack bundles test files, which rewrites both `__dirname` and
// `process.env.MERCKU_IDENTITY_FIXTURE` inside the bundle (vue-cli's DefinePlugin
// replaces `process.env` with a literal object). The test command runs from the
// repo root, so process.cwd() is reliable here. This matches the convention
// used by tests/unit/identity/contract.spec.js and tests/unit/build/id-boundaries.spec.js.
const REPO_ROOT = process.cwd();
const FIXTURES_DIR = path.resolve(REPO_ROOT, 'tests/fixtures/runtime-config');

function mockReq(method = 'GET', url = '/runtime-config.v1.json') {
  return { method, path: url };
}

function mockRes() {
  const headers = {};
  const state = { status: 0, body: null, ended: false };
  return {
    status(code) { state.status = code; return this; },
    setHeader(name, value) { headers[name] = value; return this; },
    end(data) { state.body = data; state.ended = true; return this; },
    _status: () => state.status,
    _headers: headers,
    _body: () => state.body,
    _ended: () => state.ended,
  };
}

/**
 * Run the middleware in a real Node child process (NOT webpack-bundled) so
 * `__dirname` inside the middleware resolves to its real filesystem location
 * (`<repo>/unified/dev/`) and `process.env.MERCKU_IDENTITY_FIXTURE` is read
 * at runtime instead of being replaced at build time by DefinePlugin.
 *
 * @param {Object} opts
 * @param {string} [opts.cwd]       cwd for the child process (default: repo root)
 * @param {Object} [opts.fixture]   value for MERCKU_IDENTITY_FIXTURE (default: unset)
 * @returns {{ status: number, body: string }} mock response state
 */
function runMiddlewareInChild({ cwd, fixture } = {}) {
  const middlewarePath = path.resolve(REPO_ROOT, 'unified/dev/runtime-config-middleware.js');
  const helper = [
    `const serve = require(${JSON.stringify(middlewarePath)});`,
    'const req = { method: \'GET\', path: \'/runtime-config.v1.json\' };',
    'const state = { status: 0, body: \'\' };',
    'const res = {',
    '  status(c) { state.status = c; return this; },',
    '  setHeader() { return this; },',
    '  end(b) { state.body = b; return this; },',
    '};',
    'serve(req, res, () => {});',
    'process.stdout.write(JSON.stringify(state));',
  ].join('\n');
  // `...process.env` inside the bundle spreads the DefinePlugin-replaced object
  // (just NODE_ENV/BASE_URL). The child only needs these to run node, and we
  // explicitly add MERCKU_IDENTITY_FIXTURE when provided.
  const childEnv = { ...process.env };
  delete childEnv.MERCKU_IDENTITY_FIXTURE;
  if (fixture !== undefined) childEnv.MERCKU_IDENTITY_FIXTURE = fixture;
  const output = execFileSync(
    process.execPath,
    ['-e', helper],
    { encoding: 'utf8', cwd: cwd || REPO_ROOT, env: childEnv }
  );
  return JSON.parse(output);
}

describe('runtime-config-middleware (dev)', () => {
  describe('default fixture path', () => {
    it('resolves the default fixture to an existing file at the repo root', () => {
      // The default fixture must live at <repo>/tests/fixtures/runtime-config/valid.v1.json.
      // The middleware resolves this via __dirname (two levels up from unified/dev/),
      // NOT via process.cwd() — the dev script's `cd unified` would otherwise break it.
      const defaultFixture = path.resolve(FIXTURES_DIR, 'valid.v1.json');
      expect(fs.existsSync(defaultFixture), `${defaultFixture} must exist`).to.equal(true);
    });

    it('serves the default fixture with 200 + valid JSON (real Node process)', () => {
      // Run in a child process so the middleware's __dirname is the real
      // filesystem path, not webpack's rewritten value.
      const state = runMiddlewareInChild();
      expect(state.status).to.equal(200);
      const parsed = JSON.parse(state.body);
      expect(parsed.schemaVersion).to.equal(1);
      expect(parsed.modelId).to.be.a('string');
      expect(parsed.customerId).to.be.a('string');
      expect(parsed.backend).to.be.a('string');
    });

    it('serves the default fixture even when process.cwd() is <repo>/unified (regression guard)', () => {
      // The dev script is `cd unified && vue-cli-service serve`, so process.cwd()
      // at runtime is <repo>/unified/. The OLD code used process.cwd() to resolve
      // the default fixture and returned 500 because <repo>/unified/tests/fixtures
      // does not exist. The fix uses __dirname, which is cwd-independent.
      //
      // We spawn a child node process with cwd = <repo>/unified/ to reproduce the
      // dev-server cwd and verify the middleware still serves 200. This test
      // would FAIL against the pre-fix code (which used process.cwd()).
      const unifiedDir = path.resolve(REPO_ROOT, 'unified');
      const state = runMiddlewareInChild({ cwd: unifiedDir });
      expect(state.status, 'middleware must return 200 from <repo>/unified cwd').to.equal(200);
      const parsed = JSON.parse(state.body);
      expect(parsed.schemaVersion).to.equal(1);
    });
  });

  describe('routing (in-process, no fixture read)', () => {
    // These tests do not touch process.env or __dirname, so they are safe to
    // run in-process under mocha-webpack.
    it('calls next() for non-identity paths', () => {
      const req = mockReq('GET', '/some-other-path');
      const res = mockRes();
      let nextCalled = false;
      serveIdentityFixture(req, res, () => { nextCalled = true; });
      expect(nextCalled).to.equal(true);
      expect(res._ended(), 'response must not be ended').to.equal(false);
    });

    it('calls next() for non-GET methods on the identity path', () => {
      const req = mockReq('POST', '/runtime-config.v1.json');
      const res = mockRes();
      let nextCalled = false;
      serveIdentityFixture(req, res, () => { nextCalled = true; });
      expect(nextCalled).to.equal(true);
      expect(res._ended()).to.equal(false);
    });
  });

  describe('MERCKU_IDENTITY_FIXTURE override (real Node process)', () => {
    // Run in a child process because vue-cli's DefinePlugin replaces
    // `process.env` in the bundle, so in-process writes to
    // `process.env.MERCKU_IDENTITY_FIXTURE` are no-ops.
    it('serves a repo-relative fixture path when MERCKU_IDENTITY_FIXTURE is set', () => {
      const state = runMiddlewareInChild({
        fixture: 'tests/fixtures/runtime-config/valid-minimal.v1.json',
      });
      expect(state.status).to.equal(200);
      const parsed = JSON.parse(state.body);
      // valid-minimal.v1.json has no detectedCapabilities
      expect(parsed.detectedCapabilities).to.equal(undefined);
    });

    it('returns 500 when the configured fixture does not exist', () => {
      const state = runMiddlewareInChild({
        fixture: 'tests/fixtures/runtime-config/does-not-exist.json',
      });
      expect(state.status).to.equal(500);
      const parsed = JSON.parse(state.body);
      expect(parsed.error).to.equal('identity-fixture-missing');
    });
  });
});
