const path = require('path');
const { execFileSync } = require('child_process');
const { expect } = require('chai');
const Ajv = require('ajv');

const modelProfileSchema = require('../../../unified/src/app/profiles/model-profile.schema.json');
const customerProfileSchema = require('../../../unified/src/app/profiles/customer-profile.schema.json');
const {
  CAPABILITY_KEYS,
  CUSTOMER_DISABLEABLE_CAPABILITIES,
} = require('../../../unified/src/app/profiles/capabilities.js');

const VALIDATE_PROFILES_SCRIPT = path.resolve(process.cwd(), 'scripts/validate-profiles.mjs');

function makeValidator(schema) {
  const ajv = new Ajv({ allErrors: true, strict: false });
  return ajv.compile(schema);
}

// ajv 6 uses dataPath (dot notation); ajv 7+ uses instancePath (slash notation).
// Return whichever is present so tests are robust to either version.
function errorPath(e) {
  return e.instancePath || e.dataPath || '';
}

const validModelProfile = {
  profileVersion: 1,
  expectedBackends: ['mercku_mtk7621'],
  capabilities: {
    sfp: false,
    poeControl: true,
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

const validCustomerProfile = {
  profileVersion: 1,
  branding: {
    productName: 'Router',
    wifiName: 'Router Wi-Fi',
    website: { text: 'Support', url: 'https://example.invalid' },
    policyUrl: '',
    appDownloadUrl: '',
    languages: ['en-US', 'zh-CN'],
    defaultLanguage: 'en-US',
    theme: {
      '--brand-primary': '#d6001c',
      '--brand-loading': '#d6001c',
    },
  },
  policy: {
    disabledCapabilities: [],
    allow2LevelAdmin: false,
    allowTelnet: false,
  },
};

describe('profile contract (v1)', () => {
  describe('model profile schema shape', () => {
    it('locks profileVersion to 1', () => {
      expect(modelProfileSchema.properties.profileVersion.const).to.equal(1);
    });

    it('requires profileVersion, expectedBackends, capabilities, behavior, pageVariants', () => {
      expect(modelProfileSchema.required).to.deep.equal([
        'profileVersion',
        'expectedBackends',
        'capabilities',
        'behavior',
        'pageVariants',
      ]);
    });

    it('rejects unknown top-level fields (no general hiddenMenus/roleRestrictions)', () => {
      expect(modelProfileSchema.additionalProperties).to.equal(false);
    });

    it('capabilities keys exactly match CAPABILITY_KEYS and are all required', () => {
      const capProps = modelProfileSchema.properties.capabilities.properties;
      expect(Object.keys(capProps).sort()).to.deep.equal([...CAPABILITY_KEYS].sort());
      expect(modelProfileSchema.properties.capabilities.additionalProperties).to.equal(false);
      expect(modelProfileSchema.properties.capabilities.required.sort()).to.deep.equal(
        [...CAPABILITY_KEYS].sort()
      );
    });

    it('expectedBackends is a non-empty array of non-empty strings', () => {
      const eb = modelProfileSchema.properties.expectedBackends;
      expect(eb.type).to.equal('array');
      expect(eb.minItems).to.be.greaterThan(0);
      expect(eb.items.type).to.equal('string');
      expect(eb.items.minLength).to.be.greaterThan(0);
    });

    it('behavior declares exactly the three v1 delay keys and rejects unknown ones', () => {
      const behavior = modelProfileSchema.properties.behavior;
      expect(behavior.additionalProperties).to.equal(false);
      expect(behavior.required.sort()).to.deep.equal(
        ['modeSwitchProbeStartDelayMs', 'reconnectProbeTimeoutMs', 'upgradeProbeStartDelayMs']
      );
    });

    it('behavior delays are non-negative integers bounded above', () => {
      const behavior = modelProfileSchema.properties.behavior.properties;
      ['upgradeProbeStartDelayMs', 'modeSwitchProbeStartDelayMs', 'reconnectProbeTimeoutMs'].forEach(
        (key) => {
          expect(behavior[key].type, `${key}.type`).to.equal('integer');
          expect(behavior[key].minimum, `${key}.minimum`).to.be.at.least(0);
          expect(behavior[key].maximum, `${key}.maximum`).to.be.greaterThan(0);
        }
      );
    });

    it('pageVariants is locked to empty in v1 (maxProperties 0)', () => {
      expect(modelProfileSchema.properties.pageVariants.maxProperties).to.equal(0);
    });
  });

  describe('customer profile schema shape', () => {
    it('locks profileVersion to 1', () => {
      expect(customerProfileSchema.properties.profileVersion.const).to.equal(1);
    });

    it('requires profileVersion, branding, policy', () => {
      expect(customerProfileSchema.required).to.deep.equal([
        'profileVersion',
        'branding',
        'policy',
      ]);
    });

    it('rejects unknown top-level fields (no general hiddenMenus/roleRestrictions)', () => {
      expect(customerProfileSchema.additionalProperties).to.equal(false);
    });

    it('disabledCapabilities enum exactly matches CUSTOMER_DISABLEABLE_CAPABILITIES', () => {
      const items = customerProfileSchema.properties.policy.properties.disabledCapabilities.items;
      expect(items.enum.sort()).to.deep.equal([...CUSTOMER_DISABLEABLE_CAPABILITIES].sort());
    });

    it('disabledCapabilities items must be unique', () => {
      const dc = customerProfileSchema.properties.policy.properties.disabledCapabilities;
      expect(dc.uniqueItems).to.equal(true);
    });

    it('policy rejects unknown fields', () => {
      expect(customerProfileSchema.properties.policy.additionalProperties).to.equal(false);
    });

    it('branding rejects unknown fields', () => {
      expect(customerProfileSchema.properties.branding.additionalProperties).to.equal(false);
    });

    it('theme whitelist is exactly --brand-primary and --brand-loading', () => {
      const theme = customerProfileSchema.properties.branding.properties.theme;
      expect(theme.additionalProperties).to.equal(false);
      expect(Object.keys(theme.properties).sort()).to.deep.equal(
        ['--brand-loading', '--brand-primary']
      );
    });

    it('theme values must be 6-digit hex colors', () => {
      const theme = customerProfileSchema.properties.branding.properties.theme;
      Object.values(theme.properties).forEach((prop) => {
        expect(prop.pattern).to.equal('^#[0-9a-fA-F]{6}$');
      });
    });

    it('website is an object with required text and url', () => {
      const website = customerProfileSchema.properties.branding.properties.website;
      expect(website.type).to.equal('object');
      expect(website.additionalProperties).to.equal(false);
      expect(website.required.sort()).to.deep.equal(['text', 'url']);
    });

    it('website url must be http(s) URL', () => {
      const url = customerProfileSchema.properties.branding.properties.website.properties.url;
      expect(url.pattern).to.match(/\^https\?/);
    });

    it('policyUrl and appDownloadUrl allow empty string or http(s) URL', () => {
      const branding = customerProfileSchema.properties.branding.properties;
      [branding.policyUrl, branding.appDownloadUrl].forEach((prop) => {
        expect(prop.pattern, 'pattern should allow empty').to.include('^$');
        expect(prop.pattern, 'pattern should allow http(s)').to.include('https?');
      });
    });

    it('languages is a non-empty array of locale strings', () => {
      const languages = customerProfileSchema.properties.branding.properties.languages;
      expect(languages.type).to.equal('array');
      expect(languages.minItems).to.be.greaterThan(0);
    });
  });

  describe('model profile validation', () => {
    let validate;

    beforeEach(() => {
      validate = makeValidator(modelProfileSchema);
    });

    it('accepts a fully valid model profile', () => {
      const ok = validate(validModelProfile);
      expect(validate.errors, JSON.stringify(validate.errors)).to.equal(null);
      expect(ok).to.equal(true);
    });

    it('rejects an unknown capability key', () => {
      const bad = {
        ...validModelProfile,
        capabilities: { ...validModelProfile.capabilities, mysteryFeature: true },
      };
      expect(validate(bad)).to.equal(false);
      const additional = validate.errors.find(
        (e) => e.keyword === 'additionalProperties' && errorPath(e).includes('capabilities')
      );
      expect(additional, 'expected additionalProperties error inside capabilities').to.not.equal(
        undefined
      );
    });

    it('rejects a missing capability key (all four are required)', () => {
      const bad = {
        ...validModelProfile,
        capabilities: { sfp: false, poeControl: true, fanControl: false },
      };
      expect(validate(bad)).to.equal(false);
      const missing = validate.errors.find(
        (e) => e.keyword === 'required' && e.params.missingProperty === 'frozenConfig'
      );
      expect(missing, 'expected required:frozenConfig error').to.not.equal(undefined);
    });

    it('rejects a negative delay', () => {
      const bad = {
        ...validModelProfile,
        behavior: { ...validModelProfile.behavior, upgradeProbeStartDelayMs: -1 },
      };
      expect(validate(bad)).to.equal(false);
      const minError = validate.errors.find(
        (e) => e.keyword === 'minimum' && errorPath(e).includes('upgradeProbeStartDelayMs')
      );
      expect(minError, 'expected minimum error on upgradeProbeStartDelayMs').to.not.equal(undefined);
    });

    it('rejects a delay above the upper bound', () => {
      const bad = {
        ...validModelProfile,
        behavior: { ...validModelProfile.behavior, reconnectProbeTimeoutMs: 99999999999 },
      };
      expect(validate(bad)).to.equal(false);
      const maxError = validate.errors.find(
        (e) => e.keyword === 'maximum' && errorPath(e).includes('reconnectProbeTimeoutMs')
      );
      expect(maxError, 'expected maximum error on reconnectProbeTimeoutMs').to.not.equal(undefined);
    });

    it('rejects a non-integer delay', () => {
      const bad = {
        ...validModelProfile,
        behavior: { ...validModelProfile.behavior, modeSwitchProbeStartDelayMs: 100.5 },
      };
      expect(validate(bad)).to.equal(false);
      const typeError = validate.errors.find(
        (e) => e.keyword === 'type' && errorPath(e).includes('modeSwitchProbeStartDelayMs')
      );
      expect(typeError, 'expected type error on modeSwitchProbeStartDelayMs').to.not.equal(undefined);
    });

    it('rejects an unknown top-level field', () => {
      const bad = { ...validModelProfile, hiddenMenus: ['foo'] };
      expect(validate(bad)).to.equal(false);
      const additional = validate.errors.find((e) => e.keyword === 'additionalProperties');
      expect(additional, 'expected additionalProperties error').to.not.equal(undefined);
    });

    it('rejects an unknown behavior field', () => {
      const bad = {
        ...validModelProfile,
        behavior: { ...validModelProfile.behavior, upgrading: true },
      };
      expect(validate(bad)).to.equal(false);
      const additional = validate.errors.find(
        (e) => e.keyword === 'additionalProperties' && errorPath(e).includes('behavior')
      );
      expect(additional, 'expected additionalProperties error inside behavior').to.not.equal(
        undefined
      );
    });

    it('rejects a non-empty pageVariants in v1', () => {
      const bad = { ...validModelProfile, pageVariants: { dashboard: 'v2' } };
      expect(validate(bad)).to.equal(false);
      const maxError = validate.errors.find(
        (e) => e.keyword === 'maxProperties' && errorPath(e).includes('pageVariants')
      );
      expect(maxError, 'expected maxProperties error on pageVariants').to.not.equal(undefined);
    });

    it('rejects an empty expectedBackends array', () => {
      const bad = { ...validModelProfile, expectedBackends: [] };
      expect(validate(bad)).to.equal(false);
    });

    it('rejects a wrong profileVersion', () => {
      const bad = { ...validModelProfile, profileVersion: 2 };
      expect(validate(bad)).to.equal(false);
    });
  });

  describe('customer profile validation', () => {
    let validate;

    beforeEach(() => {
      validate = makeValidator(customerProfileSchema);
    });

    it('accepts a fully valid customer profile', () => {
      const ok = validate(validCustomerProfile);
      expect(validate.errors, JSON.stringify(validate.errors)).to.equal(null);
      expect(ok).to.equal(true);
    });

    it('rejects an unknown top-level field (no hiddenMenus/roleRestrictions)', () => {
      const bad = { ...validCustomerProfile, roleRestrictions: { admin: ['dashboard'] } };
      expect(validate(bad)).to.equal(false);
      const additional = validate.errors.find((e) => e.keyword === 'additionalProperties');
      expect(additional, 'expected additionalProperties error').to.not.equal(undefined);
    });

    it('rejects disabledCapabilities referencing an unknown capability', () => {
      const bad = {
        ...validCustomerProfile,
        policy: { ...validCustomerProfile.policy, disabledCapabilities: ['mysteryFeature'] },
      };
      expect(validate(bad)).to.equal(false);
      const enumError = validate.errors.find(
        (e) => e.keyword === 'enum' && errorPath(e).includes('disabledCapabilities')
      );
      expect(enumError, 'expected enum error on disabledCapabilities').to.not.equal(undefined);
    });

    it('rejects duplicate disabledCapabilities', () => {
      const bad = {
        ...validCustomerProfile,
        policy: {
          ...validCustomerProfile.policy,
          disabledCapabilities: ['sfp', 'sfp'],
        },
      };
      expect(validate(bad)).to.equal(false);
      const uniqueError = validate.errors.find(
        (e) => e.keyword === 'uniqueItems' && errorPath(e).includes('disabledCapabilities')
      );
      expect(uniqueError, 'expected uniqueItems error').to.not.equal(undefined);
    });

    it('rejects an illegal website url', () => {
      const bad = {
        ...validCustomerProfile,
        branding: {
          ...validCustomerProfile.branding,
          website: { text: 'Support', url: 'javascript:alert(1)' },
        },
      };
      expect(validate(bad)).to.equal(false);
      const patternError = validate.errors.find(
        (e) => e.keyword === 'pattern' && errorPath(e).includes('website')
      );
      expect(patternError, 'expected pattern error on website.url').to.not.equal(undefined);
    });

    it('rejects an unknown CSS variable in theme', () => {
      const bad = {
        ...validCustomerProfile,
        branding: {
          ...validCustomerProfile.branding,
          theme: { '--brand-primary': '#d6001c', '--evil-variable': '#000000' },
        },
      };
      expect(validate(bad)).to.equal(false);
      const additional = validate.errors.find(
        (e) => e.keyword === 'additionalProperties' && errorPath(e).includes('theme')
      );
      expect(additional, 'expected additionalProperties error inside theme').to.not.equal(undefined);
    });

    it('rejects an invalid color value in theme', () => {
      const bad = {
        ...validCustomerProfile,
        branding: {
          ...validCustomerProfile.branding,
          theme: { '--brand-primary': 'red; --brand-loading: #000000' },
        },
      };
      expect(validate(bad)).to.equal(false);
      const patternError = validate.errors.find(
        (e) => e.keyword === 'pattern' && errorPath(e).includes('--brand-primary')
      );
      expect(patternError, 'expected pattern error on theme color').to.not.equal(undefined);
    });

    it('accepts empty policyUrl and appDownloadUrl', () => {
      const ok = validate(validCustomerProfile);
      expect(ok).to.equal(true);
    });

    it('rejects a missing branding field', () => {
      const bad = { ...validCustomerProfile, branding: undefined };
      expect(validate(bad)).to.equal(false);
      const missing = validate.errors.find(
        (e) => e.keyword === 'required' && e.params.missingProperty === 'branding'
      );
      expect(missing, 'expected required:branding error').to.not.equal(undefined);
    });

    it('rejects an empty languages array', () => {
      const bad = {
        ...validCustomerProfile,
        branding: { ...validCustomerProfile.branding, languages: [] },
      };
      expect(validate(bad)).to.equal(false);
    });
  });
});

describe('validate-profiles CLI', () => {
  it('exits 0 with a "no profiles found" message when registries do not exist', () => {
    const output = execFileSync(process.execPath, [VALIDATE_PROFILES_SCRIPT], {
      encoding: 'utf8',
      env: { ...process.env, MERCKU_PROFILES_ROOT: path.resolve(process.cwd(), 'tests/fixtures/no-such-profiles') },
    });
    expect(output).to.match(/no profiles/i);
  });
});
