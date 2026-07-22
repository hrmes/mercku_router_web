const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { expect } = require('chai');
const Ajv = require('ajv');

const identitySchema = require('../../../unified/src/app/identity/contract.schema.json');
const {
  CAPABILITY_KEYS,
  CUSTOMER_DISABLEABLE_CAPABILITIES,
} = require('../../../unified/src/app/profiles/capabilities.js');

const FIXTURES_DIR = path.resolve(process.cwd(), 'tests/fixtures/runtime-config');
const VALIDATE_SCRIPT = path.resolve(process.cwd(), 'scripts/validate-runtime-config.mjs');

function readFixture(name) {
  const filePath = path.resolve(FIXTURES_DIR, name);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function makeValidator(schema) {
  const ajv = new Ajv({ allErrors: true, strict: false });
  return ajv.compile(schema);
}

// ajv 6 uses dataPath (dot notation); ajv 7+ uses instancePath (slash notation).
// Return whichever is present so tests are robust to either version.
function errorPath(e) {
  return e.instancePath || e.dataPath || '';
}

describe('identity contract (v1)', () => {
  describe('capabilities.js source of truth', () => {
    it('exposes CAPABILITY_KEYS as a frozen array of v1 keys', () => {
      expect(CAPABILITY_KEYS).to.be.an('array');
      expect(Object.isFrozen(CAPABILITY_KEYS)).to.equal(true);
      expect([...CAPABILITY_KEYS]).to.deep.equal([
        'sfp',
        'poeControl',
        'fanControl',
        'frozenConfig',
      ]);
    });

    it('exposes CUSTOMER_DISABLEABLE_CAPABILITIES as a frozen array', () => {
      expect(CUSTOMER_DISABLEABLE_CAPABILITIES).to.be.an('array');
      expect(Object.isFrozen(CUSTOMER_DISABLEABLE_CAPABILITIES)).to.equal(true);
      expect([...CUSTOMER_DISABLEABLE_CAPABILITIES]).to.deep.equal([
        'sfp',
        'poeControl',
        'fanControl',
        'frozenConfig',
      ]);
    });
  });

  describe('schema shape', () => {
    it('locks schemaVersion to 1', () => {
      expect(identitySchema.properties.schemaVersion.const).to.equal(1);
    });

    it('requires version, revision, modelId, customerId, backend', () => {
      expect(identitySchema.required).to.deep.equal([
        'schemaVersion',
        'revision',
        'modelId',
        'customerId',
        'backend',
      ]);
    });

    it('rejects unknown top-level fields', () => {
      expect(identitySchema.additionalProperties).to.equal(false);
    });

    it('detectedCapabilities keys exactly match CAPABILITY_KEYS (no aliases)', () => {
      const detectedProps = identitySchema.properties.detectedCapabilities.properties;
      expect(Object.keys(detectedProps).sort()).to.deep.equal([...CAPABILITY_KEYS].sort());
      expect(identitySchema.properties.detectedCapabilities.additionalProperties).to.equal(false);
    });

    it('detectedCapabilities is optional', () => {
      expect(identitySchema.required).to.not.include('detectedCapabilities');
    });

    it('backend must be a non-empty string', () => {
      const backend = identitySchema.properties.backend;
      expect(backend.type).to.equal('string');
      expect(backend.minLength).to.be.greaterThan(0);
    });

    it('modelId, customerId, revision must be non-empty strings', () => {
      ['modelId', 'customerId', 'revision'].forEach((key) => {
        const prop = identitySchema.properties[key];
        expect(prop.type, `${key}.type`).to.equal('string');
        expect(prop.minLength, `${key}.minLength`).to.be.greaterThan(0);
      });
    });
  });

  describe('schema validation against fixtures', () => {
    let validate;

    beforeEach(() => {
      validate = makeValidator(identitySchema);
    });

    it('accepts a fully valid identity with detectedCapabilities', () => {
      const ok = validate(readFixture('valid.v1.json'));
      expect(validate.errors, JSON.stringify(validate.errors)).to.equal(null);
      expect(ok).to.equal(true);
    });

    it('accepts a minimal identity without detectedCapabilities', () => {
      const ok = validate(readFixture('valid-minimal.v1.json'));
      expect(validate.errors, JSON.stringify(validate.errors)).to.equal(null);
      expect(ok).to.equal(true);
    });

    it('rejects a missing modelId', () => {
      const ok = validate(readFixture('missing-model-id.v1.json'));
      expect(ok).to.equal(false);
      const missingKeyword = validate.errors.find(
        (e) => e.keyword === 'required' && e.params.missingProperty === 'modelId'
      );
      expect(missingKeyword, 'expected required:modelId error').to.not.equal(undefined);
    });

    it('rejects an unknown top-level field', () => {
      const ok = validate(readFixture('unknown-field.v1.json'));
      expect(ok).to.equal(false);
      const additional = validate.errors.find((e) => e.keyword === 'additionalProperties');
      expect(additional, 'expected additionalProperties error').to.not.equal(undefined);
    });

    it('rejects an unknown detected capability key', () => {
      const ok = validate(readFixture('invalid-detected-capability.v1.json'));
      expect(ok).to.equal(false);
      const additional = validate.errors.find(
        (e) =>
          e.keyword === 'additionalProperties'
          && errorPath(e).includes('detectedCapabilities')
      );
      expect(additional, 'expected additionalProperties error inside detectedCapabilities').to.not.equal(
        undefined
      );
    });

    it('rejects an empty or non-string backend', () => {
      const ok = validate(readFixture('invalid-backend.v1.json'));
      expect(ok).to.equal(false);
      const backendError = validate.errors.find(
        (e) => errorPath(e).endsWith('backend')
      );
      expect(backendError, 'expected backend error').to.not.equal(undefined);
    });

    it('rejects a wrong schemaVersion', () => {
      const data = readFixture('valid.v1.json');
      const bad = { ...data, schemaVersion: 2 };
      const ok = validate(bad);
      expect(ok).to.equal(false);
    });
  });

  describe('backend mismatch produces warning, not failure', () => {
    it('CLI exits 0 when backend mismatches expectedBackends but prints a warning', () => {
      const fixture = readFixture('valid.v1.json');
      const output = execFileSync(
        process.execPath,
        [
          VALIDATE_SCRIPT,
          path.resolve(FIXTURES_DIR, 'valid.v1.json'),
          '--expected-backends',
          'some_other_backend',
        ],
        { encoding: 'utf8' }
      );
      expect(output).to.match(/warning/i);
      // Sanity: the fixture's backend is genuinely different.
      expect(fixture.backend).to.not.equal('some_other_backend');
    });

    it('CLI exits 0 and prints no warning when backend matches expectedBackends', () => {
      const fixture = readFixture('valid.v1.json');
      const output = execFileSync(
        process.execPath,
        [
          VALIDATE_SCRIPT,
          path.resolve(FIXTURES_DIR, 'valid.v1.json'),
          '--expected-backends',
          fixture.backend,
        ],
        { encoding: 'utf8' }
      );
      expect(output).to.not.match(/warning/i);
    });
  });

  describe('validate-runtime-config CLI', () => {
    it('exits 0 for a valid identity', () => {
      const output = execFileSync(
        process.execPath,
        [VALIDATE_SCRIPT, path.resolve(FIXTURES_DIR, 'valid.v1.json')],
        { encoding: 'utf8' }
      );
      expect(output).to.match(/valid/i);
    });

    it('exits non-zero for a missing-modelId identity', () => {
      expect(() => {
        execFileSync(
          process.execPath,
          [VALIDATE_SCRIPT, path.resolve(FIXTURES_DIR, 'missing-model-id.v1.json')],
          { encoding: 'utf8' }
        );
      }).to.throw();
    });

    it('exits non-zero for an unknown-field identity', () => {
      expect(() => {
        execFileSync(
          process.execPath,
          [VALIDATE_SCRIPT, path.resolve(FIXTURES_DIR, 'unknown-field.v1.json')],
          { encoding: 'utf8' }
        );
      }).to.throw();
    });

    it('exits non-zero for an invalid detected capability', () => {
      expect(() => {
        execFileSync(
          process.execPath,
          [VALIDATE_SCRIPT, path.resolve(FIXTURES_DIR, 'invalid-detected-capability.v1.json')],
          { encoding: 'utf8' }
        );
      }).to.throw();
    });

    it('exits non-zero for an invalid backend', () => {
      expect(() => {
        execFileSync(
          process.execPath,
          [VALIDATE_SCRIPT, path.resolve(FIXTURES_DIR, 'invalid-backend.v1.json')],
          { encoding: 'utf8' }
        );
      }).to.throw();
    });
  });
});
