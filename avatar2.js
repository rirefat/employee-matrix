const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6ee7b7" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>
    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a7f3d0" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <radialGradient id="headHighlight" cx="30%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="bodyHighlight" cx="30%" cy="10%" r="60%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#022c22" flood-opacity="0.3"/>
    </filter>
  </defs>
  <g filter="url(#dropShadow)" transform="translate(0, 5)">
    <path d="M 15 95 C 15 60 25 50 50 50 C 75 50 85 60 85 95" fill="url(#bodyGrad)" stroke="#047857" stroke-width="2" />
    <path d="M 15 95 C 15 60 25 50 50 50 C 75 50 85 60 85 95" fill="url(#bodyHighlight)" />
    <circle cx="50" cy="32" r="24" fill="url(#headGrad)" stroke="#047857" stroke-width="2" />
    <circle cx="50" cy="32" r="24" fill="url(#headHighlight)" />
  </g>
</svg>`;
console.log("data:image/svg+xml;base64," + Buffer.from(svg).toString('base64'));
