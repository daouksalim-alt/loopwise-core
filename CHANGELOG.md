# Changelog

## 0.1.0 — initial public source release, October 31, 2026

- Extract six seeded recreational puzzle generators, daily workouts, reasoning sets and answer validation from the owner's Loopwise source.
- Add a standalone ES-module package, TypeScript declarations and a Node.js example.
- Validate public inputs and reject malformed answers; freeze the game catalogue.
- Add independent correctness and regression tests, including 10,800 generated-question combinations.
- Include contributor, security, provenance and proposed maintenance documentation.

Verification: all 20 tests and the CLI example passed locally on Node.js 24.22.1. TypeScript declarations were reviewed but not compiler-tested. Hosted CI status is reported separately in the repository's Actions page.

Released under MIT with owner approval. No npm publication or outside adoption is established. The package metadata retains `private: true` solely to prevent accidental npm publication. Deterministic replay is version-specific; the extracted implementation adds input validation and explicit 32-bit random-state rollover.
