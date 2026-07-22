/**
 * Dev-only Express middleware that serves a selected Identity fixture as
 * `/runtime-config.v1.json`.
 *
 * Production builds never select a fixture — the device suite serves the real
 * identity at runtime. This middleware exists purely so `npm run dev:unified`
 * can boot the bootstrap flow against a known-good identity without a device.
 *
 * Configuration:
 *   MERCKU_IDENTITY_FIXTURE — absolute or repo-relative path to a v1 identity
 *     JSON fixture. Defaults to `tests/fixtures/runtime-config/valid.v1.json`.
 *     Relative paths resolve against the repository root (NOT the `cd unified`
 *     cwd that the dev script uses).
 *
 * The fixture is re-read on every request so switching fixtures does not
 * require restarting the dev server. Responses carry `Cache-Control: no-store`
 * so the browser always re-fetches.
 */
const fs = require('fs');
const path = require('path');

// `__dirname` is `<repo>/unified/dev/`. Resolve repo-relative paths from the
// repo root (two levels up) so the dev script's `cd unified` cwd change does
// not break fixture lookup. `process.cwd()` would point at `<repo>/unified/`
// and miss `tests/fixtures/...` which lives at the repo root.
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const DEFAULT_FIXTURE = path.resolve(
  REPO_ROOT,
  'tests/fixtures/runtime-config/valid.v1.json'
);

function resolveFixturePath() {
  const configured = process.env.MERCKU_IDENTITY_FIXTURE;
  if (!configured) return DEFAULT_FIXTURE;
  return path.isAbsolute(configured)
    ? configured
    : path.resolve(REPO_ROOT, configured);
}

function serveIdentityFixture(req, res, next) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    next();
    return;
  }
  if (req.path !== '/runtime-config.v1.json') {
    next();
    return;
  }
  const fixturePath = resolveFixturePath();
  let raw;
  try {
    raw = fs.readFileSync(fixturePath, 'utf8');
  } catch (err) {
    res.status(500);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(
      JSON.stringify({
        error: 'identity-fixture-missing',
        message: `Cannot read MERCKU_IDENTITY_FIXTURE at ${fixturePath}: ${err.message}`,
      })
    );
    return;
  }
  // Validate JSON shape before serving so a broken fixture doesn't look like
  // a real device response.
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    res.status(500);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(
      JSON.stringify({
        error: 'identity-fixture-invalid-json',
        message: `MERCKU_IDENTITY_FIXTURE at ${fixturePath} is not valid JSON: ${err.message}`,
      })
    );
    return;
  }
  res.status(200);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(parsed));
}

module.exports = serveIdentityFixture;
