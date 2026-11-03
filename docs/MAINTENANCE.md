# Maintenance and verification

Loopwise Core is maintained by Salim Daouk (`daouksalim-alt`) with AI-assisted development. This page links reproducible evidence for developers evaluating the library. See [source provenance](../PROVENANCE.md) for its origin and [the MIT license](../LICENSE) for reuse terms.

## What is available

The library provides six seeded recreational puzzle generators and answer checking for browser and Node.js applications. Consumers choose their own interface; the engine has no runtime dependencies, accounts, storage, networking or server requirement.

- [Try all six games](https://daouksalim-alt.github.io/loopwise-core/examples/browser/).
- [Edit an integration in the browser](https://daouksalim-alt.github.io/loopwise-core/examples/lab/) and download the resulting HTML.
- [Download the offline starter](https://daouksalim-alt.github.io/loopwise-core/downloads/loopwise-starter.html).
- Follow [installation and integration instructions](INTEGRATION.md) or the [integration trial](QUICKSTART.md).

The repository is public. The package is not published to npm. The source and browser examples are maintainer-created work, not evidence of outside adoption.

## Evidence snapshot — November 2, 2026

| Maintenance claim | Inspectable evidence |
| --- | --- |
| A tagged release with a documented compatibility change | [Version 0.1.1](https://github.com/daouksalim-alt/loopwise-core/releases/tag/v0.1.1) and [changelog](../CHANGELOG.md) |
| A concrete seed-handling defect was fixed | [Release commit](https://github.com/daouksalim-alt/loopwise-core/commit/31a3fc36044459bf26c1689ec2fee28d5af7817c), including the Unicode regression |
| Automated verification succeeds on Node.js 22 and 24 | [Verify run 41347883554](https://github.com/daouksalim-alt/loopwise-core/actions/runs/41347883554), for code revision `62812edd6f94730bcdf08fba2758a7cf3d4a5798` |
| Consumers can import the installed archive and compile a strict TypeScript example | [Package checks](../scripts/check-package.mjs), [TypeScript fixture](../tests/types/consumer.ts), and the same hosted Verify run |
| Downloadable examples match their source | [CI workflow](../.github/workflows/ci.yml), [starter check](../scripts/build-starter.mjs), and [lab check](../scripts/build-lab.mjs) |
| The browser integration lab is publicly deployed | [Pages deployment 41347883352](https://github.com/daouksalim-alt/loopwise-core/actions/runs/41347883352) |
| External use is measured separately from tests | [Independent-use record](ADOPTION.md) |

The snapshot links a particular code revision. For later revisions, consult [current Verify runs](https://github.com/daouksalim-alt/loopwise-core/actions/workflows/ci.yml).

## Reproduce the checks

From a checkout, with Node.js 22 or later:

```sh
npm run verify
npm run check:types
npm run example
```

`verify` checks syntax, generated examples, runtime tests and a packed-package installation. `check:types` installs the packed package into a temporary consumer and checks its declarations with the pinned TypeScript compiler; first use requires npm registry access.

For browser changes, exercise correct and incorrect answers, replay controls, keyboard navigation, and the edited-page download. Automated checks alone do not establish full browser or accessibility coverage.

## Example of maintenance: Unicode seed handling

An internal AI-assisted review found that the seed hash used `for…of` with `charCodeAt(0)`. For supplementary Unicode characters, that retained only one UTF-16 code unit, allowing different emoji to produce identical streams. Version 0.1.1 hashes every code unit and adds a regression check. Existing ASCII and Arabic BMP fixtures are preserved; seeded output for non-BMP input changes.

This is a finite, noncryptographic hash, so other collisions remain possible. A useful replay report includes the package version, game ID, seed, index and difficulty. Pin the version when comparing older saved questions.

## How feedback becomes a release

1. Use the [integration-feedback form](https://github.com/daouksalim-alt/loopwise-core/issues/new?template=integration-feedback.yml) or report a bug through [Issues](https://github.com/daouksalim-alt/loopwise-core/issues).
2. Reproduce the problem and preserve its inputs. Mark unverified reports as such.
3. Add a focused regression check and review compatibility, declarations and examples.
4. Run the checks above, document behavior changes, and publish a release when warranted.
5. Ask the reporter to retry and record the actual result with permission.

This is the intended workflow; it does not imply that outside issues or contributions have already arrived. [Proposed priorities](../ROADMAP.md) remain dependent on actual use and feedback.

## Current limits

External adoption is not yet established. Maintainer demos, generated test cases, stars and page views do not establish independent integrations. The library is for recreation and learning, with no validated IQ or clinical-benefit claims. Answer keys are inspectable; it is unsuitable for secure exams or anti-cheat enforcement. Accessibility depends on the consuming interface, and the visual color task needs an alternative for some users.
