# Loopwise Core

Deterministic puzzle generation and answer checking for small learning and recreational game projects. The same inputs reproduce the same questions, making bug reports and regression tests easier to investigate.

**Status:** `0.1.1`, October 31, 2026. Package name: `@daouksalim-alt/loopwise-core`. The source is available under the [MIT license](LICENSE). It has not been published to npm, and external adoption is not yet established.

The package extracts game logic from Salim Daouk's Loopwise project into a small module with no runtime dependencies. It contains no account system, analytics, storage, networking, ads, or billing. A separate browser example shows how to render and answer the generated questions.

## Try the local package

Use Git and Node.js 22 or later. The verification command includes an offline package installation in a temporary directory; it does not fetch runtime dependencies.

```sh
git clone https://github.com/daouksalim-alt/loopwise-core.git
cd loopwise-core
npm run verify
npm run example
```

To try the browser example, run `python3 -m http.server 8000 --bind 127.0.0.1` from the repository root and open <http://localhost:8000/examples/browser/>. It uses the same exported module, with editable seed, game and difficulty controls. See the [integration guide](docs/INTEGRATION.md) for consumer installation and rendering details.

The package checks validate the exported API from an installed tarball, not just source-relative imports. `npm run check:types` additionally checks a TypeScript consumer with the pinned compiler used in CI; this separate check requires npm registry access on first use.

```js
import { makeQuestion, evaluateAnswer, makeWorkout } from './src/games.js';

const question = makeQuestion('math', 0, 'classroom-demo', 2);
console.log(question.display, question.options);

// The consuming application collects the player's selected option index.
const selectedOption = 0;
console.log(evaluateAnswer(question, selectedOption));

// Supply the intended local calendar date explicitly.
const workout = makeWorkout('2026-10-31', 2);
console.log(workout.length); // 15 questions, across three games
```

Browser applications can import the same ES module when served over HTTP. The library does not read the system clock or infer a time zone. The host application chooses the date and renders the questions.

## Games and output

| Game ID | Activity | Main output |
| --- | --- | --- |
| `sequence` | Remember a tile pattern | `pattern` of unique indices in a 3 × 3 grid |
| `color` | Identify ink color despite a conflicting word | `word`, `ink`, four `options` |
| `numbers` | Continue a number sequence | `series`, four `options` |
| `math` | Addition, subtraction, or multiplication | `display`, four `options` |
| `words` | Unscramble a word using a clue | `display`, `clue`, four `options` |
| `odd` | Identify one different symbol | Twelve `options` and text `optionLabels` |

Questions include a prompt and explanation. Choice questions include the correct option index in `answer`; memory questions include the target tiles in `pattern`. These values are deliberately inspectable and are unsuitable for competitive scoring or anti-cheat enforcement on an untrusted client.

## API

| Export | Purpose |
| --- | --- |
| `GAMES` | Read-only game metadata |
| `seededRandom(seed)` | Reproducible pseudo-random generator; not cryptographic |
| `shuffled(array, rng)` | Return a shuffled copy using the supplied generator |
| `makeQuestion(gameId, index, seed, difficulty = 1)` | Generate one question |
| `dailyGames(day)` | Select three distinct game IDs for a date |
| `makeWorkout(day, difficulty = 1)` | Generate five questions for each selected game |
| `reasoningSet(seed)` | Generate ten explained recreational reasoning questions |
| `evaluateAnswer(question, answer)` | Check a choice index or memory tile array |

Use a non-negative safe integer for `index`, a string or finite number for `seed`, and integer difficulty `1`, `2`, or `3`. Numeric and string versions of a seed, such as `1` and `'1'`, intentionally identify the same sequence. Dates must be real calendar dates in `YYYY-MM-DD` format. Invalid generator inputs are rejected; invalid answer submissions return `false`.

Memory answers may list the target tiles in any order, but must contain exactly the target set without duplicates. Choice answers must be integer indices, not numeric strings. Difficulty changes the relevant generators; not every game has a different rule at each difficulty.

Determinism applies to the same package version and inputs. Persist the package version with a seed when long-term replay matters. Version changes may alter output; changes to generation should be documented and tested.

## Scope and accessibility

The package is for recreation and learning. It does not measure IQ, diagnose cognitive conditions, provide treatment, or establish a health benefit. The source contains a finite English word and reasoning bank, so repeated use eventually repeats content.

The host application is responsible for keyboard controls, focus order, readable sizing, timing, motion preferences, and assistive-technology testing. `optionLabels` provides descriptions for Odd One Out renderers. The ink-color task is inherently visual and is not accessible to everyone; offer another activity where needed. Supplying text descriptions does not establish equivalent task difficulty or complete accessibility.

## Maintenance and release

See [contributing](CONTRIBUTING.md), [security](SECURITY.md), [provenance](PROVENANCE.md), and the [proposed roadmap and release process](ROADMAP.md). A CI workflow is included for Node.js 22 and 24. Check the repository's Actions page for current hosted results; local verification is described in [the changelog](CHANGELOG.md).

The MIT license covers this standalone package. The parent Loopwise application and its repository remain private and all rights reserved. The `private: true` flag in `package.json` prevents accidental npm publication; it does not restrict the public source repository or its MIT license.
