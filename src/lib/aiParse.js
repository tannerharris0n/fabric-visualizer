// ╔══════════════════════════════════════════════════════════════╗
// ║  AI PARSE — extract structured topology from free text      ║
// ║                                                              ║
// ║  Uses Anthropic's Claude API. Two paths supported:          ║
// ║                                                              ║
// ║  1. API key via Vite env var (self-hosted deployment)       ║
// ║     Set VITE_ANTHROPIC_API_KEY in .env.local                ║
// ║                                                              ║
// ║  2. No key = feature disabled gracefully                    ║
// ║     UI hides AI parse section, form picker still works      ║
// ║                                                              ║
// ║  SECURITY NOTE:                                              ║
// ║  Exposing an API key in a client-side bundle means anyone   ║
// ║  can extract it. For public deployments, proxy the request  ║
// ║  through a tiny backend that holds the key server-side.     ║
// ║  For internal tools (team use only), the client-side key    ║
// ║  pattern is acceptable with spending caps on the key.       ║
// ╚══════════════════════════════════════════════════════════════╝

import { LAYERS, PRESETS } from './topology';

export const AI_PARSE_ENABLED = !!import.meta.env.VITE_ANTHROPIC_API_KEY;

function buildSchemaHint(presetKey) {
  const preset = PRESETS[presetKey];
  return preset.layers.map(id => {
    const layer = LAYERS.find(l => l.id === id);
    return `"${id}": one of [${layer.vendors.map(v => `"${v}"`).join(', ')}] or "" if not mentioned`;
  }).join(',\n  ');
}

export async function parseTopologyDescription({ description, presetKey }) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('AI parse not configured. Set VITE_ANTHROPIC_API_KEY in .env.local.');
  }

  const prompt = `You are a network architecture analyst. A Fortinet sales engineer has pasted a description of a customer's current environment. Extract the vendor at each technology layer.

DESCRIPTION:
${description}

Respond ONLY with a valid JSON object (no markdown, no backticks, no preamble). Use this exact schema:

{
  ${buildSchemaHint(presetKey)}
}

RULES:
- Match the vendor names EXACTLY as listed in the allowed options.
- If the customer doesn't mention a layer, set that field to "".
- If they use a generic term (e.g. "firewall") with no vendor, set "Other".
- If they explicitly say they don't have something (e.g. "no EDR"), set "None".
- "Meraki" with no product = assume MX for edge, MS for switching, MR for wireless.
- "Cisco" with no product = choose the most likely SKU for that layer (ASA for edge, Catalyst for switching, AnyConnect for VPN).`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API error ${response.status}: ${errText.slice(0, 200)}`);
  }

  const data = await response.json();
  const text = data.content?.filter(b => b.type === 'text').map(b => b.text).join('') || '';
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}
