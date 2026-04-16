# Fabric Visualizer

Before/after topology visualizer for Fortinet Security Fabric discovery conversations. Open-source, self-hostable, optional AI-powered parsing of discovery notes.

Built for the moment in a customer meeting when you want to show — not tell — what consolidating onto Fortinet looks like. Pick a deployment profile, fill in their current vendors (or paste discovery notes and let AI do it), and get an interactive before/after diagram with hover-to-explain product mapping plus an auto-generated phased migration plan.

## Features

- **Three deployment profiles** — SMB (single site), Branch network (5–50 sites), Enterprise campus (HQ + branches + DC)
- **Eight technology layers** — perimeter firewall, switching, wireless, EDR, email security, SIEM, remote access/ZTNA, central management
- **AI-powered discovery parsing** (optional) — paste an email thread or discovery notes, Claude extracts vendors at each layer and auto-fills the form
- **Interactive before/after diagram** — hover any box to see the Fortinet replacement product and one-line rationale
- **Auto-generated migration plan** — groups layers into Q1–Q4 phases by a sensible sequencing heuristic (edge + VPN first, endpoint + email quick wins, switching + wireless next, SIEM + mgmt last)
- **Export** — pick what to include (diagram, product mapping table, migration plan), output as browser PDF or CSV
- **No backend required** (unless you enable AI parse) — everything is client-side

## Quick start

```bash
git clone https://github.com/tannerharris0n/fabric-visualizer.git
cd fabric-visualizer
npm install
npm run dev
```

Open `http://localhost:5173`. The tool works fully without any AI configuration — the form picker handles all eight layers.

## Enabling the AI parse feature (optional)

The AI parse section is hidden by default and the form picker works fine without it. To enable AI-powered topology parsing from free-text discovery notes:

```bash
cp .env.example .env.local
# Edit .env.local and set VITE_ANTHROPIC_API_KEY
npm run dev
```

Get an API key at [console.anthropic.com](https://console.anthropic.com/). The AI parse uses `claude-sonnet-4-20250514` and costs roughly $0.01–$0.03 per parse.

### Production API key handling

**This matters.** The `VITE_ANTHROPIC_API_KEY` pattern bundles the key into the client-side JS. That's acceptable for:

- Internal team deployments behind SSO
- Localhost development
- Any deployment where the key has a hard monthly spending cap

It is **not** acceptable for public-facing deployments where strangers can inspect your bundle, extract the key, and rack up charges on your account.

For public deployments, add a tiny proxy:

```js
// Minimal Express proxy
app.post('/api/parse', async (req, res) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,  // server-side, never exposed
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(req.body),
  });
  res.json(await response.json());
});
```

Then point the `fetch()` call in `src/lib/aiParse.js` at your `/api/parse` endpoint instead of directly at Anthropic. PRs welcome for a reference proxy implementation in this repo.

## Deploy

Static hosts work (Vercel, Netlify, GitHub Pages, Railway, Cloudflare Pages) as long as AI parse is either disabled or proxied server-side.

**Railway:**
```bash
npm run build
# Railway config: build = npm run build, start = serve -s dist
```

**Vercel / Netlify:** drop the repo, build command `npm run build`, output directory `dist`. Set `VITE_ANTHROPIC_API_KEY` as an env var at build time (exposed client-side — see security note above).

## Customization

**`src/theme.js`** — colors, fonts, spacing. Swap `theme.accent` to your brand color.

**`src/lib/topology.js`** — the source of truth:
- `LAYERS` — the eight technology layers, their Fortinet products, hover rationale, and competitive vendor lists. Add a vendor by pushing to the `vendors` array on any layer.
- `PRESETS` — which layers appear for SMB / Branch / Enterprise. Want FortiMail for SMB? Add `'email'` to the smb layers array.
- `buildMigrationPlan()` — the heuristic that groups layers into quarters. Currently Q1 edge + VPN, Q2 endpoint + email, Q3 switching + wireless, Q4 SIEM + mgmt. Tune if you prefer different phasing.

## Contributing

PRs welcome. Good first contributions:

- Additional vendors in `LAYERS` (if your customers run Juniper, Ubiquiti, SentinelOne, anything not yet listed)
- More technology layers — OT/ICS segmentation, DLP, WAF, identity (Entra/Okta), backup, DNS security
- Sharper hover rationale per vendor ("Meraki MX struggles with SSL inspection at scale" etc.)
- Reference proxy backend so public deployments can use AI parse safely
- Save/load scenarios (localStorage) so an SE can resume a customer's mapping mid-week

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. See [LICENSE](LICENSE).

## Disclaimer

This is an independent open-source project. Not affiliated with or endorsed by Fortinet, Inc. "FortiGate", "FortiSwitch", "FortiAP", "FortiEDR", "FortiMail", "FortiAnalyzer", "FortiClient", "FortiSASE", "FortiManager", and related marks are trademarks of Fortinet, Inc.

## Author

Built by [Tanner Harrison](https://tannerharrison.com) — Enterprise SE, Pacific Northwest. Follow the build log and related tools at [tools.tannerharrison.com](https://tools.tannerharrison.com).

Companion tool: [SD-WAN ROI Calculator](https://github.com/tannerharris0n/sdwan-roi-calculator) — 3-year MPLS vs. Fortinet SD-WAN cost model.
