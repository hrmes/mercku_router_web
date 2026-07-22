const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');
const { expect } = require('chai');

const CHECKER_SCRIPT = path.resolve(
  process.cwd(),
  'scripts/check-unified-id-boundaries.mjs'
);

/**
 * Builds a throwaway unified/src tree in the OS temp dir and runs the boundary
 * checker against it. Returns { status, stdout, stderr }.
 *
 * Layout produced:
 *   <root>/unified/src/profiles/models/registry.js      (declaredIds)
 *   <root>/unified/src/profiles/customers/registry.js   (declaredIds)
 *   <root>/unified/src/<relativePath>                   (fileContents)
 *
 * @param {object} opts
 * @param {string[]} opts.modelIds       IDs to declare in models/registry.js
 * @param {string[]} opts.customerIds    IDs to declare in customers/registry.js
 * @param {Array<{path: string, content: string}>} opts.files  extra files under unified/src
 */
function runChecker({ modelIds = [], customerIds = [], files = [] } = {}) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'unified-ids-'));
  const unifiedSrc = path.resolve(tmp, 'unified/src');
  const modelsDir = path.resolve(unifiedSrc, 'profiles/models');
  const customersDir = path.resolve(unifiedSrc, 'profiles/customers');
  fs.mkdirSync(modelsDir, { recursive: true });
  fs.mkdirSync(customersDir, { recursive: true });

  const modelRegistry = `export const modelProfileLoaders = Object.freeze({${
    modelIds.map((id) => `${id}: () => import('./${id}/profile.json')`).join(',\n')
  }});\n`;
  const customerRegistry = `export const customerProfileLoaders = Object.freeze({${
    customerIds.map((id) => `'${id}': () => import('./${id}')`).join(',\n')
  }});\n`;
  fs.writeFileSync(path.resolve(modelsDir, 'registry.js'), modelRegistry);
  fs.writeFileSync(path.resolve(customersDir, 'registry.js'), customerRegistry);

  files.forEach(({ path: relPath, content }) => {
    const abs = path.resolve(unifiedSrc, relPath);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content);
  });

  let status;
  let stdout = '';
  let stderr = '';
  try {
    stdout = execFileSync(
      process.execPath,
      [CHECKER_SCRIPT],
      {
        encoding: 'utf8',
        env: {
          ...process.env,
          MERCKU_UNIFIED_SRC: unifiedSrc,
        },
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

describe('scripts/check-unified-id-boundaries.mjs', () => {
  it('exits 0 when unified/src is clean (no IDs, no MODEL_ID/CUSTOMER_ID literals)', () => {
    const { status } = runChecker({
      modelIds: ['M11R4'],
      customerIds: ['0007'],
      files: [
        {
          path: 'app/bootstrap.js',
          content: 'export const bootstrap = () => null;\n',
        },
      ],
    });
    expect(status, 'clean tree must exit 0').to.equal(0);
  });

  it('exits 0 when registries are empty (no IDs to check) and src is clean', () => {
    const { status } = runChecker({
      modelIds: [],
      customerIds: [],
      files: [
        {
          path: 'app/bootstrap.js',
          content: 'export const bootstrap = () => null;\n',
        },
      ],
    });
    expect(status).to.equal(0);
  });

  it('rejects `if (modelId === \'M11R4\')` when M11R4 is a known model ID', () => {
    const { status, stdout } = runChecker({
      modelIds: ['M11R4'],
      customerIds: [],
      files: [
        {
          path: 'pages/dashboard.vue',
          content:
            '<template><div /></template>\n<script>if (modelId === \'M11R4\') { console.log(\'no\'); }</script>\n',
        },
      ],
    });
    expect(status, 'must exit non-zero on concrete ID branch').to.not.equal(0);
    expect(stdout).to.match(/M11R4/);
  });

  it('rejects the literal MODEL_ID token in non-profile code', () => {
    const { status, stdout } = runChecker({
      modelIds: [],
      customerIds: [],
      files: [
        {
          path: 'app/some-file.js',
          content: 'const x = process.env.MODEL_ID;\n',
        },
      ],
    });
    expect(status).to.not.equal(0);
    expect(stdout).to.match(/MODEL_ID/);
  });

  it('rejects the literal CUSTOMER_ID token in non-profile code', () => {
    const { status, stdout } = runChecker({
      modelIds: [],
      customerIds: [],
      files: [
        {
          path: 'app/some-file.js',
          content: 'const x = process.env.CUSTOMER_ID;\n',
        },
      ],
    });
    expect(status).to.not.equal(0);
    expect(stdout).to.match(/CUSTOMER_ID/);
  });

  it('does NOT scan profiles/models/ and profiles/customers/ subdirectories', () => {
    // Registry files themselves contain the IDs; they must not flag themselves.
    const { status, stdout } = runChecker({
      modelIds: ['M11R4'],
      customerIds: ['0007'],
      files: [
        {
          path: 'profiles/models/M11R4/profile.json',
          content: JSON.stringify({ modelId: 'M11R4' }),
        },
        {
          path: 'profiles/customers/0007/profile.json',
          content: JSON.stringify({ customerId: '0007' }),
        },
      ],
    });
    expect(status, 'profile subdirs must be excluded from the scan').to.equal(0);
    expect(stdout).to.not.match(/M11R4/);
  });

  it('rejects a concrete customer ID branch outside profiles/', () => {
    const { status, stdout } = runChecker({
      modelIds: [],
      customerIds: ['0007'],
      files: [
        {
          path: 'app/menu.js',
          content: 'export const isMercku = customerId === \'0007\';\n',
        },
      ],
    });
    expect(status).to.not.equal(0);
    expect(stdout).to.match(/0007/);
  });
});
