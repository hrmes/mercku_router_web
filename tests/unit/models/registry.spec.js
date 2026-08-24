const { expect } = require('chai');

const { modelProfileLoaders } = require('../../../unified/src/profiles/models/registry.js');

describe('modelProfileLoaders registry', () => {
  it('is frozen (static mapping, not mutable at runtime)', () => {
    expect(Object.isFrozen(modelProfileLoaders)).to.equal(true);
  });

  it('declares all eight model IDs (six legacy build dirs -> eight MODEL_IDs)', () => {
    expect(Object.keys(modelProfileLoaders).sort()).to.deep.equal(
      ['GA630', 'M11R1', 'M11R2', 'M11R4', 'M13R0', 'M16R0', 'M6R0', 'M8']
    );
  });

  it('does NOT declare a fallback key (unknown modelId fails-closed, no admin UI)', () => {
    expect(modelProfileLoaders).to.not.have.property('neutral');
    expect(modelProfileLoaders).to.not.have.property('default');
  });

  // Spot-check two representative loaders (baseline + hardware variant).
  // Every loader must be a function returning a Promise (dynamic import).
  ['M11R4', 'M13R0', 'M6R0', 'GA630'].forEach((id) => {
    it(`the ${id} loader is a function returning a Promise`, () => {
      const loader = modelProfileLoaders[id];
      expect(loader).to.be.a('function');
      const result = loader();
      expect(result).to.be.an.instanceof(Promise);
      // Don't await - we only assert the loader returns a Promise (i.e. is a
      // dynamic import). Awaiting would pull in the chunk loader at test time.
      result.catch(() => {});
    });
  });
});
