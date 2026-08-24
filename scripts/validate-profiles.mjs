#!/usr/bin/env node
// Validate Model Profile and Customer Profile JSON files against their schemas.
//
// Usage:
//   node scripts/validate-profiles.mjs
//
// Environment:
//   MERCKU_PROFILES_ROOT — directory containing `models/` and `customers/`
//     subdirectories. Defaults to `unified/src/profiles`.
//
// Behaviour:
//   - If the profiles root or its `models/` and `customers/` subdirectories do
//     not exist, prints "no profiles found" and exits 0. This lets Task 2 ship
//     the script before any profiles exist (Task 3+ creates them).
//   - For every `<root>/models/<id>/profile.json`, validates against
//     model-profile.schema.json.
//   - For every `<root>/customers/<id>/profile.json`, validates against
//     customer-profile.schema.json.
//   - For every `<root>/<kind>/<id>/` directory, verifies `profile.json`
//     exists. Registered customers also require `index.js`, because webpack
//     uses it to attach assets. Model profiles and the neutral fallback load
//     their JSON directly.
//   - For every `<root>/customers/<id>/` directory EXCEPT `neutral`, verifies
//     the `assets/` directory exists and contains `favicon.ico` and at least
//     one of `logo.png`, `logo.svg` or `logo.webp`. `neutral` is exempt because it imports
//     the shared default assets from `unified/src/assets/branding/default/`.
//     (Task 4.)
//   - For every key declared in `customers/registry.js` (and, when populated,
//     `models/registry.js`), verifies the corresponding `<root>/<kind>/<key>/`
//     directory exists. (Task 4.)
//   - For every `<root>/customers/<id>/` directory EXCEPT `neutral`, verifies
//     `id` is declared in `customers/registry.js`. `neutral` is the fallback
//     for unknown customerId and is intentionally not in the registry. (Task 4.)
//   - Exits non-zero if any profile.json fails schema validation or cannot be
//     parsed, or if any of the structural checks above fail.
//
// The script reads JSON only; it does NOT import images or other binary assets
// into Node. Asset IMPORT verification is done by webpack-bundled unit tests
// (tests/unit/branding/customer-profile-index.spec.js).

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import Ajv from 'ajv';

const require = createRequire(import.meta.url);
const modelProfileSchema = require('../unified/src/app/profiles/model-profile.schema.json');
const customerProfileSchema = require('../unified/src/app/profiles/customer-profile.schema.json');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const profilesRoot = process.env.MERCKU_PROFILES_ROOT
  ? path.resolve(process.env.MERCKU_PROFILES_ROOT)
  : path.resolve(projectRoot, 'unified/src/profiles');

const modelsDir = path.resolve(profilesRoot, 'models');
const customersDir = path.resolve(profilesRoot, 'customers');

// `neutral` is an unregistered fail-closed fallback. Its loader attaches the
// shared default assets, so this directory only contains profile.json.
const NEUTRAL_ID = 'neutral';

function listProfileDirs(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((entry) => {
      const entryPath = path.resolve(dir, entry);
      return statSync(entryPath).isDirectory();
    });
}

function loadJson(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (err) {
    return { __loadError: err.message };
  }
}

function formatErrors(errors) {
  if (!errors) return '';
  return errors
    .map((e) => {
      const at = e.instancePath || e.dataPath || '<root>';
      return `  at ${at}: ${e.message} (${e.keyword})`;
    })
    .join('\n');
}

/**
 * Extract concrete ID keys declared in a registry file. Same regex as the
 * ID boundary checker: matches quoted / template / bare keys that appear
 * immediately after `{` or `,` so we don't pick up nested values like
 * `default: 'M11R4'`.
 */
function extractRegistryIds(registryPath) {
  if (!existsSync(registryPath)) return [];
  const content = readFileSync(registryPath, 'utf8');
  const ids = new Set();
  const keyRe = /(?:^|[{,])\s*(?:'([^']+)'|"([^"]+)"|`([^`]+)`|([A-Za-z_$][A-Za-z0-9_$]*))\s*:/gm;
  let match;
  while ((match = keyRe.exec(content)) !== null) {
    const id = match[1] || match[2] || match[3] || match[4];
    if (!id) continue;
    // Skip the well-known top-level export names that are not IDs.
    if (id === 'modelProfileLoaders' || id === 'customerProfileLoaders') continue;
    ids.add(id);
  }
  return [...ids];
}

const ajv = new Ajv({ allErrors: true, strict: false });
const validateModel = ajv.compile(modelProfileSchema);
const validateCustomer = ajv.compile(customerProfileSchema);

// Use listProfileDirs (not listProfileIds) for the early-exit check so that
// a directory missing profile.json still triggers the structural check
// rather than being silently treated as "no profiles found".
const modelDirs = listProfileDirs(modelsDir);
const customerDirs = listProfileDirs(customersDir);
const modelIds = modelDirs.filter((entry) =>
  existsSync(path.resolve(modelsDir, entry, 'profile.json'))
);
const customerIds = customerDirs.filter((entry) =>
  existsSync(path.resolve(customersDir, entry, 'profile.json'))
);

