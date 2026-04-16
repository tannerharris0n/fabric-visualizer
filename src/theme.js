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
  * { box-sizing: border-box; margin: 0; }
  body { background: ${theme.bg}; color: ${theme.text}; font-family: ${fonts.body}; -webkit-font-smoothing: antialiased; margin: 0; }
  input:focus, textarea:focus, select:focus { border-color: ${theme.accent} !important; box-shadow: 0 0 0 3px ${theme.accentDim}; outline: none; }
  ::selection { background: ${theme.accentDim}; color: ${theme.text}; }
`;
