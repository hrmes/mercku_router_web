const { expect } = require('chai');

const {
  CAPABILITY_KEYS,
} = require('../../../unified/src/app/profiles/capabilities.js');
const m11r4Profile = require('../../../unified/src/profiles/models/M11R4/profile.json');
const m13r0Profile = require('../../../unified/src/profiles/models/M13R0/profile.json');

/**
 * Capability anti-aliasing guard. The Model Profile schema
 * (additionalProperties: false on `capabilities`) already rejects unknown
 * keys, but this test also asserts at the JS level that no profile smuggles in
 * a `*Api` / platform / backend engineering name as a capability. The single
 * source of truth is CAPABILITY_KEYS in capabilities.js.
 */
describe('Model Profile capabilities (anti-aliasing)', () => {
  it('CAPABILITY_KEYS is exactly the v1 four (sfp/poeControl/fanControl/frozenConfig)', () => {
    expect([...CAPABILITY_KEYS].sort()).to.deep.equal(
      ['fanControl', 'frozenConfig', 'poeControl', 'sfp']
    );
  });

  it('M11R4 capability keys are exactly CAPABILITY_KEYS (no aliases)', () => {
    expect(Object.keys(m11r4Profile.capabilities).sort()).to.deep.equal(
      [...CAPABILITY_KEYS].sort()
    );
  });

  it('M13R0 capability keys are exactly CAPABILITY_KEYS (no aliases)', () => {
    expect(Object.keys(m13r0Profile.capabilities).sort()).to.deep.equal(
      [...CAPABILITY_KEYS].sort()
    );
  });

  it('M11R4 carries no *Api / platform / backend engineering names', () => {
    const keys = Object.keys(m11r4Profile.capabilities);
    keys.forEach((k) => {
      expect(k).to.not.match(/Api$/);
      expect(k).to.not.match(/^(mtk|mediatek|mercku_|platform)/i);
    });
  });

  it('M13R0 carries no *Api / platform / backend engineering names', () => {
    const keys = Object.keys(m13r0Profile.capabilities);
    keys.forEach((k) => {
      expect(k).to.not.match(/Api$/);
      expect(k).to.not.match(/^(mtk|mediatek|mercku_|platform)/i);
    });
  });

  it('the ONLY capability difference between M11R4 and M13R0 is fanControl', () => {
    const diffs = [];
    CAPABILITY_KEYS.forEach((k) => {
      if (m11r4Profile.capabilities[k] !== m13r0Profile.capabilities[k]) {
        diffs.push(k);
      }
    });
    expect(diffs).to.deep.equal(['fanControl']);
  });

  it('M11R4 is the all-false baseline', () => {
    CAPABILITY_KEYS.forEach((k) => {
      expect(m11r4Profile.capabilities[k], `M11R4 ${k}`).to.equal(false);
    });
  });

  it('M13R0 sets fanControl=true and leaves the rest false', () => {
    expect(m13r0Profile.capabilities.fanControl).to.equal(true);
    CAPABILITY_KEYS.forEach((k) => {
      if (k === 'fanControl') return;
      expect(m13r0Profile.capabilities[k], `M13R0 ${k}`).to.equal(false);
    });
  });
});
