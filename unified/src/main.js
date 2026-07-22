/**
 * Unified entry point.
 *
 * Wires the real `createApp` into `bootstrap({ createApp })` and mounts the
 * profile-driven Vue application on `#web`. bootstrap owns the
 * identity → Model Profile → Customer Profile → compose → createApp chain;
 * main.js only contributes the createApp implementation and a neutral
 * error page for bootstrap failures.
 *
 * §3.5: when bootstrap cannot start the admin UI (identity invalid, Model
 * Profile unknown, schema rejected, chunk failed), main.js renders a
 * brand-neutral error page with a Retry button (when retryable). The error
 * page is plain HTML — it must NOT depend on Vue or any profile chunk so
 * that bootstrap failures stay diagnosable even if Vue itself is the cause.
 */
import 'base/style/common.scss';
import 'base/style/theme-mode.scss';
import 'base/style/router-model.scss';

import { bootstrap } from './app/bootstrap';
import { buildBootstrapErrorDescriptor } from './app/bootstrap-error';
import { createApp } from './app/create-app';

// Render a brand-neutral bootstrap error page inside `#web`. Kept inline
// (not a Vue component) on purpose: bootstrap may fail before Vue is usable,
// and we want the error page to work even if Vue or any chunk fails to load.
function renderBootstrapError(descriptor) {
  if (typeof document === 'undefined') return;
  const root = document.getElementById('web') || document.body;
  const diagnostics = descriptor.diagnostics.length
    ? `<details style="margin-top:16px;white-space:pre-wrap;color:#666;font-size:12px"><summary>Diagnostics</summary>${descriptor.diagnostics.map((d) => `${d.code || d.level}: ${d.message}`).join('\n')}</details>`
    : '';
  root.innerHTML = [
    '<div style="font-family:-apple-system,system-ui,sans-serif;color:#333;max-width:480px;margin:80px auto;padding:0 16px;text-align:center">',
    `<h1 style="font-size:18px;margin:0 0 12px">Unable to start</h1>`,
    `<p style="font-size:14px;margin:0 0 24px;color:#666">${descriptor.message}</p>`,
    descriptor.retryable
      ? '<button onclick="location.reload()" style="padding:8px 20px;font-size:14px;cursor:pointer">Retry</button>'
      : '<p style="font-size:12px;color:#999">This device is not supported by the installed firmware. Contact your administrator.</p>',
    diagnostics,
    '</div>',
  ].join('');
}

bootstrap({ createApp })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('[bootstrap]', err);
    renderBootstrapError(buildBootstrapErrorDescriptor(err));
  });
