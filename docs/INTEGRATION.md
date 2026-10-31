# Integrating Loopwise Core

The library produces plain question objects. A host application owns rendering, input, timing, storage, and any scoring. The browser example is a small reference implementation of that boundary; it is not evidence of outside adoption.

## Install in another project

The source is public, but this package is not published to the npm registry. To install the exact local version after cloning the repository:

```sh
# In the loopwise-core checkout:
npm pack --ignore-scripts

# In a separate Node.js ES-module project alongside the checkout:
npm install --ignore-scripts ../loopwise-core/daouksalim-alt-loopwise-core-0.1.1.tgz
```

Use the actual archive filename printed by `npm pack` if the version changes. Import through the public package name:

```js
import { makeQuestion, evaluateAnswer } from '@daouksalim-alt/loopwise-core';
```

The package provides ES modules and declarations for TypeScript. A browser app can use the source module directly, as below, or resolve the package with its existing bundler. The repository's `npm run check:package` installs an archive into a temporary project and exercises every runtime export. `npm run check:types` verifies a strict TypeScript consumer with version 5.9.3 of the compiler; only this compiler check may fetch a development tool from npm.

## Run the browser example

From the repository root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open <http://127.0.0.1:8000/examples/browser/>. Stop the server with Ctrl+C. Opening `index.html` directly through a `file:` URL is insufficient because browsers restrict local ES module imports. Any local static HTTP server can be used instead of Python.

The example imports `../../src/games.js`; there is no build step, package installation, external asset, account, analytics request, or answer storage. It demonstrates all six generators, checking answers, replaying a seed/index/difficulty tuple, and inspecting the original question JSON. The source link opens GitHub only when clicked.

## Minimal host flow

```js
import { makeQuestion, evaluateAnswer } from './src/games.js';

const replay = { gameId: 'math', index: 0, seed: 'lesson-a', difficulty: 2 };
const question = makeQuestion(replay.gameId, replay.index, replay.seed, replay.difficulty);

// Render question.prompt, question.display, and question.options with textContent.
// Convert the selected radio control's value to an integer option index.
const correct = evaluateAnswer(question, 0);
```

For memory questions, submit an array of selected tile indices, from `0` to `8`. Tile order does not matter, and duplicates are rejected. Other tasks accept an integer option index. Avoid passing the visible option text or numeric strings to `evaluateAnswer`.

When persisting a question for replay, also record the package version. Determinism is guaranteed only for a given version and the same inputs. A question object contains its answer; client-side inspection can reveal it, so this design is unsuitable for secure exams or competitive anti-cheat scoring.

## Rendering and accessibility choices

- Use native radio inputs for one-choice tasks and checkboxes for memory tiles. Give every input a visible label.
- Announce answer feedback with a live status region. Keep keyboard focus predictable when regenerating a question.
- Let the player control when the memory pattern is hidden. This example does not impose a time limit; showing it again clears the selection.
- Render `optionLabels` for Odd One Out. The example shows labels as text, which changes the visual challenge but removes dependence on symbol appearance alone.
- Color Clash requires distinguishing the ink color. Provide a clear alternative activity; do not claim that this visual task is accessible to everyone.
- Render question strings as text, rather than HTML. Host-supplied seeds should never be inserted as executable markup.

These implementation choices are not a WCAG conformance assessment. Validate a finished host application with its intended users, browsers, assistive technologies, and content. The finite English content bank limits variety; the project makes no medical, cognitive-benefit, or IQ-validity claims.

## Reproducible reports

When reporting a problem, include the package version or commit, game ID, seed, index, difficulty, browser/runtime, and expected versus observed behavior. The example's “Inspect the generated question” panel supplies the exact output. Do not include personal or sensitive data in a seed or public issue.
