import { useState, useMemo } from 'react';
import { theme as T, fonts, baseStyles } from './theme';
import { LAYERS, PRESETS, emptyStateFor, countVendors, buildMigrationPlan } from './lib/topology';
import { parseTopologyDescription, AI_PARSE_ENABLED } from './lib/aiParse';

/* ════════════════════════════════════════════════════════════
   Security Fabric Visualizer
   Before/after topology renderer for Fortinet SE discovery

   MIT License — https://github.com/tannerharris0n/fabric-visualizer
   ════════════════════════════════════════════════════════════ */

export default function App() {
  const [step, setStep]             = useState('preset'); // preset → build → diagram
  const [presetKey, setPresetKey]   = useState('branch');
  const [state, setState]           = useState(emptyStateFor('branch'));
  const [customerName, setCustomerName] = useState('');
  const [description, setDescription]   = useState('');
  const [parsing, setParsing]       = useState(false);
  const [parseError, setParseError] = useState('');
  const [hoverId, setHoverId]       = useState(null);
  const [showExport, setShowExport] = useState(false);

  const preset = PRESETS[presetKey];
  const activeLayers = useMemo(
    () => LAYERS.filter(l => preset.layers.includes(l.id)),
    [presetKey]
  );

  const onPresetPick = (k) => {
    setPresetKey(k);
    setState(emptyStateFor(k));
    setStep('build');
  };

  const onAiParse = async () => {
    if (!description.trim()) return;
    setParsing(true); setParseError('');
    try {
      const parsed = await parseTopologyDescription({ description, presetKey });
      setState(prev => ({ ...prev, ...parsed }));
    } catch (e) {
      console.error(e);
      setParseError("Couldn't parse that description. Try the form instead, or rephrase.");
    } finally {
      setParsing(false);
    }
  };

  const hasAnyInput = Object.values(state).some(v => v && v !== '');

  // ══════ STYLES ══════
  const S = {
    page: { padding: '48px 24px 80px', maxWidth: 1200, margin: '0 auto',
            fontFamily: fonts.body, color: T.text },
    header: { marginBottom: 32, paddingBottom: 24, borderBottom: `1px solid ${T.border}` },
    eyebrow: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: '0.1em',
               textTransform: 'uppercase', color: T.accent, marginBottom: 8, fontWeight: 500 },
    h1: { fontSize: 28, fontWeight: 600, margin: 0, letterSpacing: '-0.3px' },
    sub: { fontSize: 14, color: T.textDim, marginTop: 8, lineHeight: 1.5, maxWidth: 720 },

    card: { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14,
            padding: 24, boxShadow: '0 1px 2px rgba(0,0,0,0.03)' },
    sectionTitle: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: T.textDim,
                    marginBottom: 16, fontWeight: 500 },

    presetGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 14, marginTop: 8 },
    presetCard: (active) => ({
      background: active ? T.accentDim : T.surface,
      border: `1px solid ${active ? T.accent : T.border}`,
      borderRadius: 14, padding: '28px 24px', cursor: 'pointer',
      transition: 'all 0.15s',
      boxShadow: active ? `0 2px 12px ${T.accent}14` : '0 1px 2px rgba(0,0,0,0.03)',
    }),
    presetIcon: { fontSize: 32, marginBottom: 12 },
    presetLabel: { fontSize: 16, fontWeight: 600, color: T.text, marginBottom: 6 },
    presetDesc: { fontSize: 13, color: T.textDim, lineHeight: 1.55 },

    twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 },
    formRow: { marginBottom: 14 },
    label: { fontSize: 13, color: T.textBody, marginBottom: 6, display: 'block', fontWeight: 500 },
    input: { width: '100%', padding: '10px 12px', background: T.bg,
             border: `1px solid ${T.border}`, borderRadius: 8, color: T.text,
             fontSize: 14, fontFamily: fonts.body },
    select: { width: '100%', padding: '10px 12px', background: T.bg,
              border: `1px solid ${T.border}`, borderRadius: 8, color: T.text,
              fontSize: 14, fontFamily: fonts.body, cursor: 'pointer' },
    textarea: { width: '100%', padding: '12px 14px', background: T.bg,
                border: `1px solid ${T.border}`, borderRadius: 10, color: T.text,
                fontSize: 14, fontFamily: fonts.body, lineHeight: 1.55,
                resize: 'vertical', minHeight: 120 },

    button: { background: T.surface, border: `1px solid ${T.border}`, color: T.textBody,
              padding: '10px 18px', borderRadius: 10, fontSize: 14, fontWeight: 500,
              cursor: 'pointer', fontFamily: fonts.body, transition: 'all 0.15s' },
    buttonPrimary: { background: T.accent, border: `1px solid ${T.accent}`,
                     color: T.textInverse, fontWeight: 600 },
    buttonRow: { display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' },

    errorText: { color: T.red, fontSize: 13, marginTop: 10 },
    hintText: { fontSize: 12, color: T.textFaint, marginTop: 6, lineHeight: 1.5 },

    // diagram
    diagramWrap: { background: T.surface, border: `1px solid ${T.border}`,
                   borderRadius: 14, padding: 24, marginBottom: 20 },
    diagramHeader: { display: 'flex', justifyContent: 'space-between',
                     alignItems: 'baseline', marginBottom: 8 },
    sideLabel: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: '0.1em',
                 textTransform: 'uppercase', fontWeight: 500 },
    sideCount: { fontFamily: fonts.mono, fontSize: 11, color: T.textFaint },

    statGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 12, marginBottom: 20 },
    stat: { background: T.surface, border: `1px solid ${T.border}`,
            borderRadius: 12, padding: '18px 20px' },
    statLabel: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: '0.08em',
                 textTransform: 'uppercase', color: T.textFaint,
                 marginBottom: 8, fontWeight: 500 },
    statValue: { fontSize: 24, fontWeight: 600, color: T.text, lineHeight: 1.1 },
    statValueGreen: { color: T.green },
    statDim: { fontSize: 12, color: T.textFaint, marginTop: 4 },

    hoverCard: {
      position: 'sticky', top: 20, marginBottom: 20,
      background: T.accentDim, border: `1px solid ${T.accentBorder}`,
      borderRadius: 12, padding: '16px 20px',
      animation: 'fadeSlide 0.2s ease',
    },
    hoverEyebrow: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: T.accent,
                    fontWeight: 500, marginBottom: 6 },
    hoverTitle: { fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 4 },
    hoverWhy: { fontSize: 13, color: T.textBody, lineHeight: 1.55 },

    // migration plan
    planRow: { display: 'grid', gridTemplateColumns: 'auto 80px 1fr',
               gap: 16, padding: '14px 0', borderBottom: `1px solid ${T.border}`,
               alignItems: 'baseline' },
    planPhase: { fontFamily: fonts.mono, fontSize: 11, color: T.accent,
                 fontWeight: 500, letterSpacing: '0.05em' },
    planQuarter: { fontFamily: fonts.mono, fontSize: 12, color: T.textDim },
    planTheme: { fontSize: 14, fontWeight: 500, color: T.text, marginBottom: 4 },
    planLayers: { fontSize: 12, color: T.textDim, lineHeight: 1.5 },

    // export modal
    modalBackdrop: {
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, animation: 'fadeIn 0.15s ease',
    },
    modal: { background: T.surface, border: `1px solid ${T.border}`,
             borderRadius: 16, padding: 32, width: 480, maxWidth: '92vw',
             boxShadow: '0 12px 48px rgba(0,0,0,0.2)' },
    modalH: { fontSize: 20, fontWeight: 600, marginBottom: 6 },
    modalSub: { fontSize: 14, color: T.textDim, marginBottom: 20, lineHeight: 1.5 },
    check: { display: 'flex', alignItems: 'flex-start', gap: 12,
             padding: '12px 14px', background: T.surfaceAlt, borderRadius: 10,
             cursor: 'pointer', marginBottom: 8 },
    checkTitle: { fontSize: 14, fontWeight: 500, color: T.text, marginBottom: 2 },
    checkDesc: { fontSize: 12, color: T.textDim, lineHeight: 1.45 },
  };

  // ══════ STEP: PRESET PICKER ══════
  if (step === 'preset') {
    return (
      <div style={S.page}>
        <style>{baseStyles}</style>
        <div style={S.header}>
          <div style={S.eyebrow}>Security Fabric Visualizer · Fortinet</div>
          <h1 style={S.h1}>Pick a deployment profile</h1>
          <p style={S.sub}>
            Choose the size that best matches your customer.
            {AI_PARSE_ENABLED
              ? ' You can tune the details on the next screen, or paste discovery notes into the AI-parse field to auto-fill the form.'
              : ' Fill in the current-state vendors on the next screen.'}
          </p>
        </div>

        <div style={S.presetGrid}>
          {Object.entries(PRESETS).map(([key, p]) => (
            <div key={key} style={S.presetCard(presetKey === key)}
                 onClick={() => onPresetPick(key)}>
              <div style={S.presetIcon}>
                {key === 'smb' ? '🏢' : key === 'branch' ? '🌐' : '🏛️'}
              </div>
              <div style={S.presetLabel}>
                {key === 'smb' ? 'SMB' : key === 'branch' ? 'Branch network' : 'Enterprise campus'}
              </div>
              <div style={S.presetDesc}>{p.label.split('—')[1].trim()}</div>
              <div style={{ ...S.hintText, marginTop: 10 }}>
                {p.layers.length} layers · {p.siteCount} site{p.siteCount > 1 ? 's' : ''} default
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ══════ STEP: BUILD (form + AI parse) ══════
  if (step === 'build') {
    return (
      <div style={S.page}>
        <style>{baseStyles}</style>
        <div style={S.header}>
          <div style={S.eyebrow}>
            Fabric Visualizer · {preset.label}
          </div>
          <h1 style={S.h1}>Build the current state</h1>
          <p style={S.sub}>
            {AI_PARSE_ENABLED
              ? 'Fill the form manually, or paste discovery notes and let AI parse the vendors. Layers you skip won\'t appear in the diagram.'
              : 'Fill the form to describe the customer\'s current environment. Layers you skip won\'t appear in the diagram.'}
          </p>
        </div>

        {/* customer + preset selector bar */}
        <div style={{ ...S.card, marginBottom: 16 }}>
          <div style={S.twoCol}>
            <div>
              <label style={S.label}>Customer name (optional)</label>
              <input style={S.input} value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="ACME Industries" />
            </div>
            <div>
              <label style={S.label}>Deployment profile</label>
              <select style={S.select} value={presetKey}
                onChange={e => {
                  const k = e.target.value;
                  setPresetKey(k);
                  setState(emptyStateFor(k));
                }}>
                {Object.entries(PRESETS).map(([k, p]) =>
                  <option key={k} value={k}>{p.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* AI parse — only shown when VITE_ANTHROPIC_API_KEY is configured */}
        {AI_PARSE_ENABLED && (
        <div style={{ ...S.card, marginBottom: 16 }}>
          <div style={S.sectionTitle}>AI parse from description</div>
          <label style={S.label}>
            Paste discovery notes, an email thread, or just describe what they have
          </label>
          <textarea style={S.textarea} value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="They run Cisco Meraki MX firewalls at all 12 branches, Catalyst switching, Aruba wireless, CrowdStrike on endpoints, Proofpoint for email, and Splunk for their SIEM. No EDR on OT. Using Cisco AnyConnect for remote access."
          />
          <div style={S.hintText}>
            Claude will extract vendors at each layer and auto-fill the form below.
            You can edit anything after.
          </div>

          <div style={{ ...S.buttonRow, marginTop: 14 }}>
            <button style={{ ...S.button, ...S.buttonPrimary }}
                    disabled={!description.trim() || parsing}
                    onClick={onAiParse}>
              {parsing ? 'Parsing…' : 'Parse with AI'}
            </button>
            {parseError && <span style={S.errorText}>{parseError}</span>}
          </div>
        </div>
        )}

        {/* form */}
        <div style={{ ...S.card, marginBottom: 16 }}>
          <div style={S.sectionTitle}>Current-state vendors</div>
          <div style={S.twoCol}>
            {activeLayers.map(layer => (
              <div key={layer.id} style={S.formRow}>
                <label style={S.label}>{layer.label}</label>
                <select style={S.select} value={state[layer.id] || ''}
                  onChange={e => setState(prev => ({ ...prev, [layer.id]: e.target.value }))}>
                  <option value="">— select vendor —</option>
                  {layer.vendors.map(v =>
                    <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>

        <div style={S.buttonRow}>
          <button style={S.button} onClick={() => setStep('preset')}>
            ← Back to presets
          </button>
          <button style={{ ...S.button, ...S.buttonPrimary }}
                  disabled={!hasAnyInput}
                  onClick={() => setStep('diagram')}>
            Render the Fabric →
          </button>
        </div>
      </div>
    );
  }

  // ══════ STEP: DIAGRAM (interactive + stats + plan) ══════
  const vendorCount = countVendors(state);
  const filledLayers = activeLayers.filter(l => state[l.id] && state[l.id] !== '');
  const plan = buildMigrationPlan(state, presetKey);
  const hoverLayer = hoverId ? LAYERS.find(l => l.id === hoverId) : null;

  return (
    <div style={S.page}>
      <style>{baseStyles}</style>

      <div style={S.header}>
        <div style={S.eyebrow}>
          Fabric Visualizer · {preset.label}
        </div>
        <h1 style={S.h1}>
          {customerName ? `${customerName} — ` : ''}Current state → Security Fabric
        </h1>
        <p style={S.sub}>
          Hover any box in the diagram to see what Fortinet product replaces it and why.
        </p>
      </div>

      {/* stats */}
      <div style={S.statGrid}>
        <div style={S.stat}>
          <div style={S.statLabel}>Vendors today</div>
          <div style={S.statValue}>{vendorCount}</div>
          <div style={S.statDim}>Separate contracts</div>
        </div>
        <div style={S.stat}>
          <div style={S.statLabel}>Fabric vendors</div>
          <div style={{ ...S.statValue, ...S.statValueGreen }}>1</div>
          <div style={S.statDim}>Fortinet</div>
        </div>
        <div style={S.stat}>
          <div style={S.statLabel}>Layers covered</div>
          <div style={S.statValue}>{filledLayers.length}/{activeLayers.length}</div>
          <div style={S.statDim}>Technology areas</div>
        </div>
        <div style={S.stat}>
          <div style={S.statLabel}>Migration phases</div>
          <div style={S.statValue}>{plan.length}</div>
          <div style={S.statDim}>Recommended quarters</div>
        </div>
      </div>

      {/* hover card */}
      {hoverLayer && (
        <div style={S.hoverCard}>
          <div style={S.hoverEyebrow}>Hovering · {hoverLayer.label}</div>
          <div style={S.hoverTitle}>
            {state[hoverLayer.id] || '—'} → {hoverLayer.fortinet}
          </div>
          <div style={S.hoverWhy}>{hoverLayer.why}</div>
        </div>
      )}

      {/* diagram */}
      <div style={S.diagramWrap}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', gap: 20, alignItems: 'start' }}>

          {/* BEFORE */}
          <div>
            <div style={S.diagramHeader}>
              <span style={{ ...S.sideLabel, color: T.red }}>Current state</span>
              <span style={S.sideCount}>{vendorCount} vendors</span>
            </div>
            <FabricDiagram
              side="before" layers={activeLayers} state={state}
              hoverId={hoverId} setHoverId={setHoverId}
            />
          </div>

          {/* arrow */}
          <div style={{ paddingTop: 60, textAlign: 'center',
                        color: T.textFaint, fontSize: 24 }}>
            →
          </div>

          {/* AFTER */}
          <div>
            <div style={S.diagramHeader}>
              <span style={{ ...S.sideLabel, color: T.accent }}>Security Fabric</span>
              <span style={S.sideCount}>1 vendor</span>
            </div>
            <FabricDiagram
              side="after" layers={activeLayers} state={state}
              hoverId={hoverId} setHoverId={setHoverId}
            />
          </div>
        </div>
      </div>

      {/* migration plan */}
      {plan.length > 0 && (
        <div style={{ ...S.card, marginBottom: 20 }}>
          <div style={S.sectionTitle}>Phased migration plan</div>
          {plan.map(p => (
            <div key={p.phase} style={S.planRow}>
              <span style={S.planPhase}>PHASE {p.phase}</span>
              <span style={S.planQuarter}>{p.quarter}</span>
              <div>
                <div style={S.planTheme}>{p.theme}</div>
                <div style={S.planLayers}>
                  {p.layers.map(id => {
                    const layer = LAYERS.find(l => l.id === id);
                    return `${state[id]} → ${layer.fortinet}`;
                  }).join(' · ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* actions */}
      <div style={S.buttonRow}>
        <button style={S.button} onClick={() => setStep('build')}>
          ← Edit topology
        </button>
        <button style={{ ...S.button, ...S.buttonPrimary }}
                onClick={() => setShowExport(true)}>
          Export
        </button>
      </div>

      {/* export modal */}
      {showExport && (
        <ExportModal
          onClose={() => setShowExport(false)}
          customerName={customerName}
          state={state}
          presetKey={presetKey}
          activeLayers={activeLayers}
          plan={plan}
          vendorCount={vendorCount}
        />
      )}
    </div>
  );
}

// ╔══════════════════════════════════════════════════════════════╗
// ║  Fabric diagram — left/right side renderer                  ║
// ╚══════════════════════════════════════════════════════════════╝
function FabricDiagram({ side, layers, state, hoverId, setHoverId }) {
  // Only render layers the user actually filled in (so empty layers don't clutter)
  const filled = layers.filter(l => state[l.id] && state[l.id] !== '');
  const isAfter = side === 'after';

  const boxW = 260;
  const boxH = 48;
  const gap = 12;
  const totalH = filled.length * (boxH + gap) - gap + 60; // 60 for internet icon

  return (
    <svg viewBox={`0 0 ${boxW + 40} ${totalH}`}
         style={{ width: '100%', height: 'auto', fontFamily: fonts.body }}>

      {/* internet cloud at top */}
      <g transform="translate(20, 10)">
        <rect x={boxW / 2 - 60} y="0" width="120" height="28" rx="14"
              fill={T.surfaceAlt} stroke={T.border} strokeWidth="1" />
        <text x={boxW / 2} y="18" textAnchor="middle"
              fontSize="11" fill={T.textBody} fontFamily={fonts.body}>
          Internet
        </text>
      </g>

      {/* connection line internet to first box */}
      {filled.length > 0 && (
        <line x1={boxW / 2 + 20} y1="38" x2={boxW / 2 + 20} y2="60"
              stroke={isAfter ? T.accent : T.textFaint} strokeWidth="1.5" />
      )}

      {/* vendor boxes */}
      {filled.map((layer, i) => {
        const y = 60 + i * (boxH + gap);
        const isHovered = hoverId === layer.id;
        const fillColor = isAfter
          ? (isHovered ? T.accent : T.accentDim)
          : (isHovered ? T.surfaceAlt : T.surface);
        const borderColor = isAfter ? T.accent : T.border;
        const textColor = isAfter && isHovered ? T.textInverse : T.text;
        const dimTextColor = isAfter && isHovered ? T.textInverse : T.textDim;
        const displayVendor = isAfter ? layer.fortinet : state[layer.id];

        return (
          <g key={layer.id} style={{ cursor: 'pointer' }}
             onMouseEnter={() => setHoverId(layer.id)}
             onMouseLeave={() => setHoverId(null)}>
            <rect x="20" y={y} width={boxW} height={boxH} rx="10"
                  fill={fillColor} stroke={borderColor}
                  strokeWidth={isHovered ? 2 : 1} />
            <text x="36" y={y + 20} fontSize="11" fill={dimTextColor}
                  fontFamily={fonts.mono} style={{ opacity: 0.8 }}>
              {layer.label}
            </text>
            <text x="36" y={y + 38} fontSize="14" fontWeight="600"
                  fill={textColor}>
              {displayVendor}
            </text>
            {/* connection to next */}
            {i < filled.length - 1 && (
              <line x1={boxW / 2 + 20} y1={y + boxH}
                    x2={boxW / 2 + 20} y2={y + boxH + gap}
                    stroke={isAfter ? T.accent : T.textFaint}
                    strokeWidth="1.5" />
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ╔══════════════════════════════════════════════════════════════╗
// ║  Export Modal — checkbox picker + export trigger            ║
// ╚══════════════════════════════════════════════════════════════╝
function ExportModal({ onClose, customerName, state, presetKey,
                       activeLayers, plan, vendorCount }) {
  const [opts, setOpts] = useState({
    diagram: true,
    table: true,
    plan: true,
  });

  const S = {
    backdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 100 },
    modal: { background: T.surface, border: `1px solid ${T.border}`,
             borderRadius: 16, padding: 32, width: 520, maxWidth: '92vw',
             boxShadow: '0 12px 48px rgba(0,0,0,0.2)' },
    h: { fontSize: 20, fontWeight: 600, marginBottom: 6 },
    sub: { fontSize: 14, color: T.textDim, marginBottom: 20, lineHeight: 1.5 },
    check: { display: 'flex', alignItems: 'flex-start', gap: 12,
             padding: '14px 16px', background: T.surfaceAlt, borderRadius: 10,
             cursor: 'pointer', marginBottom: 8 },
    cbTitle: { fontSize: 14, fontWeight: 500, color: T.text, marginBottom: 2 },
    cbDesc: { fontSize: 12, color: T.textDim, lineHeight: 1.45 },
    buttonRow: { display: 'flex', gap: 10, justifyContent: 'flex-end',
                 marginTop: 24, flexWrap: 'wrap' },
    btn: { background: T.surface, border: `1px solid ${T.border}`,
           color: T.textBody, padding: '10px 18px', borderRadius: 10,
           fontSize: 14, fontWeight: 500, cursor: 'pointer',
           fontFamily: fonts.body },
    btnPrimary: { background: T.accent, border: `1px solid ${T.accent}`,
                  color: T.textInverse, fontWeight: 600 },
  };

  const doExport = (format) => {
    const preset = PRESETS[presetKey];
    const filled = activeLayers.filter(l => state[l.id] && state[l.id] !== '');

    if (format === 'pdf') {
      // Print the current document; print CSS handles layout
      window.print();
      return;
    }

    // CSV export
    const rows = [
      ['Security Fabric Mapping', customerName || 'Unnamed customer'],
      ['Generated', new Date().toLocaleString()],
      ['Deployment profile', preset.label],
      [],
    ];

    if (opts.table) {
      rows.push(['CURRENT-STATE → FORTINET MAPPING']);
      rows.push(['Layer', 'Current vendor', 'Fortinet product', 'Rationale']);
      filled.forEach(l => {
        rows.push([l.label, state[l.id], l.fortinet, l.why]);
      });
      rows.push([]);
    }

    if (opts.plan && plan.length) {
      rows.push(['PHASED MIGRATION PLAN']);
      rows.push(['Phase', 'Quarter', 'Theme', 'Layers']);
      plan.forEach(p => {
        const layerStr = p.layers.map(id => {
          const layer = LAYERS.find(l => l.id === id);
          return `${state[id]} → ${layer.fortinet}`;
        }).join('; ');
        rows.push([p.phase, p.quarter, p.theme, layerStr]);
      });
    }

    const csv = rows.map(r => r.map(c => {
      const s = String(c ?? '');
      return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    }).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `fabric-mapping-${(customerName || 'customer')
      .replace(/\s+/g, '-').toLowerCase()}.csv`;
    a.click();
    onClose();
  };

  return (
    <div style={S.backdrop} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <h2 style={S.h}>Export options</h2>
        <p style={S.sub}>
          Choose what to include. PDF uses browser print (Ctrl+P to tweak
          scale or page size). CSV includes everything checked for use in
          proposals or spreadsheets.
        </p>

        <label style={S.check}>
          <input type="checkbox" checked={opts.diagram}
            onChange={e => setOpts(o => ({ ...o, diagram: e.target.checked }))} />
          <div>
            <div style={S.cbTitle}>Before/after diagram</div>
            <div style={S.cbDesc}>The visual itself (PDF only — CSV can't render SVG)</div>
          </div>
        </label>

        <label style={S.check}>
          <input type="checkbox" checked={opts.table}
            onChange={e => setOpts(o => ({ ...o, table: e.target.checked }))} />
          <div>
            <div style={S.cbTitle}>Product mapping table</div>
            <div style={S.cbDesc}>Layer · current vendor · Fortinet product · rationale</div>
          </div>
        </label>

        <label style={S.check}>
          <input type="checkbox" checked={opts.plan}
            onChange={e => setOpts(o => ({ ...o, plan: e.target.checked }))} />
          <div>
            <div style={S.cbTitle}>Phased migration plan</div>
            <div style={S.cbDesc}>Quarter-by-quarter rollout recommendation</div>
          </div>
        </label>

        <div style={S.buttonRow}>
          <button style={S.btn} onClick={onClose}>Cancel</button>
          <button style={S.btn} onClick={() => doExport('csv')}>Download CSV</button>
          <button style={{ ...S.btn, ...S.btnPrimary }}
                  onClick={() => doExport('pdf')}>
            Export PDF (browser print)
          </button>
        </div>
      </div>
    </div>
  );
}
