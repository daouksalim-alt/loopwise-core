import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, copyFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

// Test the archive consumers actually install, not relative source imports.
// The ordinary check is offline. Only --types may download a pinned compiler.
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const npmCli = process.env.npm_execpath;
assert.ok(npmCli, 'Run this check with npm run check:package or npm run check:types');
const packageInfo = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
assert.deepEqual(packageInfo.dependencies ?? {}, {}, 'The engine must have no runtime dependencies');
assert.equal(packageInfo.private, true, 'Publication must remain an explicit maintainer decision');
const temporary = await mkdtemp(join(tmpdir(), 'loopwise-consumer-'));

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', timeout: 120_000 });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, `${command} ${args.join(' ')} failed\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}

function npm(args, cwd) {
  return run(process.execPath, [npmCli, ...args], cwd);
}

try {
  const [archive] = JSON.parse(npm(['pack', '--ignore-scripts', '--json', '--pack-destination', temporary], root));
  assert.equal(archive.name, packageInfo.name);
  assert.equal(archive.version, packageInfo.version);
  const paths = new Set(archive.files.map(file => file.path));
  for (const path of ['package.json', 'src/games.js', 'src/games.d.ts', 'LICENSE', 'README.md']) {
    assert.ok(paths.has(path), `${path} missing from packed package`);
  }
  assert.equal(archive.bundled.length, 0, 'No bundled runtime dependencies expected');

  const consumer = join(temporary, 'consumer');
  await mkdir(consumer);
  await writeFile(join(consumer, 'package.json'), JSON.stringify({ name: 'loopwise-consumer-check', private: true, type: 'module' }));
  npm(['install', '--offline', '--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=false', '--cache', join(temporary, 'cache'), join(temporary, archive.filename)], consumer);

  await writeFile(join(consumer, 'check.mjs'), `
import assert from 'node:assert/strict';
import { GAMES, makeQuestion, evaluateAnswer, makeWorkout, reasoningSet, seededRandom, shuffled, dailyGames } from ${JSON.stringify(packageInfo.name)};
assert.equal(GAMES.length, 6);
for (const game of GAMES) {
  const question = makeQuestion(game.id, 0, 'installed-consumer', 2);
  assert.deepEqual(question, makeQuestion(game.id, 0, 'installed-consumer', 2));
  assert.equal(evaluateAnswer(question, question.type === 'memory' ? question.pattern : question.answer), true);
  assert.equal(evaluateAnswer(question, null), false);
}
assert.equal(makeWorkout('2026-10-31', 2).length, 15);
assert.equal(reasoningSet('installed-consumer').length, 10);
assert.equal(new Set(dailyGames('2026-10-31')).size, 3);
assert.deepEqual(shuffled([1, 2, 3], seededRandom('consumer')), shuffled([1, 2, 3], seededRandom('consumer')));
`);
  run(process.execPath, ['check.mjs'], consumer);
  console.log(`Packed ${packageInfo.name}@${packageInfo.version}: offline install and all public runtime exports passed.`);

  if (process.argv.includes('--types')) {
    await copyFile(join(root, 'tests/types/consumer.ts'), join(consumer, 'consumer.ts'));
    await copyFile(join(root, 'tests/types/tsconfig.json'), join(consumer, 'tsconfig.json'));
    // Compiler is a development check only; it never enters the published archive.
    npm(['exec', '--yes', '--ignore-scripts', '--fetch-retries=0', '--fetch-timeout=15000', '--package=typescript@5.9.3', '--', 'tsc', '--project', join(consumer, 'tsconfig.json')], root);
    console.log('Installed-package consumer compiled with TypeScript 5.9.3 (strict, no emit).');
  }
} finally {
  await rm(temporary, { recursive: true, force: true });
}
