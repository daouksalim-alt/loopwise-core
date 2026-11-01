# Try one real integration

The first useful test is a small page of your own: generate a question, render its options, and check the selected answer. This guide aims for a ten-minute trial; it is not a measured setup-time guarantee.

## Start without an installation

For a browser-only trial, open the [integration lab](https://daouksalim-alt.github.io/loopwise-core/examples/lab/). Change a heading under HTML, try a rendering change under JavaScript, choose **Run preview**, then answer the question. **Download your HTML** keeps your edited page, with the engine and its MIT notice included. Edits stay in the tab; there is no autosave, upload or shareable saved draft. The preview blocks networking and runs in an iframe without access to the editor's origin. Only the preview has that network restriction; downloaded pages use ordinary browser behavior.

If you prefer your own editor:

1. Download [loopwise-starter.html](../downloads/loopwise-starter.html) using GitHub's **Download raw file** control, or the download link on the project homepage. Keep the `.html` extension.
2. Open the saved file in a modern browser. The puzzle works offline. No server, package manager, external script, account, or API key is needed.
3. Try an answer. Change the index and generate another question; restore the earlier index to reproduce the first one. Changing the seed creates another repeatable sequence.
4. Open the file in a text editor. Change the heading, the default seed, or the CSS. Search for `YOUR PAGE: start editing here` to find the small host implementation.
5. Use that implementation as a starting point in your own project. Keep the MIT notice when reusing or redistributing the engine.

The starter shows the math generator only. The [full browser example](../examples/browser/) demonstrates all six games and their different output shapes. Do not change the starter's game ID without adapting its renderer to the chosen shape.

## The two calls your page needs

```js
const question = makeQuestion('math', 0, 'my-first-puzzle', 1);
// Render question.display and question.options using textContent.
const correct = evaluateAnswer(question, selectedOptionIndex);
```

`selectedOptionIndex` must be an integer, not the option text or a numeric string. The host page owns focus, timing, progress storage and any score. For a normal package or framework integration, use the [installation guide](INTEGRATION.md) and import those functions from the package rather than embedding the library.

The download is generated from the repository's engine source and includes the MIT license. It is a maintainer-created example, not an independent adopter. It deliberately has no telemetry or progress storage. The source contains answer keys, so it is unsuitable for secure examinations. These recreational questions are not a validated cognitive or medical assessment.

## Tell us what happened

Open the [integration feedback form](https://github.com/daouksalim-alt/loopwise-core/issues/new?template=integration-feedback.yml). A GitHub account is required, and your issue is public. Useful feedback is:

- What you tried to build, and whether it worked in your page.
- The first confusing or blocked step, with a small reproduction if possible.
- Whether you would keep using the library, and the one change that would help most.

A public project link is optional. Do not include private source, personal information, credentials, student details, or health data. You do not need to star the project or publish your work to provide feedback. A demo visit alone does not demonstrate an integration.

## For maintainers

Run `node scripts/build-starter.mjs` after changing the engine, template, version or license. Commit the resulting `downloads/loopwise-starter.html` with its inputs. Run `node scripts/build-starter.mjs --check` to reject stale generated output. Edit `examples/starter.template.html` for interface changes; do not hand-edit the generated download.
