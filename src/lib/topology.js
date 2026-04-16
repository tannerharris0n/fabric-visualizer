// ╔══════════════════════════════════════════════════════════════╗
// ║  TOPOLOGY DATA — presets, layers, vendor mapping            ║
// ║  Source of truth for before/after rendering                 ║
// ╚══════════════════════════════════════════════════════════════╝

// ── layer definitions ──
// Every topology has these layers. Each layer has:
//  - id        : unique key
//  - label     : display name in form and diagram
//  - fortinet  : the Fortinet product that fills this layer
//  - why       : one-line pitch (shown on hover of the Fortinet box)
//  - vendors   : competitive vendors user can pick in the form

export const LAYERS = [
  {
    id: 'edge',
    label: 'Perimeter firewall / edge',
    fortinet: 'FortiGate',
    why: 'NGFW + SD-WAN + SSL inspection in a single appliance.',
    vendors: ['Cisco ASA', 'Cisco Firepower', 'Palo Alto', 'Check Point',
              'SonicWall', 'WatchGuard', 'Meraki MX', 'pfSense', 'Other'],
  },
  {
    id: 'switching',
    label: 'Core / access switching',
    fortinet: 'FortiSwitch',
    why: 'Managed from FortiGate via Fabric — one pane of glass.',
    vendors: ['Cisco Catalyst', 'Cisco Meraki MS', 'Aruba CX',
              'Juniper EX', 'Ubiquiti', 'Extreme', 'Other'],
  },
  {
    id: 'wireless',
    label: 'Wireless',
    fortinet: 'FortiAP',
    why: 'Controllerless, managed by FortiGate, same policy as wired.',
    vendors: ['Cisco Meraki MR', 'Aruba Instant', 'Ruckus',
              'Ubiquiti UniFi', 'Extreme', 'Other'],
  },
  {
    id: 'endpoint',
    label: 'Endpoint protection (EDR)',
    fortinet: 'FortiEDR',
    why: 'Kernel-level prevention + automated response, Fabric-integrated.',
    vendors: ['CrowdStrike', 'SentinelOne', 'Microsoft Defender',
              'Carbon Black', 'Sophos', 'Symantec', 'None'],
  },
  {
    id: 'email',
    label: 'Email security',
    fortinet: 'FortiMail',
    why: 'Inline or API, strong anti-phishing, no per-user tax.',
    vendors: ['Proofpoint', 'Mimecast', 'Microsoft Defender for O365',
              'Barracuda', 'Abnormal', 'None'],
  },
  {
    id: 'siem',
    label: 'Log management / SIEM',
    fortinet: 'FortiAnalyzer',
    why: 'Native log ingest from all Fortinet products — no connector tax.',
    vendors: ['Splunk', 'Microsoft Sentinel', 'Elastic', 'QRadar',
              'LogRhythm', 'Sumo Logic', 'None'],
  },
  {
    id: 'vpn',
    label: 'Remote access / ZTNA',
    fortinet: 'FortiClient + FortiSASE',
    why: 'ZTNA replaces legacy VPN — per-app access, not network access.',
    vendors: ['Cisco AnyConnect', 'Palo Alto GlobalProtect',
              'Zscaler', 'Netskope', 'Cato', 'Cloudflare', 'Other'],
  },
  {
    id: 'mgmt',
    label: 'Central management',
    fortinet: 'FortiManager',
    why: 'Multi-site config, policy, and provisioning at scale.',
    vendors: ['Cisco DNA Center', 'Panorama', 'Aruba Central',
              'Manual / device-by-device', 'Other'],
  },
];

// Layers included in each preset (others are hidden in form + diagram)
export const PRESETS = {
  smb: {
    label: 'SMB — single site, 10–50 users',
    layers: ['edge', 'switching', 'wireless', 'endpoint', 'email', 'vpn'],
    siteCount: 1,
  },
  branch: {
    label: 'Branch network — 5–50 sites, light HQ',
    layers: ['edge', 'switching', 'wireless', 'endpoint', 'email',
             'siem', 'vpn', 'mgmt'],
    siteCount: 10,
  },
  enterprise: {
    label: 'Enterprise campus — HQ + branches + DC',
    layers: ['edge', 'switching', 'wireless', 'endpoint', 'email',
             'siem', 'vpn', 'mgmt'],
    siteCount: 25,
  },
};

// ── helper: empty form state for a preset ──
export function emptyStateFor(presetKey) {
  const preset = PRESETS[presetKey];
  const state = {};
  preset.layers.forEach(id => { state[id] = ''; });
  return state;
}

// ── helper: count vendors in a state (for "consolidation" stat card) ──
export function countVendors(state) {
  const vendors = new Set();
  Object.values(state).forEach(v => {
    if (v && v !== 'None' && v !== 'Other' && v !== 'Manual / device-by-device') {
      vendors.add(v);
    }
  });
  return vendors.size;
}

// ── helper: phased migration plan generator ──
// Returns an array of { phase, quarter, layers[], theme }
export function buildMigrationPlan(state, presetKey) {
  const preset = PRESETS[presetKey];
  const active = preset.layers.filter(id => state[id] && state[id] !== 'None');

  // heuristic phasing: edge first (highest impact, usually refresh cycle),
  // then endpoint + email (easy quick wins), then switching/wireless
  // (tied to edge Fabric), then SIEM/mgmt/ZTNA (platform maturity)
  const p1 = active.filter(id => ['edge', 'vpn'].includes(id));
  const p2 = active.filter(id => ['endpoint', 'email'].includes(id));
  const p3 = active.filter(id => ['switching', 'wireless'].includes(id));
  const p4 = active.filter(id => ['siem', 'mgmt'].includes(id));

  const phases = [];
  if (p1.length) phases.push({
    phase: 1, quarter: 'Q1', layers: p1,
    theme: 'Edge refresh + secure remote access',
  });
  if (p2.length) phases.push({
    phase: 2, quarter: 'Q2', layers: p2,
    theme: 'Endpoint + email quick wins',
  });
  if (p3.length) phases.push({
    phase: 3, quarter: 'Q3', layers: p3,
    theme: 'Fabric switching + wireless consolidation',
  });
  if (p4.length) phases.push({
    phase: 4, quarter: 'Q4', layers: p4,
    theme: 'Platform maturity: logging + central mgmt',
  });

  return phases;
}
