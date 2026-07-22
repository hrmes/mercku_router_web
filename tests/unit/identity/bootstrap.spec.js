const path = require('path');
const { expect } = require('chai');

const {
  bootstrap,
  BootstrapError,
  isRetryable,
} = require('../../../unified/src/app/bootstrap.js');
const {
  buildBootstrapErrorDescriptor,
} = require('../../../unified/src/app/bootstrap-error.js');
const {
  createNeutralCustomerProfile,
} = require('../../../unified/src/app/profiles/load.js');
const { compose } = require('../../../unified/src/app/profiles/compose.js');

// Fixtures used to drive the bootstrap. We keep them in tests/fixtures so the
// same data shapes the JSON-schema fixtures from Task 2.
const VALID_IDENTITY = {
  schemaVersion: 1,
  revision: '2026-07-21T10:00:00Z-1',
  modelId: 'M11R4',
  customerId: '0007',
  backend: 'mercku_mtk7621',
  detectedCapabilities: { sfp: false },
};

const VALID_MODEL_PROFILE = {
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

const VALID_CUSTOMER_PROFILE = {
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

function makeDiagnostics() {
  return [];
}

describe('bootstrap({ createApp })', () => {
  describe('success path', () => {
    it('calls createApp exactly once with a frozen AppRuntimeContext', async () => {
      const calls = [];
      const createApp = (ctx) => {
        calls.push(ctx);
        return { ctx };
      };

      const result = await bootstrap({
        createApp,
        fetchIdentity: async () => VALID_IDENTITY,
        loadModelProfile: async () => VALID_MODEL_PROFILE,
        loadCustomerProfile: async () => VALID_CUSTOMER_PROFILE,
        diagnostics: makeDiagnostics(),
      });

      expect(calls.length, 'createApp must be called exactly once').to.equal(1);
      expect(result).to.exist;
      const ctx = calls[0];
      expect(Object.isFrozen(ctx), 'runtimeContext must be frozen').to.equal(true);
      expect(Object.isFrozen(ctx.effectiveCapabilities)).to.equal(true);
      expect(Object.isFrozen(ctx.behavior)).to.equal(true);
      expect(Object.isFrozen(ctx.branding)).to.equal(true);
      expect(Object.isFrozen(ctx.policy)).to.equal(true);
    });

    it('does not call createApp until identity, model profile and customer profile have all resolved', async () => {
      const calls = [];
      const createApp = (ctx) => {
        calls.push(ctx);
        return { ctx };
      };

      let resolveIdentity;
      let resolveModel;
      let resolveCustomer;
      const identityPromise = new Promise((res) => { resolveIdentity = res; });
      const modelPromise = new Promise((res) => { resolveModel = res; });
      const customerPromise = new Promise((res) => { resolveCustomer = res; });

      const bootstrapPromise = bootstrap({
        createApp,
        fetchIdentity: () => identityPromise,
        loadModelProfile: () => modelPromise,
        loadCustomerProfile: () => customerPromise,
        diagnostics: makeDiagnostics(),
      });

      // Give the event loop a chance to flush; createApp must not have been
      // called before any of the three have resolved.
      await Promise.resolve();
      await Promise.resolve();
      expect(calls.length, 'createApp must not fire before identity resolves').to.equal(0);

      resolveIdentity(VALID_IDENTITY);
      await Promise.resolve();
      await Promise.resolve();
      expect(calls.length, 'createApp must not fire before model profile resolves').to.equal(0);

      resolveModel(VALID_MODEL_PROFILE);
      await Promise.resolve();
      await Promise.resolve();
      expect(
        calls.length,
        'createApp must not fire before customer profile resolves'
      ).to.equal(0);

      resolveCustomer(VALID_CUSTOMER_PROFILE);
      await bootstrapPromise;

      expect(calls.length, 'createApp fires exactly once after all resolve').to.equal(1);
    });

    it('passes identity, effectiveCapabilities, behavior, branding, policy, pageVariants and diagnostics on the runtimeContext', async () => {
      const calls = [];
      await bootstrap({
        createApp: (ctx) => { calls.push(ctx); },
        fetchIdentity: async () => VALID_IDENTITY,
        loadModelProfile: async () => VALID_MODEL_PROFILE,
        loadCustomerProfile: async () => VALID_CUSTOMER_PROFILE,
        diagnostics: makeDiagnostics(),
      });

      const ctx = calls[0];
      expect(ctx.identity).to.deep.equal(VALID_IDENTITY);
      expect(ctx.effectiveCapabilities).to.have.all.keys(
        'sfp',
        'poeControl',
        'fanControl',
        'frozenConfig'
      );
      expect(ctx.behavior).to.deep.equal(VALID_MODEL_PROFILE.behavior);
      expect(ctx.branding).to.deep.equal(VALID_CUSTOMER_PROFILE.branding);
      expect(ctx.policy).to.deep.equal(VALID_CUSTOMER_PROFILE.policy);
      expect(ctx.pageVariants).to.deep.equal({});
      expect(ctx.diagnostics).to.be.an('array');
    });
  });

  describe('identity failures are retryable and never reach createApp', () => {
    it('rejects when identity fetch 404s, never calls createApp, error is retryable', async () => {
      const calls = [];
      const err = new Error('not found');
      err.status = 404;
      let caught;
      try {
        await bootstrap({
          createApp: (ctx) => { calls.push(ctx); },
          fetchIdentity: async () => { throw err; },
          loadModelProfile: async () => VALID_MODEL_PROFILE,
          loadCustomerProfile: async () => VALID_CUSTOMER_PROFILE,
          diagnostics: makeDiagnostics(),
        });
      } catch (e) {
        caught = e;
      }
      expect(caught, 'bootstrap must reject').to.exist;
      expect(calls.length, 'createApp must not be called').to.equal(0);
      expect(caught).to.be.an.instanceof(BootstrapError);
      expect(caught.code, 'identity fetch failure code').to.equal('identity-load-failed');
      expect(caught.retryable, 'identity fetch failure must be retryable').to.equal(true);
      expect(isRetryable(caught), 'isRetryable agrees').to.equal(true);
    });

    it('rejects when identity fetch times out, error is retryable', async () => {
      const calls = [];
      const err = new Error('timeout');
      err.code = 'ROUTER_TIMEOUT';
      let caught;
      try {
        await bootstrap({
          createApp: (ctx) => { calls.push(ctx); },
          fetchIdentity: async () => { throw err; },
          loadModelProfile: async () => VALID_MODEL_PROFILE,
          loadCustomerProfile: async () => VALID_CUSTOMER_PROFILE,
          diagnostics: makeDiagnostics(),
        });
      } catch (e) {
        caught = e;
      }
      expect(caught).to.exist;
      expect(calls.length).to.equal(0);
      expect(caught).to.be.an.instanceof(BootstrapError);
      expect(caught.code).to.equal('identity-load-failed');
      expect(caught.retryable).to.equal(true);
      expect(isRetryable(caught)).to.equal(true);
    });

    it('rejects when identity fails schema validation (illegal identity)', async () => {
      const calls = [];
      let caught;
      try {
        await bootstrap({
          createApp: (ctx) => { calls.push(ctx); },
          fetchIdentity: async () => ({
            // missing modelId, unknown field
            schemaVersion: 1,
            revision: 'r',
            customerId: '0007',
            backend: 'mercku_mtk7621',
            brand: 'Mercku',
          }),
          loadModelProfile: async () => VALID_MODEL_PROFILE,
          loadCustomerProfile: async () => VALID_CUSTOMER_PROFILE,
          diagnostics: makeDiagnostics(),
        });
      } catch (e) {
        caught = e;
      }
      expect(caught).to.exist;
      expect(calls.length).to.equal(0);
      expect(caught).to.be.an.instanceof(BootstrapError);
      expect(caught.code, 'illegal identity code').to.equal('identity-invalid');
      expect(caught.retryable, 'illegal identity must be retryable').to.equal(true);
      expect(isRetryable(caught), 'illegal identity must be retryable').to.equal(true);
    });
  });

  describe('model profile failures are retryable and never reach createApp', () => {
    it('rejects on unknown modelId (no fallback, no admin UI)', async () => {
      const calls = [];
      let caught;
      try {
        await bootstrap({
          createApp: (ctx) => { calls.push(ctx); },
          fetchIdentity: async () => ({ ...VALID_IDENTITY, modelId: 'UNKNOWN_MODEL' }),
          loadModelProfile: async (modelId) => {
            if (modelId === 'UNKNOWN_MODEL') {
              throw new BootstrapError('unknown-model', `no Model Profile for ${modelId}`, { retryable: false });
            }
            return VALID_MODEL_PROFILE;
          },
          loadCustomerProfile: async () => VALID_CUSTOMER_PROFILE,
          diagnostics: makeDiagnostics(),
        });
      } catch (e) {
        caught = e;
      }
      expect(caught).to.exist;
      expect(calls.length, 'createApp must not be called for unknown modelId').to.equal(0);
      expect(caught).to.be.an.instanceof(BootstrapError);
      expect(caught.code).to.equal('unknown-model');
      expect(caught.retryable, 'unknown modelId must NOT be retryable').to.equal(false);
      expect(isRetryable(caught), 'unknown modelId must NOT be retryable').to.equal(false);
    });

    it('rejects on unknown modelId when production loader RETURNS undefined (no throw)', async () => {
      // Mirrors the real loadModelProfileById: unregistered modelId resolves to
      // undefined, which bootstrap.js converts into a non-retryable
      // BootstrapError('unknown-model'). The test above covers the thrown path;
      // this one locks the production return-undefined path.
      const calls = [];
      let caught;
      try {
        await bootstrap({
          createApp: (ctx) => { calls.push(ctx); },
          fetchIdentity: async () => ({ ...VALID_IDENTITY, modelId: 'UNKNOWN_MODEL' }),
          loadModelProfile: async () => undefined,
          loadCustomerProfile: async () => VALID_CUSTOMER_PROFILE,
          diagnostics: makeDiagnostics(),
        });
      } catch (e) {
        caught = e;
      }
      expect(caught).to.exist;
      expect(calls.length, 'createApp must not be called for unknown modelId').to.equal(0);
      expect(caught).to.be.an.instanceof(BootstrapError);
      expect(caught.code).to.equal('unknown-model');
      expect(caught.retryable, 'unknown modelId must NOT be retryable').to.equal(false);
      expect(isRetryable(caught)).to.equal(false);
    });

    it('rejects when Model Profile chunk fails to load (e.g. 404)', async () => {
      const calls = [];
      let caught;
      try {
        await bootstrap({
          createApp: (ctx) => { calls.push(ctx); },
          fetchIdentity: async () => VALID_IDENTITY,
          loadModelProfile: async () => {
            const err = new Error('chunk 404');
            err.code = 'CHUNK_LOAD_FAILED';
            throw err;
          },
          loadCustomerProfile: async () => VALID_CUSTOMER_PROFILE,
          diagnostics: makeDiagnostics(),
        });
      } catch (e) {
        caught = e;
      }
      expect(caught).to.exist;
      expect(calls.length).to.equal(0);
      expect(caught).to.be.an.instanceof(BootstrapError);
      expect(caught.code).to.equal('model-profile-load-failed');
      expect(caught.retryable, 'model chunk load failure must be retryable').to.equal(true);
      expect(isRetryable(caught), 'model chunk load failure must be retryable').to.equal(true);
    });

    it('rejects when Model Profile fails schema validation', async () => {
      const calls = [];
      let caught;
      try {
        await bootstrap({
          createApp: (ctx) => { calls.push(ctx); },
          fetchIdentity: async () => VALID_IDENTITY,
          loadModelProfile: async () => ({
            // missing capabilities, wrong profileVersion
            profileVersion: 2,
            expectedBackends: ['mercku_mtk7621'],
            behavior: VALID_MODEL_PROFILE.behavior,
            pageVariants: {},
          }),
          loadCustomerProfile: async () => VALID_CUSTOMER_PROFILE,
          diagnostics: makeDiagnostics(),
        });
      } catch (e) {
        caught = e;
      }
      expect(caught).to.exist;
      expect(calls.length).to.equal(0);
      expect(caught).to.be.an.instanceof(BootstrapError);
      expect(caught.code).to.equal('model-profile-invalid');
      expect(caught.retryable, 'schema failure must be retryable').to.equal(true);
      expect(isRetryable(caught)).to.equal(true);
    });
  });

  describe('customer profile failures fall back to Neutral Profile with a diagnostic warning', () => {
    it('uses Neutral Profile when customerId is unknown and emits a warning', async () => {
      const calls = [];
      const diagnostics = [];
      await bootstrap({
        createApp: (ctx) => { calls.push(ctx); },
        fetchIdentity: async () => ({ ...VALID_IDENTITY, customerId: 'UNKNOWN_CUSTOMER' }),
        loadModelProfile: async () => VALID_MODEL_PROFILE,
        loadCustomerProfile: async (customerId) => {
          if (customerId === 'UNKNOWN_CUSTOMER') {
            throw new BootstrapError('unknown-customer', `no Customer Profile for ${customerId}`, { retryable: false });
          }
          return VALID_CUSTOMER_PROFILE;
        },
        diagnostics,
      });

      expect(calls.length, 'createApp is still called once').to.equal(1);
      const ctx = calls[0];
      // Neutral Profile closes ALL customerDisableableCapabilities
      expect(ctx.policy.disabledCapabilities).to.include('sfp');
      expect(ctx.policy.disabledCapabilities).to.include('poeControl');
      expect(ctx.policy.disabledCapabilities).to.include('fanControl');
      expect(ctx.policy.disabledCapabilities).to.include('frozenConfig');
      expect(ctx.policy.allow2LevelAdmin).to.equal(false);
      expect(ctx.policy.allowTelnet).to.equal(false);
      // A diagnostic warning was emitted
      const warnings = ctx.diagnostics.filter((d) => d.level === 'warning');
      expect(warnings.length).to.be.greaterThan(0);
      expect(warnings.some((w) => /customer/i.test(w.message))).to.equal(true);
    });

    it('uses Neutral Profile when Customer Profile chunk fails to load', async () => {
      const calls = [];
      const diagnostics = [];
      await bootstrap({
        createApp: (ctx) => { calls.push(ctx); },
        fetchIdentity: async () => VALID_IDENTITY,
        loadModelProfile: async () => VALID_MODEL_PROFILE,
        loadCustomerProfile: async () => {
          const err = new Error('chunk 404');
          err.code = 'CHUNK_LOAD_FAILED';
          throw err;
        },
        diagnostics,
      });

      expect(calls.length).to.equal(1);
      const ctx = calls[0];
      // Neutral fallback disables all customerDisableableCapabilities
      expect(ctx.policy.disabledCapabilities).to.have.lengthOf(4);
      const warnings = ctx.diagnostics.filter((d) => d.level === 'warning');
      expect(warnings.length).to.be.greaterThan(0);
    });

    it('uses Neutral Profile when Customer Profile fails schema validation', async () => {
      const calls = [];
      const diagnostics = [];
      await bootstrap({
        createApp: (ctx) => { calls.push(ctx); },
        fetchIdentity: async () => VALID_IDENTITY,
        loadModelProfile: async () => VALID_MODEL_PROFILE,
        loadCustomerProfile: async () => ({
          // illegal disabledCapabilities entry
          profileVersion: 1,
          branding: VALID_CUSTOMER_PROFILE.branding,
          policy: {
            disabledCapabilities: ['mysteryFeature'],
            allow2LevelAdmin: false,
            allowTelnet: false,
          },
        }),
        diagnostics,
      });

      expect(calls.length, 'createApp still called once').to.equal(1);
      const ctx = calls[0];
      // Neutral fallback kicked in
      expect(ctx.policy.disabledCapabilities).to.have.lengthOf(4);
      const warnings = ctx.diagnostics.filter((d) => d.level === 'warning');
      expect(warnings.length).to.be.greaterThan(0);
    });
  });

  describe('backend mismatch produces a warning only and does not block', () => {
    it('emits a diagnostic warning but still calls createApp when backend not in expectedBackends', async () => {
      const calls = [];
      const diagnostics = [];
      await bootstrap({
        createApp: (ctx) => { calls.push(ctx); },
        fetchIdentity: async () => ({ ...VALID_IDENTITY, backend: 'some_other_backend' }),
        loadModelProfile: async () => ({
          ...VALID_MODEL_PROFILE,
          expectedBackends: ['mercku_mtk7621'],
        }),
        loadCustomerProfile: async () => VALID_CUSTOMER_PROFILE,
        diagnostics,
      });

      expect(calls.length, 'backend mismatch must not block createApp').to.equal(1);
      const ctx = calls[0];
      const warnings = ctx.diagnostics.filter((d) => /backend/i.test(d.message));
      expect(warnings.length).to.be.greaterThan(0);
    });
  });

  describe('effective capability composition (deferred cross-file constraint from Task 2)', () => {
    it('detectedCapabilities=true CANNOT flip a Model Profile false to true', async () => {
      const calls = [];
      await bootstrap({
        createApp: (ctx) => { calls.push(ctx); },
        fetchIdentity: async () => ({
          ...VALID_IDENTITY,
          detectedCapabilities: {
            sfp: true,
            poeControl: true,
            fanControl: true,
            frozenConfig: true,
          },
        }),
        loadModelProfile: async () => ({
          ...VALID_MODEL_PROFILE,
          capabilities: {
            sfp: false,
            poeControl: false,
            fanControl: false,
            frozenConfig: false,
          },
        }),
        loadCustomerProfile: async () => ({
          ...VALID_CUSTOMER_PROFILE,
          policy: {
            ...VALID_CUSTOMER_PROFILE.policy,
            disabledCapabilities: [],
          },
        }),
        diagnostics: makeDiagnostics(),
      });

      const ctx = calls[0];
      expect(ctx.effectiveCapabilities.sfp).to.equal(false);
      expect(ctx.effectiveCapabilities.poeControl).to.equal(false);
      expect(ctx.effectiveCapabilities.fanControl).to.equal(false);
      expect(ctx.effectiveCapabilities.frozenConfig).to.equal(false);
    });

    it('detectedCapabilities=false closes a Model Profile true capability', async () => {
      const calls = [];
      await bootstrap({
        createApp: (ctx) => { calls.push(ctx); },
        fetchIdentity: async () => ({
          ...VALID_IDENTITY,
          detectedCapabilities: { sfp: false },
        }),
        loadModelProfile: async () => VALID_MODEL_PROFILE,
        loadCustomerProfile: async () => VALID_CUSTOMER_PROFILE,
        diagnostics: makeDiagnostics(),
      });

      const ctx = calls[0];
      expect(ctx.effectiveCapabilities.sfp).to.equal(false);
    });

    it('customer disabledCapabilities closes a Model Profile true capability', async () => {
      const calls = [];
      await bootstrap({
        createApp: (ctx) => { calls.push(ctx); },
        fetchIdentity: async () => VALID_IDENTITY,
        loadModelProfile: async () => VALID_MODEL_PROFILE,
        loadCustomerProfile: async () => ({
          ...VALID_CUSTOMER_PROFILE,
          policy: {
            ...VALID_CUSTOMER_PROFILE.policy,
            disabledCapabilities: ['poeControl'],
          },
        }),
        diagnostics: makeDiagnostics(),
      });

      const ctx = calls[0];
      expect(ctx.effectiveCapabilities.poeControl).to.equal(false);
    });
  });
});

describe('buildBootstrapErrorDescriptor(err, diagnostics)', () => {
  it('maps a BootstrapError code/retryable through to the descriptor', () => {
    const err = new BootstrapError('unknown-model', 'no profile', { retryable: false });
    const descriptor = buildBootstrapErrorDescriptor(err, []);
    expect(descriptor.retryable).to.equal(false);
    expect(descriptor.code).to.equal('unknown-model');
    expect(descriptor.message).to.equal('no profile');
    expect(descriptor.diagnostics).to.deep.equal([]);
  });

  it('defaults a plain Error to non-retryable with bootstrap-error code', () => {
    const err = new Error('plain');
    const diagnostics = [{ level: 'warning', code: 'x', message: 'y' }];
    const descriptor = buildBootstrapErrorDescriptor(err, diagnostics);
    expect(descriptor.retryable, 'plain errors default to non-retryable').to.equal(false);
    expect(descriptor.code).to.equal('bootstrap-error');
    expect(descriptor.message).to.equal('plain');
    // diagnostics are preserved (and copied so the caller can keep mutating)
    expect(descriptor.diagnostics).to.deep.equal(diagnostics);
    expect(descriptor.diagnostics).to.not.equal(diagnostics);
  });

  it('treats a bare IDENTITY fetch error as retryable (unified isRetryable)', () => {
    // Locks the Issue 3 contract: a bare error with code containing IDENTITY
    // (not a BootstrapError) must be retryable through the unified isRetryable
    // used by buildBootstrapErrorDescriptor.
    const err = Object.assign(new Error('identity fetch failed'), {
      code: 'IDENTITY_FETCH_ERROR',
    });
    const descriptor = buildBootstrapErrorDescriptor(err, []);
    expect(descriptor.retryable).to.equal(true);
    expect(descriptor.code).to.equal('IDENTITY_FETCH_ERROR');
  });

  it('returns a frozen descriptor with frozen diagnostics', () => {
    const err = new BootstrapError('identity-invalid', 'bad', { retryable: true });
    const descriptor = buildBootstrapErrorDescriptor(err, [
      { level: 'warning', code: 'c', message: 'm' },
    ]);
    expect(Object.isFrozen(descriptor), 'descriptor top-level frozen').to.equal(true);
    expect(Object.isFrozen(descriptor.diagnostics), 'diagnostics array frozen').to.equal(true);
  });
});
