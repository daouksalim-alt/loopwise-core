import test from 'node:test';
import assert from 'node:assert/strict';
import { GAMES, seededRandom, shuffled, makeQuestion, dailyGames, makeWorkout, reasoningSet, evaluateAnswer } from '../src/games.js';

for (const game of GAMES) {
  test(`${game.id}: seeded questions are reproducible and have valid answer structure`, () => {
    for (let seed = 0; seed < 50; seed++) for (let difficulty = 1; difficulty <= 3; difficulty++) for (let index = 0; index < 12; index++) {
      const question = makeQuestion(game.id, index, seed, difficulty);
      assert.deepEqual(question, makeQuestion(game.id, index, seed, difficulty));
      assert.ok(question.explanation.length > 0);
      if (question.type === 'memory') {
        assert.ok(question.pattern.length >= 3 && question.pattern.length <= 6);
        assert.equal(new Set(question.pattern).size, question.pattern.length);
        assert.ok(question.pattern.every(value => Number.isInteger(value) && value >= 0 && value < 9));
        assert.ok(evaluateAnswer(question, [...question.pattern].reverse()));
        assert.equal(evaluateAnswer(question, question.pattern.slice(1)), false);
        assert.equal(evaluateAnswer(question, question.pattern.map(() => question.pattern[0])), false);
      } else {
        assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.options.length);
        assert.ok(evaluateAnswer(question, question.answer));
        assert.equal(evaluateAnswer(question, (question.answer + 1) % question.options.length), false);
        assert.equal(evaluateAnswer(question, String(question.answer)), false);
        if (question.type !== 'odd') assert.equal(new Set(question.options).size, 4);
      }
    }
  });
}

test('arithmetic answers equal independently calculated display expressions', () => {
  const operators = new Set();
  for (let seed = 0; seed < 100; seed++) for (let difficulty = 1; difficulty <= 3; difficulty++) for (let index = 0; index < 3; index++) {
    const question = makeQuestion('math', index, seed, difficulty);
    const match = /^(\d+) ([+−×]) (\d+) = \?$/.exec(question.display);
    assert.ok(match);
    const [, left, operator, right] = match;
    operators.add(operator);
    const expected = operator === '+' ? +left + +right : operator === '−' ? +left - +right : +left * +right;
    assert.equal(+question.options[question.answer], expected);
  }
  assert.equal(operators.size, 3);
});

test('number-trail answers extend the visible sequence rule', () => {
  const rules = new Set();
  for (let seed = 0; seed < 100; seed++) for (let difficulty = 1; difficulty <= 3; difficulty++) for (let index = 0; index < 6; index++) {
    const question = makeQuestion('numbers', index, seed, difficulty);
    const [a, b, c, d] = question.series;
    let expected;
    if (b - a === c - b && c - b === d - c) {
      rules.add('constant'); expected = d + (d - c);
    } else if (b === a * 2 && c === b * 2 && d === c * 2) {
      rules.add('doubling'); expected = d * 2;
    } else {
      rules.add('increasing');
      assert.equal((c - b) - (b - a), 1);
      assert.equal((d - c) - (c - b), 1);
      expected = d + (d - c) + 1;
    }
    assert.equal(+question.options[question.answer], expected);
  }
  assert.equal(rules.size, 3);
});

test('word clues resolve anagrams and the twelve-word deck does not repeat early', () => {
  const sorted = word => [...word].sort().join('');
  for (let seed = 0; seed < 30; seed++) {
    const answers = [];
    for (let index = 0; index < 12; index++) {
      const question = makeQuestion('words', index, seed);
      const correct = question.options[question.answer];
      answers.push(correct);
      assert.equal(sorted(question.display), sorted(correct));
      assert.notEqual(question.display, correct);
      assert.ok(question.clue.length > 0);
    }
    assert.equal(new Set(answers).size, 12);
  }
});

