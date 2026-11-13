const PALETTES = Object.freeze({
  Electronics: {
    background: '#DCEBFF',
    ink: '#20365B',
    accent: '#FF6B2C',
    glyph: 'EL',
  },
  Apparel: {
    background: '#F6DCCF',
    ink: '#4B2D28',
    accent: '#FF6B2C',
    glyph: 'AP',
  },
  Footwear: {
    background: '#DDEBDD',
    ink: '#254631',
    accent: '#C6F135',
    glyph: 'FW',
  },
  'Home & Kitchen': {
    background: '#F5E7BE',
    ink: '#49391F',
    accent: '#FF6B2C',
    glyph: 'HK',
  },
  Books: {
    background: '#E4DCF5',
    ink: '#3D315B',
    accent: '#C6F135',
    glyph: 'BK',
  },
  Beauty: {
    background: '#F6DDE8',
    ink: '#542C3D',
    accent: '#FF6B2C',
    glyph: 'BY',
  },
})

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function createIllustration(category, palette) {
  switch (category) {
    case 'Electronics':
      return `
        <rect x="106" y="76" width="108" height="70" rx="8" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="6" />
        <path d="M142 158h36m-18-12v12m-32 0h64" fill="none" stroke="${palette.ink}" stroke-linecap="round" stroke-width="7" />
        <circle cx="160" cy="111" r="13" fill="${palette.background}" />
      `
    case 'Apparel':
      return `
        <path d="m132 77 19-10h18l19 10 21 17-14 20-13-9v56h-64V105l-13 9-14-20 21-17Z" fill="${palette.accent}" stroke="${palette.ink}" stroke-linejoin="round" stroke-width="6" />
        <path d="M151 68c1 13 17 13 18 0" fill="none" stroke="${palette.ink}" stroke-width="5" />
      `
    case 'Footwear':
      return `
        <path d="M104 137c19-2 37-16 45-43l18 7c7 21 22 32 46 37 10 2 17 9 17 18v10H103v-12c0-9 1-15 1-17Z" fill="${palette.accent}" stroke="${palette.ink}" stroke-linejoin="round" stroke-width="6" />
        <path d="m148 108 18 8m-23 4 19 8m-43 25h92" fill="none" stroke="${palette.ink}" stroke-linecap="round" stroke-width="5" />
      `
    case 'Home & Kitchen':
      return `
        <path d="m103 113 57-45 57 45v53H103v-53Z" fill="${palette.accent}" stroke="${palette.ink}" stroke-linejoin="round" stroke-width="6" />
        <path d="M145 166v-36h30v36m-51-40h15m32 0h15" fill="none" stroke="${palette.ink}" stroke-linecap="round" stroke-width="6" />
      `
    case 'Books':
      return `
        <path d="M100 83c22-8 43-5 60 8v77c-17-13-38-16-60-8V83Zm120 0c-22-8-43-5-60 8v77c17-13 38-16 60-8V83Z" fill="${palette.accent}" stroke="${palette.ink}" stroke-linejoin="round" stroke-width="6" />
        <path d="M119 103c12-3 23-1 32 4m50-4c-12-3-23-1-32 4m-50 13c12-3 23-1 32 4m50-4c-12-3-23-1-32 4" fill="none" stroke="${palette.ink}" stroke-linecap="round" stroke-width="4" />
      `
    case 'Beauty':
      return `
        <path d="M145 78h30v15l12 10v62h-54v-62l12-10V78Z" fill="${palette.accent}" stroke="${palette.ink}" stroke-linejoin="round" stroke-width="6" />
        <path d="M145 78h30m-30 30h30m-39 14h48" fill="none" stroke="${palette.ink}" stroke-linecap="round" stroke-width="5" />
      `
    default:
      return `<circle cx="160" cy="120" r="45" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="6" />`
  }
}

export function generateThumbnail(product) {
  const category = typeof product?.category === 'string' ? product.category : ''
  const palette = PALETTES[category] ?? {
    background: '#F6EFE3',
    ink: '#1B1B1B',
    accent: '#FF6B2C',
    glyph: 'PR',
  }
  const productId = Number.isInteger(product?.id) ? product.id : 0
  const rotation = (productId % 7) - 3
  const name = escapeXml(product?.name ?? 'Product')
  const label = escapeXml(category || 'Product')
  const illustration = createIllustration(category, palette)

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240" role="img" aria-labelledby="title description">
  <title id="title">${name}</title>
  <desc id="description">${label} product illustration</desc>
  <rect width="320" height="240" fill="${palette.background}" />
  <circle cx="267" cy="56" r="32" fill="${palette.accent}" opacity=".22" />
  <path d="M18 178c41-22 70-18 105 3 35 20 73 24 179-5v46H18v-44Z" fill="${palette.ink}" opacity=".06" />
  <rect x="16" y="16" width="288" height="208" rx="12" fill="none" stroke="${palette.ink}" stroke-width="2" />
  <text x="32" y="44" fill="${palette.ink}" font-family="Arial, sans-serif" font-size="12" font-weight="700" letter-spacing="2">${palette.glyph}</text>
  <g transform="rotate(${rotation} 160 120)">
    ${illustration}
  </g>
  <text x="32" y="207" fill="${palette.ink}" font-family="Arial, sans-serif" font-size="12" font-weight="700">${label}</text>
  <text x="288" y="207" fill="${palette.ink}" font-family="monospace" font-size="12" text-anchor="end">#${productId}</text>
</svg>`
}
