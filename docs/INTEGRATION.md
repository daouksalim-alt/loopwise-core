# Integrating Loopwise Core

The library produces plain question objects. A host application owns rendering, input, timing, storage, and any scoring. The browser example is a small reference implementation of that boundary; it is not evidence of outside adoption.

## Install in another project

From your Node.js 22+ project's root, install version 0.1.2 from its exact GitHub revision.

```sh
npm install --ignore-scripts https://github.com/daouksalim-alt/loopwise-core/archive/961efd0f3b409ae02c204aaace87c0d9ef9bc9cd.tar.gz
```

npm records the archive URL under `@daouksalim-alt/loopwise-core` in your dependencies and its checksum in the default `package-lock.json`. Commit both files so collaborators can install the same revision with `npm ci`. The [runnable Node.js example](../README.md#use-it-in-your-nodejs-project) uses the public package import and checks a player's selected answer. In TypeScript, a literal game ID selects its result type. For example, `makeQuestion('math', 0, 'lesson-a').options` is a string array.

### Install from a local checkout

To try unpublished changes or install offline, pack your local checkout and give npm the archive in your consuming project. The example assumes sibling directories:

```sh
# In the loopwise-core checkout:
npm pack --ignore-scripts

# In your own project:
npm install --offline --ignore-scripts --no-audit ../loopwise-core/daouksalim-alt-loopwise-core-0.1.2.tgz
```

If the version changes, use the archive filename printed by `npm pack`. In either case, import from `@daouksalim-alt/loopwise-core` in your Node.js ES module or bundler entry point.

## Run the browser example

From the repository root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open <http://127.0.0.1:8000/examples/browser/>. Stop the server with Ctrl+C. Opening `index.html` directly through a `file:` URL is insufficient because browsers restrict local ES module imports. Any local static HTTP server can be used instead of Python.

The example imports `../../src/games.js`; there is no build step, package installation, external asset, account, analytics request, or answer storage. It demonstrates all six generators, checking answers, replaying a seed/index/difficulty tuple, and inspecting the original question JSON. The source link opens GitHub only when clicked.

## Minimal host flow

```js
import { makeQuestion, evaluateAnswer } from '@daouksalim-alt/loopwise-core';

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

### Replay a report locally

The replay script is a maintainer tool in the current repository checkout. From that checkout, save the following as `report.json`:

```json
{"version":"0.1.2","gameId":"math","index":7,"seed":"example-only","difficulty":2,"answer":0}
```

Run `node scripts/replay.mjs report.json`. It prints the exact generated question and whether the supplied answer is correct. Omit `answer` to inspect a question without evaluating a response. Memory answers use an array of tile indices; other answers use an integer option index. Replace the sample values with the actual failing inputs, and include expected versus observed behavior and runtime details in your issue.

The command rejects a different library version rather than silently replaying it with the wrong engine. Check out the reported version to investigate historical behavior. It reads a local JSON file, executes no supplied code and makes no network requests. Output includes the answer key. Use synthetic seeds; do not put personal or private data in public reports. This reproduces engine output, not host UI behavior.
