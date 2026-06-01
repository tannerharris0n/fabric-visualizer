// ╔══════════════════════════════════════════════════════════════╗
// ║  THEME — Customize this file to rebrand the tool            ║
// ║  Defaults to Fortinet blue + DM Sans (editorial light)      ║
// ║                                                              ║
// ║  Tips:                                                       ║
// ║  - Change `accent` to your brand color                       ║
// ║  - Swap fonts to your corporate typeface                     ║
// ║  - Flip light/dark by adjusting bg / text values             ║
// ╚══════════════════════════════════════════════════════════════╝

export const theme = {
  bg: '#FAFAF8',
  surface: '#FFFFFF',
  surfaceAlt: '#F4F3F0',
  hover: '#F0EFEC',

  border: '#E4E2DD',
  borderHover: '#D0CDC6',
  borderActive: '#1A1A1A',

  text: '#1A1A1A',
  textBody: '#3D3D3D',
  textDim: '#6B6B6B',
  textFaint: '#9B9B9B',
  textInverse: '#FFFFFF',

  accent: '#2563EB',
  accentDim: 'rgba(37,99,235,0.06)',
  accentBorder: 'rgba(37,99,235,0.2)',

  green: '#16A34A',
  greenDim: 'rgba(22,163,74,0.06)',
  greenBorder: 'rgba(22,163,74,0.2)',

  amber: '#B45309',
  red: '#DC2626',
};

export const fonts = {
  body: "'DM Sans', 'Helvetica Neue', sans-serif",
  mono: "'DM Mono', 'Menlo', monospace",
};

export const fontImport =
  `@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');`;

export const baseStyles = `
  ${fontImport}
  @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeSlide { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
  * { box-sizing: border-box; margin: 0; }
  body { background: ${theme.bg}; color: ${theme.text}; font-family: ${fonts.body}; -webkit-font-smoothing: antialiased; margin: 0; }
  input:focus, textarea:focus, select:focus { border-color: ${theme.accent} !important; box-shadow: 0 0 0 3px ${theme.accentDim}; outline: none; }
  ::selection { background: ${theme.accentDim}; color: ${theme.text}; }

  /* Elements that only belong on paper */
  .print-only { display: none; }

  /* ── Print / "Export PDF" layout ───────────────────────────────
     window.print() renders the live DOM, so without these rules the
     PDF would include the toolbar buttons, the dimmed export-modal
     overlay, and screen-only flourishes — and browsers strip the
     accent/green fills by default. Fix all of that here. */
  @media print {
    @page { size: auto; margin: 14mm; }

    html, body {
      background: #fff !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    /* Honor brand colors (accent boxes, green stats, before/after labels) */
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* Drop interactive chrome and the modal overlay from the page */
    .no-print { display: none !important; }
    .print-only { display: block; }

    /* Reclaim the page: the app is centered + padded for screen */
    .page { padding: 0 !important; max-width: none !important; }

    /* Keep logical blocks from splitting across page breaks */
    .avoid-break { break-inside: avoid; page-break-inside: avoid; }

    /* Soften card shadows that render as muddy gray boxes in print */
    .card, .diagram-wrap, .stat { box-shadow: none !important; }
  }
`;
