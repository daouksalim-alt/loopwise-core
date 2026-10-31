# Proposed roadmap

These are proposed maintenance priorities, not completed work or promises of delivery dates.

## Release process

The owner approved the MIT license for this separate package on October 31, 2026. The initial public source release was version `0.1.0`; current changes are recorded in [CHANGELOG.md](CHANGELOG.md). npm publication is separate and has not occurred.

For each release:

- Review the exact file set and provenance. Exclude the parent's private documentation, assets, account records, credentials, signing material, and commercial plans.
- Run `npm run verify`, the CLI example, the TypeScript consumer check and hosted CI. Exercise the browser example's answer and replay controls. Inspect the package contents and relative documentation links.
- Record the release date, validation results, compatibility changes and known limitations.
- Verify the public repository contains the license and the intended source revision.
- Retain `private: true` in `package.json` until package-registry publication is explicitly authorized.

## Maintenance priorities

1. Preserve reproducible failures: keep generator and answer-validation regression tests, and document version changes that alter seeded output.
2. Improve contributor onboarding: review outside bug reports and clarify the smallest reproducible examples.
3. Review the English question bank for ambiguity and repetition. Expand it only with documented authorship and tests for valid answers.
4. Evaluate a configurable content interface and nonvisual alternatives with users. These interfaces and accessibility equivalence have not been established.
5. Keep a lightweight release record covering fixes, compatibility, test results, and known limitations.

## Evidence of usefulness

Adoption is not yet established. Track independent integrations, reproducible outside bug reports and useful contributions when they actually occur. Link only public evidence or examples shared with permission; never infer users from automated tests, stars, forks, or page views alone. The next meaningful milestone is another developer successfully integrating the library and reporting what was useful or missing.

New contributors can begin with a reproducible question-bank ambiguity report, a renderer improvement tested with keyboard navigation, or an integration example for a different framework. Discuss substantial API changes before implementing them.

## Proposed Codex use

Use Codex to help reproduce reported bugs, draft regression tests, review changes against deterministic behavior, update documentation and type declarations, and prepare release checks. Review proposed changes before merging. API-based automation would be additional work, not an existing integration.
