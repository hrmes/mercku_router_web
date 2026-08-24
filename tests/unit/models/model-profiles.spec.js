const { expect } = require('chai');
const Ajv = require('ajv');

const modelProfileSchema = require('../../../unified/src/app/profiles/model-profile.schema.json');
const m11r4Profile = require('../../../unified/src/profiles/models/M11R4/profile.json');
const m13r0Profile = require('../../../unified/src/profiles/models/M13R0/profile.json');

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(modelProfileSchema);

// Behavior values were verified against the actual delayed-variant sources:
//   - upgradeProbeStartDelayMs: m6s/src/main.js + nano/src/main.js
//     `setTimeout(() => { reconnect(...) }, 20000)` in the upgrade() flow.
//   - modeSwitchProbeStartDelayMs: m6s/src/pages/bussiness/advance/mode.vue +
//     nano/.../mode.vue `this.$reconnect({ delayTime: 30 })` — 30s probe delay.
//   - reconnectProbeTimeoutMs: m6s/nano main.js upgrade() reconnect call
//     `timeout: 600` (seconds) — 600s = 600000ms.
// m6s and nano main.js are byte-identical, so both models share the same values.
const EXPECTED_BEHAVIOR = {
  upgradeProbeStartDelayMs: 20000,
  modeSwitchProbeStartDelayMs: 30000,
  reconnectProbeTimeoutMs: 600000,
  meshRadioStatus: 'txPower',
};

describe('Model Profile: M11R4 (baseline, M6s no-SFP)', () => {
  it('is schema-valid', () => {
    const ok = validate(m11r4Profile);
    expect(validate.errors, JSON.stringify(validate.errors, null, 2)).to.equal(null);
    expect(ok).to.equal(true);
  });

  it('locks profileVersion to 1', () => {
    expect(m11r4Profile.profileVersion).to.equal(1);
  });

  it('declares mercku_mtk7621 as the expected backend (diagnostic only)', () => {
    expect(m11r4Profile.expectedBackends).to.include('mercku_mtk7621');
    expect(m11r4Profile.expectedBackends).to.have.lengthOf(1);
  });

  it('has all four capabilities false (baseline, no hardware differences)', () => {
    expect(m11r4Profile.capabilities.sfp).to.equal(false);
    expect(m11r4Profile.capabilities.poeControl).to.equal(false);
    expect(m11r4Profile.capabilities.fanControl).to.equal(false);
    expect(m11r4Profile.capabilities.frozenConfig).to.equal(false);
  });

  it('uses the delayed-variant behavior values extracted from m6s main.js + mode.vue', () => {
    expect(m11r4Profile.behavior).to.deep.equal(EXPECTED_BEHAVIOR);
  });

  it('does NOT carry frontend-internals behavior (upgrading/Promise finally/error page)', () => {
    expect(m11r4Profile.behavior).to.not.have.property('upgrading');
    expect(m11r4Profile).to.not.have.property('upgrading');
  });
});

describe('Model Profile: M13R0 (nano, fanControl hardware variant)', () => {
  it('is schema-valid', () => {
    const ok = validate(m13r0Profile);
    expect(validate.errors, JSON.stringify(validate.errors, null, 2)).to.equal(null);
    expect(ok).to.equal(true);
  });

  it('locks profileVersion to 1', () => {
    expect(m13r0Profile.profileVersion).to.equal(1);
  });

  it('declares mercku_mtk7621 as the expected backend (same platform family)', () => {
    expect(m13r0Profile.expectedBackends).to.include('mercku_mtk7621');
    expect(m13r0Profile.expectedBackends).to.have.lengthOf(1);
  });

  it('enables fanControl (the only proven hardware difference vs M11R4)', () => {
    expect(m13r0Profile.capabilities.fanControl).to.equal(true);
  });

  it('keeps the other three capabilities false (no SFP/PoE/frozenConfig)', () => {
    expect(m13r0Profile.capabilities.sfp).to.equal(false);
    expect(m13r0Profile.capabilities.poeControl).to.equal(false);
    expect(m13r0Profile.capabilities.frozenConfig).to.equal(false);
  });

  it('shares the delayed-variant behavior with M11R4 (nano main.js is byte-identical)', () => {
    expect(m13r0Profile.behavior).to.deep.equal(EXPECTED_BEHAVIOR);
    expect(m13r0Profile.behavior).to.deep.equal(m11r4Profile.behavior);
  });
});
