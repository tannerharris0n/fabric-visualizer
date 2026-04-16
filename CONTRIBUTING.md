# Contributing

Thanks for considering a contribution. This tool was built for the Fortinet SE community, and the best updates come from SEs who've used it in real customer meetings.

## Good first issues

- **New vendors.** Push entries to `LAYERS[].vendors` in `src/lib/topology.js`. If your customers run something that's not in the dropdowns (Juniper, SentinelOne, Ubiquiti, etc.), add it.
- **Sharper hover rationale.** The `why` field on each layer is a one-liner that appears on hover. If you have better language for why FortiGate beats Palo Alto, or why FortiEDR beats CrowdStrike in a specific scenario, propose a richer structure (e.g., `why: { default, vsMeraki, vsPalo }`) and a PR to match.
- **Preset tuning.** If the default layer list for SMB or Enterprise doesn't match what you see in real customer environments, PR a better mapping.

## Bigger ideas

- **Additional layers.** OT/ICS segmentation, DLP, WAF, identity providers (Entra, Okta), backup, DNS security, CASB. Each needs an entry in `LAYERS` and inclusion in relevant presets.
- **Reference proxy backend.** A small Express server that holds the Anthropic API key server-side so public deployments can safely use the AI parse feature. Would live alongside the frontend in this repo under `/server`.
- **Save / load scenarios.** localStorage-backed customer scenarios so an SE can return to a mapping later. Then a "my scenarios" dropdown.
- **Visio / draw.io import.** Parse uploaded topology files. Hard. Probably needs an AI pass to interpret arbitrary diagrams.
- **Customer logo upload.** For the PDF export. Requires moving from browser print to a Puppeteer render pipeline.
- **i18n.** Translate UI strings. Topology vendor names would stay in English.

## How to contribute

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-improvement`
3. Make your changes, test locally with `npm run dev`
4. Commit with a clear message
5. Open a PR against `main` with a description of what and why

## Code style

- Match existing patterns — small codebase, consistency matters more than personal preference
- No new dependencies without discussion. The tool is intentionally minimal (React + Vite only)
- Keep the client-side-only default working. AI parse is opt-in; adding new features that require a backend should also be opt-in

## Issues

Bug reports and feature requests welcome. Please include:

- What you expected vs. what happened
- Browser and OS for rendering issues
- A suggested fix if you have one (no obligation)

## Questions

Open a discussion on GitHub or reach out on LinkedIn.
