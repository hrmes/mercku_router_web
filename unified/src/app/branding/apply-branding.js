/* eslint-disable import/prefer-default-export */
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
 * `document` is injectable; without it the function only returns the branding
 * descriptor.
 *
 * @param {Object} customerProfile  validated Customer Profile (branding block
 *   already carries asset URLs from the profile's index.js)
 * @param {Object} [document]  DOM document to mutate. Optional.
 * @returns {Object} frozen descriptor:
 *   { title, faviconUrl, logoUrl, loginBackgroundUrl?, theme, language }
 */
function hexToRgba(hex, alpha) {
  const match = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || '');
  if (!match) return hex;
  const channels = match.slice(1).map(channel => parseInt(channel, 16));
  return `rgba(${channels.join(', ')}, ${alpha})`;
}

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

  // The legacy header always initialized a theme class before rendering.
  // Without one, theme-mode.scss follows prefers-color-scheme and a fresh
  // unified session can unexpectedly start in the dark theme. Keep an
  // explicit light/dark choice, otherwise use the product default (light).
  if (document.documentElement) {
    const root = document.documentElement;
    const className = typeof root.getAttribute === 'function'
      ? root.getAttribute('class') || ''
      : root.className || '';
    const classes = String(className).split(/\s+/).filter(Boolean);
    if (!classes.includes('light') && !classes.includes('dark')) {
      classes.push('light');
      if (typeof root.setAttribute === 'function') {
        root.setAttribute('class', classes.join(' '));
      } else {
        root.className = classes.join(' ');
      }
    }
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

  // CSS variables on :root. Legacy components use semantic variables such
  // as --primary-color rather than the profile contract's --brand-primary,
  // so derive the small compatibility set here in one centralized place.
  if (branding.theme && document.documentElement && document.documentElement.style) {
    Object.keys(branding.theme).forEach((name) => {
      document.documentElement.style.setProperty(name, branding.theme[name]);
    });
    const primary = branding.theme['--brand-primary'];
    if (primary) {
      const secondary = branding.theme['--brand-secondary'] || primary;
      const tertiary = branding.theme['--brand-tertiary'] || secondary;
      const buttonGradient = `linear-gradient(95deg, ${primary}, ${secondary} 45%, ${tertiary})`;
      const accentGradient = `linear-gradient(104deg, ${primary}, ${secondary} 42%, ${tertiary})`;
      const checkedGradient = `linear-gradient(315deg, ${tertiary}, ${secondary} 55%, ${primary})`;
      const headerGradient = `linear-gradient(225deg, ${tertiary} 30%, ${secondary} 55%, ${primary})`;

      [
        '--primary-color',
        '--switch_on_icon-color',
        '--tag_text-color',
        '--aside_after-bgc',
      ].forEach((name) => {
        document.documentElement.style.setProperty(name, primary);
      });
      const derivedTheme = {
        '--button-bgc': buttonGradient,
        '--button-boxshadow': `0 10px 20px -5px ${hexToRgba(secondary, 0.2)}`,
        '--common_btn_default-bgimg': accentGradient,
        '--button_default-bgimg': `linear-gradient(to right, var(--common_card-bgc), var(--common_card-bgc)), ${accentGradient}`,
        '--checkbox_checked-bgc': checkedGradient,
        '--switch_checked-color': buttonGradient,
        '--header_selected-bgc': headerGradient,
        '--header_selected_icon-textshadow': `0 3px 8px ${hexToRgba(primary, 0.3)}`,
        '--asdie_selected-bgc': `linear-gradient(-50deg, ${secondary} 30%, ${primary} 80%)`,
      };
      Object.keys(derivedTheme).forEach((name) => {
        document.documentElement.style.setProperty(name, derivedTheme[name]);
      });
    }
  }

  return descriptor;
}