test('color answers identify ink rather than the conflicting printed word', () => {
  const labels = { '#2963cc': 'Blue', '#c4354f': 'Red', '#247953': 'Green', '#7950c7': 'Purple' };
  for (let seed = 0; seed < 100; seed++) {
    const question = makeQuestion('color', 0, seed);
    assert.equal(question.options[question.answer], labels[question.ink]);
    assert.notEqual(question.word, labels[question.ink]);
  }
});

test('odd-one-out has precisely one distinct tile with a matching descriptive label', () => {
  for (let seed = 0; seed < 100; seed++) for (let index = 0; index < 4; index++) {
    const question = makeQuestion('odd', index, seed);
    assert.equal(question.options.length, 12);
    assert.equal(question.optionLabels.length, 12);
    assert.equal(question.options.filter(value => value === question.options[question.answer]).length, 1);
    assert.ok(question.optionLabels[question.answer].startsWith(`Tile ${question.answer + 1}: `));
  }
});

test('daily workouts have three distinct games, five questions each, and explicit date seeds', () => {
  const day = '2026-10-31';
  const games = dailyGames(day);
  assert.equal(games.length, 3);
  assert.equal(new Set(games).size, 3);
  for (let difficulty = 1; difficulty <= 3; difficulty++) {
    const workout = makeWorkout(day, difficulty);
    assert.equal(workout.length, 15);
    assert.deepEqual(workout, makeWorkout(day, difficulty));
    for (const id of games) assert.equal(workout.filter(question => question.gameId === id).length, 5);
  }
  assert.notDeepEqual(makeWorkout(day), makeWorkout('2026-11-01'));
  assert.equal(makeWorkout('2024-02-29').length, 15);
});

test('reasoning sets contain five logical and five numeric questions, with checked answers', () => {
  const known = {
    'All lumens are circles. All circles are shapes. What must be true?': 'All lumens are shapes.',
    'Maya is ahead of Jo. Jo is ahead of Lee. Who is furthest ahead?': 'Maya',
    'A book is to reading as a fork is to…': 'Eating',
    'Some green tokens are round. All round tokens are large. What must be true?': 'Some green tokens are large.',
    'Turn a right-pointing arrow 90° clockwise. Which way does it point?': 'Down',
    'Which item does not belong with the others?': 'Cube',
    'A red tile is left of a blue tile. A yellow tile is between them. What is the order from left to right?': 'Red, yellow, blue',
    'The pattern is triangle, circle, square, triangle, circle, square. What comes next?': 'Triangle'
  };
  const seen = new Set();
  for (let seed = 0; seed < 30; seed++) {
    const questions = reasoningSet(seed);
    assert.equal(questions.length, 10);
    assert.equal(questions.filter(question => question.type === 'reasoning').length, 5);
    assert.deepEqual(questions, reasoningSet(seed));
    for (const question of questions) {
      assert.ok(evaluateAnswer(question, question.answer));
      assert.equal(question.gameId, 'reasoning');
      assert.equal('iq' in question, false);
      if (question.type === 'reasoning') {
        seen.add(question.prompt);
        assert.equal(question.options[question.answer], known[question.prompt]);
      }
    }
  }
  assert.equal(seen.size, 8);
});

test('random streams are bounded, reproducible, and accept empty strings and zero', () => {
  for (const seed of ['', 0, 'demo', -12.5]) {
    const first = seededRandom(seed), second = seededRandom(seed);
    for (let i = 0; i < 1000; i++) {
      const value = first();
      assert.equal(value, second());
      assert.ok(value >= 0 && value < 1);
    }
  }
  assert.equal(seededRandom(1)(), seededRandom('1')());
});

