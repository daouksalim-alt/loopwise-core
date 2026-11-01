import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildPage } from '../examples/lab/page.mjs';

test('lab export preserves the exact current engine, license and developer edits', async () => {
  const lab = await readFile(new URL('../examples/lab/index.html', import.meta.url), 'utf8');
  const data = JSON.parse(lab.match(/<script id="example-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
  const source = await readFile(new URL('../src/games.js', import.meta.url), 'utf8');
  assert.equal(data.engine, source);
  assert.equal(data.license, await readFile(new URL('../LICENSE', import.meta.url), 'utf8'));
  const page = buildPage({ ...data, js: data.js + '\n// My own integration edit' });
  assert.ok(page.includes(source));
  assert.ok(page.includes('MIT License'));
  assert.ok(page.includes('My own integration edit'));
  assert.ok(!page.includes('parent.postMessage'));
  assert.ok(!page.includes('Content-Security-Policy'));
  assert.ok(buildPage({ ...data, html: '<h1>Entirely replaced host</h1>' }).includes('MIT License'));
});
test('lab preview has an isolated document policy and revision-specific status', () => {
  const page = buildPage({ html: '<h1>Mine</h1>', css: 'h1{color:green}', js: 'const a = 1;', engine: 'export const version = 1;', previewToken: '7' });
  assert.ok(page.includes("connect-src 'none'"));
  assert.ok(page.includes("form-action 'none'"));
  assert.ok(page.includes('loopwiseLab: "7"'));
  assert.ok(page.includes("type: 'ready'"));
});
test('lab rejects raw-text boundaries instead of silently altering source', () => {
  const values = { html: '', css: '', js: '', engine: '' };
  assert.throws(() => buildPage({ ...values, css: '</style><script>' }), /closing style tag/);
  assert.throws(() => buildPage({ ...values, js: 'const x="</script>"' }), /closing script tag/);
  assert.throws(() => buildPage({ ...values, engine: '<script>' }), /embedding strategy/);
  assert.doesNotThrow(() => buildPage({ ...values, js: 'const x="<\\/script>"' }));
});
