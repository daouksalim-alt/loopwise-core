import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
assert.ok(process.argv.slice(2).every(arg => arg === '--check'), 'Only --check is supported');
const [template, starter, engine, license, packageText] = await Promise.all([
  readFile(join(root, 'examples/lab.template.html'), 'utf8'),
  readFile(join(root, 'downloads/loopwise-starter.html'), 'utf8'),
  readFile(join(root, 'src/games.js'), 'utf8'),
  readFile(join(root, 'LICENSE'), 'utf8'),
  readFile(join(root, 'package.json'), 'utf8'),
]);
const css = starter.match(/<style>([\s\S]*?)<\/style>/)?.[1].trim();
const html = starter.match(/<body>([\s\S]*?)<script type="module">/)?.[1].trim().replace(/<details><summary>MIT license and attribution<\/summary><pre>[\s\S]*?<\/pre><\/details>/, '');
const js = starter.match(/\/\/ ===== YOUR PAGE: start editing here =====([\s\S]*?)\/\/ ===== END YOUR PAGE =====/)?.[1].trim();
assert.ok(css && html && js, 'Starter structure changed; review lab extraction');
assert.ok(!/<\/?script\b|<!--/i.test(engine), 'Engine contains unsafe inline script text');
const data = JSON.stringify({ html, css, js, engine, license, version: JSON.parse(packageText).version }).replaceAll('<', '\\u003c');
assert.equal(template.split('__LOOPWISE_LAB_DATA__').length, 2);
const output = template.replace('__LOOPWISE_LAB_DATA__', () => data);
const path = join(root, 'examples/lab/index.html');
if (process.argv.includes('--check')) {
  assert.equal(await readFile(path, 'utf8').catch(() => null), output, 'Integration lab is stale. Run npm run build:lab');
  console.log('Integration lab matches the current starter and engine.');
} else {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, output, 'utf8');
  console.log('Built examples/lab/index.html.');
}
