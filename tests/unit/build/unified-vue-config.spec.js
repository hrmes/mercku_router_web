/* eslint-env mocha */
const path = require('path');
const { execFileSync } = require('child_process');
const { expect } = require('chai');

describe('Unified Vue CLI config', () => {
  function loadConfig(env = {}) {
    const configPath = path.resolve(process.cwd(), 'unified/vue.config.js');
    const script = [
      `const config = require(${JSON.stringify(configPath)});`,
      'process.stdout.write(JSON.stringify(config));',
    ].join('\n');
    const value = execFileSync(process.execPath, ['-e', script], {
      cwd: process.cwd(),
      encoding: 'utf8',
      env: { ...process.env, ...env },
    });
    return JSON.parse(value);
  }

  it('does not run legacy Base lint rules during dev-server compilation', () => {
    const configPath = path.resolve(process.cwd(), 'unified/vue.config.js');
    const script = [
      `const config = require(${JSON.stringify(configPath)});`,
      'process.stdout.write(JSON.stringify(config.lintOnSave));',
    ].join('\n');
    const value = execFileSync(process.execPath, ['-e', script], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });

    expect(JSON.parse(value)).to.equal(false);
  });

  it('proxies router API endpoints when a real backend target is configured', () => {
    const config = loadConfig({
      MERCKU_BACKEND_TARGET: 'http://192.168.127.24',
    });

    [
      '/app',
      '/firmware_upload',
      '/file_upload',
      '/log.log',
      '/kernel.log',
      '/configs.dat',
    ].forEach((pathName) => {
      expect(config.devServer.proxy[pathName]).to.deep.include({
        target: 'http://192.168.127.24',
        changeOrigin: true,
      });
    });
  });

  it('does not proxy router endpoints during the default offline preview', () => {
    const config = loadConfig({ MERCKU_BACKEND_TARGET: '' });

    expect(config.devServer).not.to.have.property('proxy');
  });

  it('runs runtime E2E on an isolated offline-preview server', () => {
    const configSource = require('fs').readFileSync(
      path.resolve(process.cwd(), 'playwright.config.ts'),
      'utf8'
    );

    expect(configSource).to.include("RUNTIME_E2E_PORT || '8091'");
    expect(configSource).to.include('UNIFIED_DEV_PORT');
    expect(configSource).to.include('reuseExistingServer: false');
    expect(configSource).to.include("MERCKU_OFFLINE_PREVIEW: '1'");
    expect(configSource).to.include("VUE_APP_OFFLINE_PREVIEW: '1'");
  });
});
