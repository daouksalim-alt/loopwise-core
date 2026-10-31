# Changelog

## 0.1.1 — October 31, 2026

- Fix Unicode seed hashing: all UTF-16 code units now participate. Previously, different emoji sharing a high surrogate could generate identical question streams.
- Add a regression that reproduces that defect and preserves known ASCII and Arabic BMP seed streams. Outputs for seeds containing non-BMP characters change in this version; persist the package version when replaying old questions. This is still a noncryptographic, finite hash, not a guarantee of collision-free seeds.
- Add a dependency-free browser integration example with labeled controls, keyboard-operable answers, and announced feedback.
- Add an offline packed-package installation/import check and a TypeScript consumer check to the Node.js 22/24 CI workflow.
- Document obtaining, installing and integrating the package.

The existing 10,800 generated-question combinations measure test coverage, not users. See the repository's Actions page for the checks on the exact commit. No npm registry publication or verified external adoption is claimed.

## 0.1.0 — initial public source release, October 31, 2026

- Extract six seeded recreational puzzle generators, daily workouts, reasoning sets and answer validation from the owner's Loopwise source.
- Add a standalone ES-module package, TypeScript declarations and a Node.js example.
- Validate public inputs and reject malformed answers; freeze the game catalogue.
- Add independent correctness and regression tests, including 10,800 generated-question combinations.
- Include contributor, security, provenance and proposed maintenance documentation.

Verification: all 20 tests and the CLI example passed locally on Node.js 24.22.1. TypeScript declarations were reviewed but not compiler-tested. Hosted CI status is reported separately in the repository's Actions page.

Released under MIT with owner approval. No npm publication or outside adoption is established. The package metadata retains `private: true` solely to prevent accidental npm publication. Deterministic replay is version-specific; the extracted implementation adds input validation and explicit 32-bit random-state rollover.