test('shuffle preserves input and elements and checks caller-supplied RNG outputs', () => {
  const input = Object.freeze([1, 2, 3, 4]);
  const result = shuffled(input, seededRandom('shuffle'));
  assert.deepEqual([...result].sort(), [1, 2, 3, 4]);
  assert.deepEqual(input, [1, 2, 3, 4]);
  assert.notEqual(result, input);
  assert.deepEqual(shuffled([], seededRandom('empty')), []);
  for (const value of [NaN, Infinity, -0.1, 1, '0']) assert.throws(() => shuffled([1, 2], () => value), RangeError);
  assert.throws(() => shuffled('bad', () => 0), TypeError);
  assert.throws(() => shuffled([], null), TypeError);
});

test('generator inputs reject invalid IDs, indices, difficulties, and seeds', () => {
  for (const id of ['', 'unknown', null, {}, 'reasoning']) assert.throws(() => makeQuestion(id, 0, 'seed'), RangeError);
  for (const index of [-1, 0.5, NaN, Infinity, '0', Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => makeQuestion('math', index, 'seed'), RangeError);
  for (const difficulty of [0, 4, 1.5, NaN, '1', null]) {
    assert.throws(() => makeQuestion('math', 0, 'seed', difficulty), RangeError);
    assert.throws(() => makeWorkout('2026-10-31', difficulty), RangeError);
  }
  for (const seed of [undefined, null, {}, [], NaN, Infinity, true]) {
    assert.throws(() => seededRandom(seed), TypeError);
    assert.throws(() => makeQuestion('math', 0, seed), TypeError);
    assert.throws(() => reasoningSet(seed), TypeError);
  }
  assert.ok(makeQuestion('math', Number.MAX_SAFE_INTEGER, 0));
});

test('daily date validation rejects invalid dates and implicit timezone values', () => {
  for (const day of ['2025-02-29', '2026-02-30', '2026-13-01', '2026-00-01', '2026-01-00']) {
    assert.throws(() => dailyGames(day), RangeError);
    assert.throws(() => makeWorkout(day), RangeError);
  }
  for (const day of [null, new Date(), '', '2026-1-01', '2026-10-31T00:00:00Z']) assert.throws(() => dailyGames(day), TypeError);
});

test('answer checker rejects malformed questions and answers without coercion', () => {
  assert.equal(evaluateAnswer({ type: 'memory', pattern: [0, 1] }, [, 1]), false);
  for (const question of [undefined, null, false, 0, '', {}, { type: 'unknown', answer: 0 }]) assert.equal(evaluateAnswer(question, 0), false);
  for (const pattern of [[], [0, 0], [-1], [9], ['0'], [NaN], Array(2), null]) assert.equal(evaluateAnswer({ type: 'memory', pattern }, pattern), false);
  for (const answer of ['0', NaN, Infinity, -1, 4, null, false, [0]]) assert.equal(evaluateAnswer({ type: 'choice', options: ['a', 'b', 'c', 'd'], answer: 0 }, answer), false);
  for (const question of [
    { type: 'choice', options: ['a', 'b'], answer: 2 },
    { type: 'choice', options: ['a', 'b'], answer: -1 },
    { type: 'choice', options: ['a', 'b'], answer: '0' },
    { type: 'choice', options: [], answer: 0 },
    { type: 'choice', options: Array(2), answer: 0 },
    { type: 'choice', options: ['', 'b'], answer: 0 }
  ]) assert.equal(evaluateAnswer(question, 0), false);
});

test('catalogue and generated questions cannot mutate future questions', () => {
  assert.throws(() => { GAMES[0].id = 'unknown'; }, TypeError);
  const pristine = makeQuestion('words', 0, 'fresh');
  const changed = makeQuestion('words', 0, 'fresh');
  changed.options[0] = 'changed';
  assert.deepEqual(makeQuestion('words', 0, 'fresh'), pristine);
});

test('package entry point resolves the supported exports', async () => {
  const module = await import('@daouksalim-alt/loopwise-core');
  assert.equal(module.makeWorkout, makeWorkout);
  assert.equal(module.GAMES.length, 6);
});
