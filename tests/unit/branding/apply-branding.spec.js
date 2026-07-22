const { expect } = require('chai');

const { applyBranding } = require('../../../unified/src/app/branding/apply-branding.js');

/**
 * Minimal document mock. applyBranding takes `document` as an injectable
 * parameter so we can test it without a DOM. The mock implements only the
 * surface area applyBranding touches: document.title, document.head,
 * document.documentElement (for CSS variables and `lang`), and
 * querySelector for existing favicon links.
 */
function createMockDocument() {
  const headChildren = [];
  const head = {
    appendChild(child) {
      headChildren.push(child);
    },
    querySelector(selector) {
      if (selector === 'link[rel="icon"]') {
        return headChildren.find((c) => c._rel === 'icon') || null;
      }
      return null;
    },
  };
  const documentElement = {
    lang: '',
    style: {
      setProperty(name, value) {
        documentElement.style._props = documentElement.style._props || {};
        documentElement.style._props[name] = value;
      },
      getPropertyValue(name) {
        return (documentElement.style._props || {})[name] || '';
      },
    },
  };
  function createElement(tag) {
    return {
      tagName: tag.toUpperCase(),
      _rel: null,
      _href: null,
      set rel(value) { this._rel = value; },
      get rel() { return this._rel; },
      set href(value) { this._href = value; },
      get href() { return this._href; },
    };
  }
  return {
    title: '',
    head,
    documentElement,
    createElement,
    _headChildren: headChildren,
  };
}

const SAMPLE_PROFILE = {
  profileVersion: 1,
  branding: {
    productName: 'Mercku',
    wifiName: 'Mercku Wi-Fi',
    website: { text: 'www.mercku.com', url: 'https://www.mercku.com' },
    policyUrl: '',
    appDownloadUrl: 'http://onelink.to/mn4tgv',
    languages: ['zh-CN', 'en-US'],
    defaultLanguage: 'en-US',
    theme: {
      '--brand-primary': '#d6001c',
      '--brand-loading': '#d6001c',
    },
    logoUrl: '/static/img/logo.abc123.png',
    faviconUrl: '/static/img/favicon.def456.ico',
    loginBackgroundUrl: '/static/img/login-bg.789xyz.webp',
  },
  policy: {
    disabledCapabilities: [],
    allow2LevelAdmin: false,
    allowTelnet: false,
  },
};

describe('applyBranding(customerProfile, document)', () => {
  it('sets document.title from branding.productName', () => {
    const doc = createMockDocument();
    applyBranding(SAMPLE_PROFILE, doc);
    expect(doc.title).to.equal('Mercku');
  });

  it('sets <html lang> from branding.defaultLanguage', () => {
    const doc = createMockDocument();
    applyBranding(SAMPLE_PROFILE, doc);
    expect(doc.documentElement.lang).to.equal('en-US');
  });

  it('creates a favicon <link rel="icon"> when none exists', () => {
    const doc = createMockDocument();
    applyBranding(SAMPLE_PROFILE, doc);
    const faviconLink = doc._headChildren.find((c) => c._rel === 'icon');
    expect(faviconLink, 'expected a favicon link to be appended').to.exist;
    expect(faviconLink._href).to.equal('/static/img/favicon.def456.ico');
  });

  it('updates the existing favicon <link rel="icon"> href when one already exists', () => {
    const doc = createMockDocument();
    const existing = doc.createElement('link');
    existing.rel = 'icon';
    existing.href = '/old-favicon.ico';
    doc.head.appendChild(existing);
    applyBranding(SAMPLE_PROFILE, doc);
    expect(existing._href).to.equal('/static/img/favicon.def456.ico');
    expect(doc._headChildren.filter((c) => c._rel === 'icon')).to.have.lengthOf(1);
  });

  it('applies theme CSS variables to documentElement.style', () => {
    const doc = createMockDocument();
    applyBranding(SAMPLE_PROFILE, doc);
    expect(doc.documentElement.style.getPropertyValue('--brand-primary')).to.equal('#d6001c');
    expect(doc.documentElement.style.getPropertyValue('--brand-loading')).to.equal('#d6001c');
  });

  it('returns a descriptor with title, faviconUrl, theme, language, logoUrl, loginBackgroundUrl', () => {
    const doc = createMockDocument();
    const descriptor = applyBranding(SAMPLE_PROFILE, doc);
    expect(descriptor).to.deep.equal({
      title: 'Mercku',
      faviconUrl: '/static/img/favicon.def456.ico',
      logoUrl: '/static/img/logo.abc123.png',
      loginBackgroundUrl: '/static/img/login-bg.789xyz.webp',
      theme: {
        '--brand-primary': '#d6001c',
        '--brand-loading': '#d6001c',
      },
      language: 'en-US',
    });
  });

  it('omits loginBackgroundUrl from the descriptor when the profile does not provide one', () => {
    const doc = createMockDocument();
    const profileWithoutLoginBg = {
      ...SAMPLE_PROFILE,
      branding: {
        ...SAMPLE_PROFILE.branding,
        loginBackgroundUrl: undefined,
      },
    };
    const descriptor = applyBranding(profileWithoutLoginBg, doc);
    expect(descriptor).to.not.have.property('loginBackgroundUrl');
    expect(descriptor.logoUrl).to.equal('/static/img/logo.abc123.png');
  });

  it('does not throw when document is undefined (returns descriptor only)', () => {
    // Allows the function to be called from non-DOM contexts (e.g. SSR or
    // pre-render) without crashing — it just skips document mutation.
    let descriptor;
    expect(() => {
      descriptor = applyBranding(SAMPLE_PROFILE, undefined);
    }).to.not.throw();
    expect(descriptor.title).to.equal('Mercku');
    expect(descriptor.language).to.equal('en-US');
  });
});
