const { expect } = require('chai');

const { customerProfileLoaders } = require('../../../unified/src/profiles/customers/registry.js');

describe('customerProfileLoaders registry', () => {
  it('is frozen (static mapping, not mutable at runtime)', () => {
    expect(Object.isFrozen(customerProfileLoaders)).to.equal(true);
  });

  it('declares registered customer IDs (0001 Mercku + 0029 JUNET + 0032 Viaero)', () => {
    expect(Object.keys(customerProfileLoaders).sort()).to.deep.equal(['0001', '0029', '0032']);
  });

  it('does NOT declare a "neutral" key (neutral is the fallback for unknown customerId, not a registered profile)', () => {
    expect(customerProfileLoaders).to.not.have.property('neutral');
  });

  ['0001', '0029', '0032'].forEach((id) => {
    it(`the "${id}" loader is a function returning a Promise`, () => {
      const loader = customerProfileLoaders[id];
      expect(loader).to.be.a('function');
      const result = loader();
      expect(result).to.be.an.instanceof(Promise);
      // Don't await - we only assert the loader returns a Promise (i.e. is a
      // dynamic import). Awaiting would pull in the chunk loader at test time,
      // which mocha-webpack handles but doesn't need here.
      result.catch(() => {});
    });
  });
});
