// Pure document assembly is shared by preview and download.
export function buildPage({ html, css, js, engine, license = '', previewToken }) {
  // A closing raw-text tag cannot appear literally inside an inline style or
  // script. Reject it rather than silently changing the developer's source.
  if (/<\/style\b/i.test(css)) throw new Error('CSS contains a closing style tag. Keep only CSS in that editor.');
  if (/<\/?script\b|<!--/i.test(engine)) throw new Error('The embedded engine needs a new embedding strategy.');
  if (/<\/script\b/i.test(js)) throw new Error('JavaScript contains a closing script tag. Escape that text as <\\/script inside a JavaScript string.');
  const token = JSON.stringify(previewToken);
  const policy = previewToken === undefined ? '' : `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; base-uri 'none'; form-action 'none'">`;
  const bootstrap = previewToken === undefined ? '' : `<script>
const report = (type, message) => parent.postMessage({ loopwiseLab: ${token}, type, message }, '*');
addEventListener('error', event => report('error', event.message || 'A script could not run.'));
addEventListener('unhandledrejection', event => report('error', String(event.reason)));
<\/script>`;
  const ready = previewToken === undefined ? '' : `\nparent.postMessage({ loopwiseLab: ${token}, type: 'ready' }, '*');`;
  const escapedLicense = license.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${policy}<title>My Loopwise page</title><style>${css}</style></head><body>
${bootstrap}${html}
<details><summary>Loopwise Core MIT license and attribution</summary><pre>${escapedLicense}</pre></details>
<script type="module">
${engine}
${js}${ready}
<\/script></body></html>\n`;
}
