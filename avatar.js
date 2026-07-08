const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#86efac" />
      <stop offset="100%" stop-color="#22c55e" />
    </linearGradient>
    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#bbf7d0" />
      <stop offset="100%" stop-color="#4ade80" />
    </linearGradient>
    <radialGradient id="headHighlight" cx="35%" cy="30%" r="40%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="bodyHighlight" cx="30%" cy="10%" r="60%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#064e3b" flood-opacity="0.25"/>
    </filter>
  </defs>
  
  <rect width="100" height="100" fill="#f8fafc" />
  
  <g filter="url(#dropShadow)">
    <g transform="translate(0, 5)">
      <!-- Body -->
      <path d="M 20 95 C 20 65 30 55 50 55 C 70 55 80 65 80 95" fill="url(#bodyGrad)" stroke="#16a34a" stroke-width="2.5" />
      <!-- Body Highlight -->
      <path d="M 20 95 C 20 65 30 55 50 55 C 70 55 80 65 80 95" fill="url(#bodyHighlight)" />
      
      <!-- Head -->
      <circle cx="50" cy="35" r="22" fill="url(#headGrad)" stroke="#16a34a" stroke-width="2.5" />
      <!-- Head Highlight -->
      <circle cx="50" cy="35" r="22" fill="url(#headHighlight)" />
    </g>
  </g>
</svg>`;
console.log("data:image/svg+xml;base64," + Buffer.from(svg).toString('base64'));
