import test from 'node:test';
import assert from 'node:assert/strict';
import { replay } from '../scripts/replay.mjs';
import { GAMES, makeQuestion } from '../src/games.js';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const base = { version, gameId: 'math', index: 7, seed: '😀 replay', difficulty: 2 };
test('JSON reports reproduce all games and correctly check both answer shapes', () => {
  for (const { id } of GAMES) {
    const report = JSON.parse(JSON.stringify({ ...base, gameId: id }));
    const expected = makeQuestion(id, report.index, report.seed, report.difficulty);
    const answer = expected.type === 'memory' ? expected.pattern : expected.answer;
    assert.deepEqual(replay({ ...report, answer }), { version, question: expected, correct: true });
    assert.equal(replay({ ...report, answer: null }).correct, false);
    assert.equal(Object.hasOwn(replay(report), 'correct'), false);
  }
});
test('rejects incompatible versions and incomplete or invalid reproduction inputs', () => {
  for (const input of [null, [], { ...base, version: '0.0.0' }, { ...base, difficulty: undefined }, { ...base, index: -1 }, { ...base, gameId: 'unknown' }]) {
    assert.throws(() => replay(input));
  }
  const { difficulty, ...missing } = base;
  assert.throws(() => replay(missing), /difficulty/);
});
test('CLI returns a failing exit code for a missing report instead of a false success', () => {
  const result = spawnSync(process.execPath, ['scripts/replay.mjs'], { cwd: new URL('../', import.meta.url), encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Usage:/);
});
