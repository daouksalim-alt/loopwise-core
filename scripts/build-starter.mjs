import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outputPath = join(root, 'downloads/loopwise-starter.html');
assert.ok(process.argv.slice(2).every(arg => arg === '--check'), 'Only --check is supported');
const [template, source, license, packageText] = await Promise.all([
  readFile(join(root, 'examples/starter.template.html'), 'utf8'),
  readFile(join(root, 'src/games.js'), 'utf8'),
  readFile(join(root, 'LICENSE'), 'utf8'),
  readFile(join(root, 'package.json'), 'utf8'),
]);
const { version } = JSON.parse(packageText);
assert.equal(typeof version, 'string');
// Preserve the engine byte-for-byte, and fail rather than silently rewriting it
// if future source could alter the HTML parser's inline-script boundaries.
assert.ok(!/<\/?script\b|<!--/i.test(source), 'Engine contains unsafe inline-script text; review the embedding strategy');
const escapeHtml = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const replacements = new Map([
  ['/*__LOOPWISE_ENGINE__*/', source],
  ['__LOOPWISE_VERSION__', escapeHtml(version)],
  ['__LOOPWISE_LICENSE__', escapeHtml(license)],
]);
let output = template;
for (const [marker, replacement] of replacements) {
  assert.equal(output.split(marker).length, 2, `Expected one ${marker} marker`);
  output = output.replace(marker, () => replacement);
}

if (process.argv.includes('--check')) {
  const current = await readFile(outputPath, 'utf8').catch(() => null);
  assert.equal(current, output, 'Standalone starter is missing or stale. Run node scripts/build-starter.mjs');
  console.log(`Standalone starter matches engine, template, license and version ${version}.`);
} else {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, output, 'utf8');
  console.log(`Built downloads/loopwise-starter.html for version ${version}.`);
}
