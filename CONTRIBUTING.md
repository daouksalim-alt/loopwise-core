# Contributing

Loopwise Core welcomes focused bug reports and pull requests. Contributions are provided under the project's [MIT license](LICENSE).

## Reproduce before changing

Use Node.js 22 or later and run `npm run verify`. For a generation problem, record the package version, game ID, index, seed, and difficulty. For a daily workout, also record the date string. Avoid including real names, student details, health information, or other private data in seeds and bug reports.

The offline starter is generated from the engine, license and `examples/starter.template.html`. After changing any of these inputs or the package version, run `npm run build:starter` and commit the generated download. `npm run verify` rejects stale output. Edit the template rather than the generated HTML.

Prefer a small change with one clear purpose. Include a regression test that reproduces the behavior before the fix, then verify the full test suite. For calculation or sequence changes, derive the expected answer independently rather than asserting the generator's own stored answer.

## Review expectations

- Keep the runtime free of network, storage, browser-global, and framework dependencies.
- Preserve deterministic output unless a documented correction or version change requires otherwise.
- Document new question fields and update the TypeScript declarations.
- Explain changes to content, difficulty, accessibility assumptions, and answer validation.
- Keep generated outputs and release notes accurate. AI-assisted contributions need the same review and tests as other changes.

The package ships answer keys for local game logic. Do not describe it as secure scoring, a validated assessment, or a therapeutic tool.

## Release process

Run `npm run verify`, exercise the CLI example, inspect the package contents, review the license and provenance, and record relevant output changes. Release publication remains a maintainer action. The npm registry is not currently used; keep `private: true` until an explicit package-publication decision. See [ROADMAP.md](ROADMAP.md) for proposed priorities.
