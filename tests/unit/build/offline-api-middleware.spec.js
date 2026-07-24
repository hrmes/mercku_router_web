/* eslint-env mocha */
const { expect } = require('chai');

const {
  getMockResult,
} = require('../../../unified/dev/offline-api-middleware.js');

describe('offline-api-middleware fixtures', () => {
  it('allows login and returns an admin role', () => {
    expect(getMockResult('router.login')).to.deep.equal({ role: 'admin' });
  });

  it('returns router mode for post-login bootstrap', () => {
    expect(getMockResult('mesh.mode.get')).to.deep.equal({ mode: 'router' });
  });

  it('provides both Wi-Fi bands for the WLAN page', () => {
    const result = getMockResult('mesh.meta.get');
    expect(result.bands['2.4G'].ssid).to.be.a('string').that.is.not.empty;
    expect(result.bands['5G'].ssid).to.be.a('string').that.is.not.empty;
  });

  it('provides the nested dashboard response shapes', () => {
    expect(getMockResult('mesh.node.get')).to.be.an('array').that.is.not.empty;
    expect(getMockResult('mesh.device.count.get').count).to.equal(3);
    expect(getMockResult('mesh.info.wan.stats.get').speed.realtime.down).to.be.a('number');
  });

  it('provides the Guest Wi-Fi response shape expected by the reused page', () => {
    const [guest] = getMockResult('mesh.guestwifi.get');

    expect(guest.enabled).to.equal(false);
    expect(guest.bands['2.4G'].ssid).to.be.a('string').that.is.not.empty;
    expect(guest.bands['5G'].ssid).to.be.a('string').that.is.not.empty;
  });

  it('returns an empty successful result for unmapped methods', () => {
    expect(getMockResult('preview.unknown')).to.deep.equal({});
  });
});
