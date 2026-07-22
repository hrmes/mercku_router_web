const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');
const { expect } = require('chai');

const VALIDATE_PROFILES_SCRIPT = path.resolve(process.cwd(), 'scripts/validate-profiles.mjs');

/**
 * Build a throwaway profiles root in the OS temp dir and run the validator
 * against it. Returns { status, stdout, stderr }.
 *
 * Layout produced:
 *   <root>/customers/registry.js          (registryContents)
 *   <root>/customers/<id>/profile.json    (per profile)
 *   <root>/customers/<id>/index.js
 *   <root>/customers/<id>/assets/...      (per assets map)
 *   <root>/models/registry.js             (when modelProfiles supplied)
 *   <root>/models/<id>/profile.json       (per model profile — NO index.js,
 *                                          NO assets; Model registry loads
 *                                          profile.json directly)
 *
 * `profiles` (customers) is an array of:
 *   { id, profileJson, indexJs?, assets? (map of filename → content),
 *     skipIndex?, skipAssets? }
 *
 * `modelProfiles` is an array of:
 *   { id, profileJson? }
 */
function runValidator({
  profiles = [],
  registryIds = null,
  modelProfiles = [],
  modelRegistryIds = null,
  extraFiles = [],
} = {}) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'unified-validate-'));
  const customersDir = path.resolve(tmp, 'customers');
  const modelsDir = path.resolve(tmp, 'models');
  fs.mkdirSync(customersDir, { recursive: true });
  fs.mkdirSync(modelsDir, { recursive: true });

  // Build customers/registry.js. If registryIds is null, derive from profiles.
  const ids = registryIds || profiles.map((p) => p.id);
  const registryContents = `export const customerProfileLoaders = Object.freeze({
${ids.map((id) => `  '${id}': () => import('./${id}'),`).join('\n')}
});
`;
  fs.writeFileSync(path.resolve(customersDir, 'registry.js'), registryContents);

  profiles.forEach((p) => {
    const profileDir = path.resolve(customersDir, p.id);
    fs.mkdirSync(profileDir, { recursive: true });
    if (p.profileJson !== undefined) {
      fs.writeFileSync(
        path.resolve(profileDir, 'profile.json'),
        typeof p.profileJson === 'string' ? p.profileJson : JSON.stringify(p.profileJson)
      );
    }
    if (!p.skipIndex) {
      fs.writeFileSync(
        path.resolve(profileDir, 'index.js'),
        p.indexJs || "import p from './profile.json';\nexport default p;\n"
      );
    }
    if (!p.skipAssets) {
      const assetsDir = path.resolve(profileDir, 'assets');
      fs.mkdirSync(assetsDir, { recursive: true });
      const assets = p.assets || { 'favicon.ico': 'fake-ico', 'logo.png': 'fake-png' };
      Object.entries(assets).forEach(([name, content]) => {
        fs.writeFileSync(path.resolve(assetsDir, name), content);
      });
    }
  });

  // Build models/registry.js + per-model profile.json (NO index.js, NO assets).
  // Model Profile loaders do `import('./<id>/profile.json')` directly.
  const modelIds = modelRegistryIds || modelProfiles.map((p) => p.id);
  if (modelIds.length > 0) {
    const modelRegistryContents = `export const modelProfileLoaders = Object.freeze({
${modelIds.map((id) => `  ${id}: () => import('./${id}/profile.json'),`).join('\n')}
});
`;
    fs.writeFileSync(path.resolve(modelsDir, 'registry.js'), modelRegistryContents);
  }

  modelProfiles.forEach((p) => {
    const profileDir = path.resolve(modelsDir, p.id);
    fs.mkdirSync(profileDir, { recursive: true });
    if (p.profileJson !== undefined) {
      fs.writeFileSync(
        path.resolve(profileDir, 'profile.json'),
        typeof p.profileJson === 'string' ? p.profileJson : JSON.stringify(p.profileJson)
      );
    }
    // Intentionally NO index.js and NO assets for model profiles.
  });

  extraFiles.forEach(({ path: relPath, content }) => {
    const abs = path.resolve(tmp, relPath);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content);
  });

  let status;
  let stdout = '';
  let stderr = '';
  try {
    stdout = execFileSync(
      process.execPath,
      [VALIDATE_PROFILES_SCRIPT],
      {
        encoding: 'utf8',
        env: { ...process.env, MERCKU_PROFILES_ROOT: tmp },
      }
    );
    status = 0;
  } catch (err) {
    status = err.status === undefined ? 1 : err.status;
    stdout = err.stdout ? err.stdout.toString('utf8') : '';
    stderr = err.stderr ? err.stderr.toString('utf8') : '';
  }

  return { status, stdout, stderr, tmp };
}

