const palettes = [
  { hLight: '#6ee7b7', hDark: '#10b981', bLight: '#a7f3d0', bDark: '#059669', stroke: '#047857', shadow: '#022c22' }, // Emerald
  { hLight: '#93c5fd', hDark: '#3b82f6', bLight: '#bfdbfe', bDark: '#2563eb', stroke: '#1d4ed8', shadow: '#1e3a8a' }, // Blue
  { hLight: '#c4b5fd', hDark: '#8b5cf6', bLight: '#ddd6fe', bDark: '#7c3aed', stroke: '#6d28d9', shadow: '#4c1d95' }, // Violet
  { hLight: '#fca5a5', hDark: '#ef4444', bLight: '#fecaca', bDark: '#dc2626', stroke: '#b91c1c', shadow: '#7f1d1d' }, // Red
  { hLight: '#fcd34d', hDark: '#f59e0b', bLight: '#fde68a', bDark: '#d97706', stroke: '#b45309', shadow: '#78350f' }, // Amber
  { hLight: '#f9a8d4', hDark: '#ec4899', bLight: '#fbcfe8', bDark: '#db2777', stroke: '#be185d', shadow: '#831843' }, // Pink
  { hLight: '#5eead4', hDark: '#14b8a6', bLight: '#99f6e4', bDark: '#0d9488', stroke: '#0f766e', shadow: '#134e4a' }, // Teal
  { hLight: '#fdba74', hDark: '#f97316', bLight: '#fed7aa', bDark: '#ea580c', stroke: '#c2410c', shadow: '#7c2d12' }, // Orange
];

const getAvatarSvg = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const p = palettes[Math.abs(hash) % palettes.length];
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p.hLight}" />
      <stop offset="100%" stop-color="${p.hDark}" />
    </linearGradient>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p.bLight}" />
      <stop offset="100%" stop-color="${p.bDark}" />
    </linearGradient>
    <radialGradient id="hh" cx="30%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="bh" cx="30%" cy="10%" r="60%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <filter id="ds" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="${p.shadow}" flood-opacity="0.3"/>
    </filter>
  </defs>
  <g filter="url(#ds)" transform="translate(0, 5)">
    <path d="M 15 95 C 15 60 25 50 50 50 C 75 50 85 60 85 95" fill="url(#bg)" stroke="${p.stroke}" stroke-width="2" />
    <path d="M 15 95 C 15 60 25 50 50 50 C 75 50 85 60 85 95" fill="url(#bh)" />
    <circle cx="50" cy="32" r="24" fill="url(#hg)" stroke="${p.stroke}" stroke-width="2" />
    <circle cx="50" cy="32" r="24" fill="url(#hh)" />
  </g>
</svg>`;
};

console.log(getAvatarSvg('test').length);
