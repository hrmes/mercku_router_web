const { expect } = require('chai');

const {
  compose,
  computeEffectiveCapabilities,
} = require('../../../unified/src/app/profiles/compose.js');
const {
  createNeutralCustomerProfile,
} = require('../../../unified/src/app/profiles/load.js');
const {
  CAPABILITY_KEYS,
} = require('../../../unified/src/app/profiles/capabilities.js');

const IDENTITY = {
  schemaVersion: 1,
  revision: '2026-07-21T10:00:00Z-1',
  modelId: 'M11R4',
  customerId: '0007',
  backend: 'mercku_mtk7621',
};

const IDENTITY_WITH_DETECTED = {
  ...IDENTITY,
  detectedCapabilities: {
    sfp: true,
    poeControl: true,
    fanControl: true,
    frozenConfig: true,
  },
};

const MODEL_PROFILE = {
  profileVersion: 1,
  expectedBackends: ['mercku_mtk7621'],
  capabilities: {
    sfp: true,
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

const CUSTOMER_PROFILE = {
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

describe('compose(identity, modelProfile, customerProfile)', () => {
  describe('effectiveCapabilities formula', () => {
    it('returns true only when baseline=true AND detected!=false AND not customer-disabled', () => {
      const ctx = compose(IDENTITY_WITH_DETECTED, MODEL_PROFILE, CUSTOMER_PROFILE);
      expect(ctx.effectiveCapabilities.sfp).to.equal(true);
      expect(ctx.effectiveCapabilities.poeControl).to.equal(true);
      // baseline false → false regardless of detected
      expect(ctx.effectiveCapabilities.fanControl).to.equal(false);
      expect(ctx.effectiveCapabilities.frozenConfig).to.equal(false);
    });

    it('detectedCapabilities=true CANNOT flip a baseline false to true (deferred cross-file constraint)', () => {
      const modelWithFalse = {
        ...MODEL_PROFILE,
        capabilities: {
          sfp: false,
          poeControl: false,
          fanControl: false,
          frozenConfig: false,
        },
      };
      const ctx = compose(IDENTITY_WITH_DETECTED, modelWithFalse, CUSTOMER_PROFILE);
      expect(ctx.effectiveCapabilities.sfp).to.equal(false);
      expect(ctx.effectiveCapabilities.poeControl).to.equal(false);
      expect(ctx.effectiveCapabilities.fanControl).to.equal(false);
      expect(ctx.effectiveCapabilities.frozenConfig).to.equal(false);
    });

    it('detectedCapabilities=false closes a baseline true capability', () => {
      const identityWithFalseDetected = {
        ...IDENTITY,
        detectedCapabilities: {
          sfp: false,
          poeControl: true,
          fanControl: true,
          frozenConfig: true,
        },
      };
      const ctx = compose(identityWithFalseDetected, MODEL_PROFILE, CUSTOMER_PROFILE);
      expect(ctx.effectiveCapabilities.sfp).to.equal(false);
      expect(ctx.effectiveCapabilities.poeControl).to.equal(true);
    });

    it('customer disabledCapabilities closes a baseline true capability', () => {
      const customer = {
        ...CUSTOMER_PROFILE,
        policy: {
          ...CUSTOMER_PROFILE.policy,
          disabledCapabilities: ['poeControl'],
        },
      };
      const ctx = compose(IDENTITY_WITH_DETECTED, MODEL_PROFILE, customer);
      expect(ctx.effectiveCapabilities.poeControl).to.equal(false);
    });

    it('exposes exactly the four v1 capability keys', () => {
      const ctx = compose(IDENTITY, MODEL_PROFILE, CUSTOMER_PROFILE);
      expect(Object.keys(ctx.effectiveCapabilities).sort()).to.deep.equal(
        [...CAPABILITY_KEYS].sort()
      );
    });

    it('treats missing detectedCapabilities as "no detection" (baseline wins)', () => {
      const ctx = compose(IDENTITY, MODEL_PROFILE, CUSTOMER_PROFILE);
      expect(ctx.effectiveCapabilities.sfp).to.equal(true);
      expect(ctx.effectiveCapabilities.poeControl).to.equal(true);
      expect(ctx.effectiveCapabilities.fanControl).to.equal(false);
      expect(ctx.effectiveCapabilities.frozenConfig).to.equal(false);
    });
  });

  describe('behavior (Model Profile wins)', () => {
    it('exposes the Model Profile behavior verbatim', () => {
      const ctx = compose(IDENTITY, MODEL_PROFILE, CUSTOMER_PROFILE);
      expect(ctx.behavior).to.deep.equal(MODEL_PROFILE.behavior);
    });
  });

  describe('branding (Customer Profile wins, with neutral fallback)', () => {
    it('exposes the Customer Profile branding', () => {
      const ctx = compose(IDENTITY, MODEL_PROFILE, CUSTOMER_PROFILE);
      expect(ctx.branding).to.deep.equal(CUSTOMER_PROFILE.branding);
    });

    it('uses Neutral Profile branding when customer is the neutral fallback', () => {
      const neutral = createNeutralCustomerProfile();
      const ctx = compose(IDENTITY, MODEL_PROFILE, neutral);
      expect(ctx.branding).to.deep.equal(neutral.branding);
    });
  });

  describe('policy (Customer Profile wins)', () => {
    it('exposes the Customer Profile policy', () => {
      const ctx = compose(IDENTITY, MODEL_PROFILE, CUSTOMER_PROFILE);
      expect(ctx.policy).to.deep.equal(CUSTOMER_PROFILE.policy);
    });
  });

  describe('pageVariants (Model Profile wins, v1 empty)', () => {
    it('is always an empty object in v1', () => {
      const ctx = compose(IDENTITY, MODEL_PROFILE, CUSTOMER_PROFILE);
      expect(ctx.pageVariants).to.deep.equal({});
    });
  });

  describe('backend mismatch produces a warning, not a failure', () => {
    it('emits a warning when identity.backend is not in expectedBackends', () => {
      const identity = { ...IDENTITY, backend: 'some_other_backend' };
      const ctx = compose(identity, MODEL_PROFILE, CUSTOMER_PROFILE);
      const warnings = ctx.diagnostics.filter(
        (d) => d.level === 'warning' && /backend/i.test(d.message)
      );
      expect(warnings.length).to.be.greaterThan(0);
    });

    it('does not emit a backend warning when backend matches expectedBackends', () => {
      const ctx = compose(IDENTITY, MODEL_PROFILE, CUSTOMER_PROFILE);
      const backendWarnings = ctx.diagnostics.filter(
        (d) => /backend/i.test(d.message)
      );
      expect(backendWarnings.length).to.equal(0);
    });
  });

  describe('AppRuntimeContext is frozen', () => {
    it('returns a top-level frozen object', () => {
      const ctx = compose(IDENTITY, MODEL_PROFILE, CUSTOMER_PROFILE);
      expect(Object.isFrozen(ctx)).to.equal(true);
    });

    it('freezes nested effectiveCapabilities, behavior, branding, policy', () => {
      const ctx = compose(IDENTITY, MODEL_PROFILE, CUSTOMER_PROFILE);
      expect(Object.isFrozen(ctx.effectiveCapabilities)).to.equal(true);
      expect(Object.isFrozen(ctx.behavior)).to.equal(true);
      expect(Object.isFrozen(ctx.branding)).to.equal(true);
      expect(Object.isFrozen(ctx.policy)).to.equal(true);
    });

    it('freezes identity copy on the runtime context', () => {
      const ctx = compose(IDENTITY, MODEL_PROFILE, CUSTOMER_PROFILE);
      expect(Object.isFrozen(ctx.identity)).to.equal(true);
    });
  });

  describe('does not mutate caller inputs (deep clone before freeze)', () => {
    it('does not freeze the caller\'s identity.detectedCapabilities', () => {
      const identity = {
        ...IDENTITY_WITH_DETECTED,
        detectedCapabilities: {
          sfp: true,
          poeControl: true,
          fanControl: true,
          frozenConfig: true,
        },
      };
      const originalDetected = identity.detectedCapabilities;
      const ctx = compose(identity, MODEL_PROFILE, CUSTOMER_PROFILE);
      // ctx.identity is a deep clone — equal in value, distinct in identity.
      expect(ctx.identity.detectedCapabilities).to.deep.equal(originalDetected);
      expect(ctx.identity.detectedCapabilities).to.not.equal(originalDetected);
      expect(
        Object.isFrozen(originalDetected),
        'caller\'s detectedCapabilities must NOT be frozen'
      ).to.equal(false);
    });

    it('does not freeze the caller\'s customerProfile.branding nested objects', () => {
      const customer = {
        ...CUSTOMER_PROFILE,
        branding: {
          ...CUSTOMER_PROFILE.branding,
          theme: { '--brand-primary': '#d6001c', '--brand-loading': '#d6001c' },
          website: { text: 'Support', url: 'https://example.invalid' },
        },
      };
      const originalTheme = customer.branding.theme;
      const originalWebsite = customer.branding.website;
      const ctx = compose(IDENTITY, MODEL_PROFILE, customer);
      expect(ctx.branding.theme).to.deep.equal(originalTheme);
      expect(ctx.branding.theme).to.not.equal(originalTheme);
      expect(
        Object.isFrozen(originalTheme),
        'caller\'s branding.theme must NOT be frozen'
      ).to.equal(false);
      expect(
        Object.isFrozen(originalWebsite),
        'caller\'s branding.website must NOT be frozen'
      ).to.equal(false);
    });

    it('does not freeze the caller\'s customerProfile.policy.disabledCapabilities', () => {
      const customer = {
        ...CUSTOMER_PROFILE,
        policy: {
          ...CUSTOMER_PROFILE.policy,
          disabledCapabilities: ['sfp'],
        },
      };
      const originalDisabled = customer.policy.disabledCapabilities;
      const ctx = compose(IDENTITY, MODEL_PROFILE, customer);
      expect(ctx.policy.disabledCapabilities).to.deep.equal(originalDisabled);
      expect(ctx.policy.disabledCapabilities).to.not.equal(originalDisabled);
      expect(
        Object.isFrozen(originalDisabled),
        'caller\'s disabledCapabilities must NOT be frozen'
      ).to.equal(false);
    });

    it('does not freeze the caller\'s modelProfile.behavior', () => {
      const model = {
        ...MODEL_PROFILE,
        behavior: { ...MODEL_PROFILE.behavior },
      };
      const originalBehavior = model.behavior;
      const ctx = compose(IDENTITY, model, CUSTOMER_PROFILE);
      expect(ctx.behavior).to.deep.equal(originalBehavior);
      expect(ctx.behavior).to.not.equal(originalBehavior);
      expect(
        Object.isFrozen(originalBehavior),
        'caller\'s behavior must NOT be frozen'
      ).to.equal(false);
    });
  });

  describe('computeEffectiveCapabilities (unit-level formula)', () => {
    it('implements the §3.4 formula directly', () => {
      const caps = computeEffectiveCapabilities(
        MODEL_PROFILE.capabilities,
        { sfp: false, poeControl: true, fanControl: false, frozenConfig: true },
        ['poeControl']
      );
      // sfp: baseline true, detected false → false
      expect(caps.sfp).to.equal(false);
      // poeControl: baseline true, detected true, but customer disabled → false
      expect(caps.poeControl).to.equal(false);
      // fanControl: baseline false → false
      expect(caps.fanControl).to.equal(false);
      // frozenConfig: baseline false → false
      expect(caps.frozenConfig).to.equal(false);
    });
  });
});