if (modelDirs.length === 0 && customerDirs.length === 0) {
  process.stdout.write('no profiles found\n');
  process.exit(0);
}

let failures = 0;

function fail(message) {
  process.stderr.write(`${message}\n`);
  failures += 1;
}

// --- Schema validation (Task 2/3 behaviour, unchanged) -------------------

modelIds.forEach((id) => {
  const profilePath = path.resolve(modelsDir, id, 'profile.json');
  const data = loadJson(profilePath);
  if (data.__loadError) {
    fail(`invalid: ${profilePath}: ${data.__loadError}`);
    return;
  }
  if (!validateModel(data)) {
    process.stderr.write(`invalid: ${profilePath}\n`);
    process.stderr.write(`${formatErrors(validateModel.errors)}\n`);
    failures += 1;
    return;
  }
  process.stdout.write(`valid: ${profilePath}\n`);
});

customerIds.forEach((id) => {
  const profilePath = path.resolve(customersDir, id, 'profile.json');
  const data = loadJson(profilePath);
  if (data.__loadError) {
    fail(`invalid: ${profilePath}: ${data.__loadError}`);
    return;
  }
  if (!validateCustomer(data)) {
    process.stderr.write(`invalid: ${profilePath}\n`);
    process.stderr.write(`${formatErrors(validateCustomer.errors)}\n`);
    failures += 1;
    return;
  }
  process.stdout.write(`valid: ${profilePath}\n`);
});

// --- Structural checks (Task 4) ------------------------------------------
//
// For both models/ and customers/:
//   1. Every `<dir>/<id>/` must have `profile.json`.
//   2. Every key in the registry must have a corresponding `<dir>/<key>/`.
//   3. Every `<dir>/<id>/` (except customers/neutral) must be declared in the
//      registry. (neutral is the unregistered fallback.)
// For registered customers only:
//   4. Every `<dir>/<id>/` must also have `index.js` (webpack assembles the
//      Customer Profile through index.js, which imports binary assets).
//   5. Every customers/<id>/ (except neutral) must have an `assets/` directory
//      containing `favicon.ico` and at least one of `logo.png` / `logo.svg` / `logo.webp`.
// Model Profile registry loaders do `import('./<id>/profile.json')` directly,
// so model dirs intentionally have NEITHER index.js NOR assets.

function checkStructural(kind, dir, registryPath) {
  if (!existsSync(dir)) return;

  const allDirs = listProfileDirs(dir);
  const registryIds = new Set(extractRegistryIds(registryPath));

  allDirs.forEach((id) => {
    const profileDir = path.resolve(dir, id);
    const profileJsonPath = path.resolve(profileDir, 'profile.json');
    const indexJsPath = path.resolve(profileDir, 'index.js');

    // profile.json (required for both models and customers)
    if (!existsSync(profileJsonPath)) {
      fail(`missing: ${path.relative(profilesRoot, profileJsonPath)} (profile.json is required)`);
    }
    // Neutral and models load profile.json directly.
    if (kind === 'customers' && id !== NEUTRAL_ID && !existsSync(indexJsPath)) {
      fail(`missing: ${path.relative(profilesRoot, indexJsPath)} (index.js is required for webpack to assemble the profile)`);
    }

    // Registry correspondence: every dir (except customers/neutral) must be
    // declared in the registry.
    if (kind === 'customers' && id === NEUTRAL_ID) {
      // neutral is intentionally not in the registry.
    } else if (!registryIds.has(id)) {
      fail(`registry mismatch: ${kind}/${id} directory exists but is not declared in ${path.basename(registryPath)}`);
    }

    // Asset existence (customers only, except neutral).
    if (kind === 'customers' && id !== NEUTRAL_ID) {
      const assetsDir = path.resolve(profileDir, 'assets');
      if (!existsSync(assetsDir) || !statSync(assetsDir).isDirectory()) {
        fail(`missing assets: ${path.relative(profilesRoot, assetsDir)} (customers/${id}/assets/ must exist)`);
        return;
      }
      const faviconPath = path.resolve(assetsDir, 'favicon.ico');
      if (!existsSync(faviconPath)) {
        fail(`missing asset: ${path.relative(profilesRoot, faviconPath)} (required by convention)`);
      }
      const logoCandidates = ['logo.png', 'logo.svg', 'logo.webp'];
      const logoFound = logoCandidates.find((name) =>
        existsSync(path.resolve(assetsDir, name))
      );
      if (!logoFound) {
        fail(`missing asset: ${path.relative(profilesRoot, assetsDir)}/ (${logoCandidates.join(' or ')} required)`);
      }
    }
  });

  // Reverse correspondence: every registry key must have a directory.
  registryIds.forEach((id) => {
    const profileDir = path.resolve(dir, id);
    if (!existsSync(profileDir) || !statSync(profileDir).isDirectory()) {
      fail(`registry mismatch: ${kind}/${id} is declared in ${path.basename(registryPath)} but no directory exists at ${path.relative(profilesRoot, profileDir)}`);
    }
  });
}

checkStructural('models', modelsDir, path.resolve(modelsDir, 'registry.js'));
checkStructural('customers', customersDir, path.resolve(customersDir, 'registry.js'));

if (failures > 0) {
  process.exit(1);
}