const VALID_CUSTOMER_PROFILE = {
  profileVersion: 1,
  branding: {
    productName: 'Router',
    wifiName: 'Router Wi-Fi',
    website: { text: 'Support', url: 'https://example.invalid' },
    policyUrl: '',
    appDownloadUrl: '',
    languages: ['en-US'],
    defaultLanguage: 'en-US',
    theme: { '--brand-primary': '#333333', '--brand-loading': '#333333' },
  },
  policy: {
    disabledCapabilities: [],
    allow2LevelAdmin: false,
    allowTelnet: false,
  },
};

const VALID_MODEL_PROFILE = {
  profileVersion: 1,
  expectedBackends: ['mercku_mtk7621'],
  capabilities: {
    sfp: false,
    poeControl: false,
    fanControl: false,
    frozenConfig: false,
  },
  behavior: {
    upgradeProbeStartDelayMs: 20000,
    modeSwitchProbeStartDelayMs: 30000,
    reconnectProbeTimeoutMs: 600000,
  },
  pageVariants: {},
};

describe('validate-profiles CLI (asset + registry correspondence checks)', () => {
  it('exits 0 when a customer profile has profile.json, index.js, and assets/favicon.ico + assets/logo.png', () => {
    const { status, stdout } = runValidator({
      profiles: [{ id: '0001', profileJson: VALID_CUSTOMER_PROFILE }],
    });
    expect(status, `stdout=${stdout}`).to.equal(0);
    expect(stdout).to.match(/valid:/);
  });

  it('exits 0 when a customer profile has assets/favicon.ico + assets/logo.svg (svg variant)', () => {
    const { status, stdout } = runValidator({
      profiles: [
        {
          id: '0001',
          profileJson: VALID_CUSTOMER_PROFILE,
          assets: { 'favicon.ico': 'fake', 'logo.svg': '<svg/>' },
        },
      ],
    });
    expect(status, `stdout=${stdout}`).to.equal(0);
  });

  it('fails when a customer profile directory is missing index.js', () => {
    const { status, stderr } = runValidator({
      profiles: [{ id: '0001', profileJson: VALID_CUSTOMER_PROFILE, skipIndex: true }],
    });
    expect(status).to.not.equal(0);
    expect(stderr).to.match(/missing.*index\.js|index\.js.*missing/i);
  });

  it('fails when a customer profile directory is missing profile.json', () => {
    const { status, stderr } = runValidator({
      profiles: [{ id: '0001', profileJson: undefined, skipIndex: false }],
    });
    expect(status).to.not.equal(0);
  });

  it('fails when a customer profile assets directory is missing favicon.ico', () => {
    const { status, stderr } = runValidator({
      profiles: [
        {
          id: '0001',
          profileJson: VALID_CUSTOMER_PROFILE,
          assets: { 'logo.png': 'fake' },
        },
      ],
    });
    expect(status).to.not.equal(0);
    expect(stderr).to.match(/favicon\.ico/i);
  });

  it('fails when a customer profile assets directory has neither logo.png nor logo.svg', () => {
    const { status, stderr } = runValidator({
      profiles: [
        {
          id: '0001',
          profileJson: VALID_CUSTOMER_PROFILE,
          assets: { 'favicon.ico': 'fake' },
        },
      ],
    });
    expect(status).to.not.equal(0);
    expect(stderr).to.match(/logo\.(png|svg)/i);
  });

  it('fails when a registry key has no corresponding profile directory', () => {
    const { status, stderr } = runValidator({
      registryIds: ['0001', '0002'],
      profiles: [{ id: '0001', profileJson: VALID_CUSTOMER_PROFILE }],
    });
    expect(status).to.not.equal(0);
    expect(stderr).to.match(/0002/);
  });

  it('skips the assets check for the neutral profile (uses shared default assets)', () => {
    const { status, stdout } = runValidator({
      // neutral is not in the registry, but the validator should still
      // accept its directory without an assets/ subdirectory.
      profiles: [
        { id: '0001', profileJson: VALID_CUSTOMER_PROFILE },
        { id: 'neutral', profileJson: VALID_CUSTOMER_PROFILE, skipAssets: true },
      ],
    });
    expect(status, `stdout=${stdout}`).to.equal(0);
  });

  it('fails when a profile directory exists but is not declared in the registry (excluding neutral)', () => {
    const { status, stderr } = runValidator({
      registryIds: ['0001'],
      profiles: [
        { id: '0001', profileJson: VALID_CUSTOMER_PROFILE },
        { id: '0029', profileJson: VALID_CUSTOMER_PROFILE },
      ],
    });
    expect(status).to.not.equal(0);
    expect(stderr).to.match(/0029/);
  });
});

