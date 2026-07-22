/**
 * Apply Customer Profile branding to the document.
 *
 * Takes a Customer Profile (the runtime-shaped object whose `branding` block
 * already includes webpack-imported `logoUrl` / `faviconUrl` /
 * `loginBackgroundUrl`) and a `document` instance, and:
 *   - sets `document.title` from `branding.productName`
 *   - sets `<html lang>` from `branding.defaultLanguage`
 *   - creates or updates a `<link rel="icon">` from `branding.faviconUrl`
 *   - applies each `branding.theme` entry as a CSS variable on
 *     `documentElement.style`
 *
 * `document` is an injectable parameter so the function is testable without a
 * DOM. When `document` is `undefined` (e.g. SSR / pre-render), the function
 * skips all DOM mutation and returns only the descriptor — this lets Task 7's
 * main.js call it unconditionally.
 *
 * Returns a descriptor of everything applied so Task 7 can hand the same
 * values to Vue components / Vuex without re-deriving them.
 *
 * Task 4 deliberately does NOT import Vue or Vuex — those land in Task 7.
 *
 * @param {Object} customerProfile  validated Customer Profile (branding block
 *   already carries asset URLs from the profile's index.js)
 * @param {Object} [document]  DOM document to mutate. Optional.
 * @returns {Object} frozen descriptor:
 *   { title, faviconUrl, logoUrl, loginBackgroundUrl?, theme, language }
 */
export function applyBranding(customerProfile, document) {
  const branding = (customerProfile && customerProfile.branding) || {};

  const descriptor = {
    title: branding.productName,
    faviconUrl: branding.faviconUrl,
    logoUrl: branding.logoUrl,
    theme: { ...(branding.theme || {}) },
    language: branding.defaultLanguage,
  };
  if (branding.loginBackgroundUrl) {
    descriptor.loginBackgroundUrl = branding.loginBackgroundUrl;
  }
  Object.freeze(descriptor);

  if (!document) {
    return descriptor;
  }

  // Title
  if (typeof branding.productName === 'string') {
    document.title = branding.productName;
  }

  // <html lang>
  if (typeof branding.defaultLanguage === 'string' && document.documentElement) {
    document.documentElement.lang = branding.defaultLanguage;
  }

  // Favicon: reuse an existing <link rel="icon"> if present, else create one.
  if (branding.faviconUrl && document.head) {
    let link = null;
    if (typeof document.head.querySelector === 'function') {
      link = document.head.querySelector('link[rel="icon"]');
    }
    if (!link && typeof document.createElement === 'function') {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    if (link) {
      link.href = branding.faviconUrl;
    }
  }

  // CSS variables on :root.
  if (branding.theme && document.documentElement && document.documentElement.style) {
    Object.keys(branding.theme).forEach((name) => {
      document.documentElement.style.setProperty(name, branding.theme[name]);
    });
  }

  return descriptor;
}
