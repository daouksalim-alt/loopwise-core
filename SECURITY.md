# Security

This package performs deterministic calculations in memory. It has no network or storage integration and does not handle credentials. Hosting applications remain responsible for input limits, safe rendering, authentication, data protection, and dependency review.

## Boundaries

- Seeded randomness is predictable and must not generate passwords, tokens, cryptographic material, gambling outcomes, or security-sensitive identifiers.
- Questions contain their answers. Client-side answer checking is not an anti-cheat or payment authorization boundary.
- Render question strings as text rather than treating them as HTML.
- Keep personal information out of seeds and reproduction examples. A deterministic seed is not encryption or anonymization.
- The package is not a clinical instrument or a validated measure of intelligence.

## Reporting

For ordinary bugs without confidential information, use repository issues. For sensitive concerns, contact the project owner through an existing private contact channel. Do not post secrets or private records in public issues. GitHub private vulnerability reporting is not established by this document; use that channel only if the repository explicitly offers it.

No response-time guarantee or supported historical release policy has been established for this initial release.