describe('validate-profiles CLI (model profile structure — no index.js, no assets)', () => {
  it('exits 0 when a model profile has ONLY profile.json (no index.js, no assets)', () => {
    const { status, stdout } = runValidator({
      modelProfiles: [{ id: 'M11R4', profileJson: VALID_MODEL_PROFILE }],
    });
    expect(status, `stdout=${stdout}`).to.equal(0);
    expect(stdout).to.match(/valid:/);
  });

  it('exits 0 for two model profiles (baseline + fanControl variant) with only profile.json each', () => {
    const { status, stdout } = runValidator({
      modelProfiles: [
        { id: 'M11R4', profileJson: VALID_MODEL_PROFILE },
        { id: 'M13R0', profileJson: { ...VALID_MODEL_PROFILE, capabilities: { ...VALID_MODEL_PROFILE.capabilities, fanControl: true } } },
      ],
    });
    expect(status, `stdout=${stdout}`).to.equal(0);
    expect(stdout).to.match(/M11R4/);
    expect(stdout).to.match(/M13R0/);
  });

  it('fails when a model profile directory is missing profile.json', () => {
    const { status, stderr } = runValidator({
      modelProfiles: [{ id: 'M11R4', profileJson: undefined }],
    });
    expect(status).to.not.equal(0);
    expect(stderr).to.match(/profile\.json/);
  });

  it('fails when a model registry key has no corresponding profile directory', () => {
    const { status, stderr } = runValidator({
      modelRegistryIds: ['M11R4', 'M13R0'],
      modelProfiles: [{ id: 'M11R4', profileJson: VALID_MODEL_PROFILE }],
    });
    expect(status).to.not.equal(0);
    expect(stderr).to.match(/M13R0/);
  });

  it('fails when a model profile directory exists but is not declared in the registry', () => {
    const { status, stderr } = runValidator({
      modelRegistryIds: ['M11R4'],
      modelProfiles: [
        { id: 'M11R4', profileJson: VALID_MODEL_PROFILE },
        { id: 'M13R0', profileJson: VALID_MODEL_PROFILE },
      ],
    });
    expect(status).to.not.equal(0);
    expect(stderr).to.match(/M13R0/);
  });

  it('does NOT require index.js or assets for a model profile (registry loads profile.json directly)', () => {
    // This is the positive counterpart to the customer-side index.js check.
    // A model dir with only profile.json must pass; if the validator regressed
    // to require index.js for models, this test would fail.
    const { status, stderr } = runValidator({
      modelProfiles: [{ id: 'M11R4', profileJson: VALID_MODEL_PROFILE }],
    });
    expect(status, `stderr=${stderr}`).to.equal(0);
    expect(stderr).to.not.match(/index\.js/);
    expect(stderr).to.not.match(/assets/);
  });

  it('fails schema validation when a model profile has an unknown capability', () => {
    const { status, stderr } = runValidator({
      modelProfiles: [
        {
          id: 'M11R4',
          profileJson: {
            ...VALID_MODEL_PROFILE,
            capabilities: { ...VALID_MODEL_PROFILE.capabilities, sfpApi: true },
          },
        },
      ],
    });
    expect(status).to.not.equal(0);
    expect(stderr).to.match(/sfpApi|additional properties/i);
  });
});
