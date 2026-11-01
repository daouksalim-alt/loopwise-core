import { buildPage } from './page.mjs';

const initial = JSON.parse(document.getElementById('example-data').textContent);
const fields = Object.fromEntries(['html', 'css', 'js'].map(id => [id, document.getElementById(id)]));
const status = document.getElementById('status');
const preview = document.getElementById('preview');
const undoButton = document.getElementById('undo-reset');
let beforeReset;
let revision = 0;

function current() {
  return Object.fromEntries(Object.entries(fields).map(([key, field]) => [key, field.value]));
}
function fill(values) {
  for (const [key, field] of Object.entries(fields)) field.value = values[key];
}
function run() {
  try {
    const token = String(++revision);
    const page = buildPage({ ...current(), engine: initial.engine, license: initial.license, previewToken: token });
    status.textContent = 'Loading preview…';
    preview.srcdoc = page;
  } catch (error) {
    status.textContent = error.message;
  }
}
window.addEventListener('message', event => {
  if (event.source !== preview.contentWindow || event.data?.loopwiseLab !== String(revision)) return;
  if (event.data.type === 'ready') status.textContent = 'Preview updated. Try your puzzle, then download your page or share feedback.';
  if (event.data.type === 'error') status.textContent = `Preview error: ${String(event.data.message).slice(0, 400)}`;
});
document.getElementById('run').addEventListener('click', run);
document.getElementById('download').addEventListener('click', () => {
  try {
    const page = buildPage({ ...current(), engine: initial.engine, license: initial.license });
    const url = URL.createObjectURL(new Blob([page], { type: 'text/html;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-loopwise-page.html';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    status.textContent = 'Download requested. Keep your HTML file before closing this tab.';
  } catch (error) {
    status.textContent = error.message;
  }
});
document.getElementById('reset').addEventListener('click', () => {
  beforeReset = current();
  fill(initial);
  undoButton.hidden = false;
  run();
});
undoButton.addEventListener('click', () => {
  if (!beforeReset) return;
  fill(beforeReset);
  beforeReset = undefined;
  undoButton.hidden = true;
  run();
});
for (const field of Object.values(fields)) {
  field.addEventListener('input', () => { status.textContent = 'Edits are not saved. Choose Run preview to try them, then download to keep them.'; });
}
fill(initial);
run();
