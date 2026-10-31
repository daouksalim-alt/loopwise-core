# Proposed roadmap

These are proposed maintenance priorities, not completed work or promises of delivery dates.

## Release process

The owner approved the MIT license for this separate package on October 31, 2026. The initial public source release is version `0.1.0`. npm publication is separate and has not occurred.

For each release:

- Review the exact file set and provenance. Exclude the parent's private documentation, assets, account records, credentials, signing material, and commercial plans.
- Run local verification, the CLI example and hosted CI. Inspect the package contents and relative documentation links.
- Record the release date, validation results, compatibility changes and known limitations.
- Verify the public repository contains the license and the intended source revision.
- Retain `private: true` in `package.json` until package-registry publication is explicitly authorized.

## Maintenance priorities

1. Preserve reproducible failures: keep generator and answer-validation regression tests, and document version changes that alter seeded output.
2. Improve contributor onboarding: review outside bug reports and clarify the smallest reproducible examples.
3. Review the English question bank for ambiguity and repetition. Expand it only with documented authorship and tests for valid answers.
4. Evaluate a configurable content interface and nonvisual alternatives with users. These interfaces and accessibility equivalence have not been established.
5. Keep a lightweight release record covering fixes, compatibility, test results, and known limitations.

## Proposed Codex use

Use Codex to help reproduce reported bugs, draft regression tests, review changes against deterministic behavior, update documentation and type declarations, and prepare release checks. Review proposed changes before merging. API-based automation would be additional work, not an existing integration.
