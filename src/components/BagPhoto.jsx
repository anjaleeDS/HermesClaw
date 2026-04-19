// src/components/BagPhoto.jsx
// Sprite-sheet crop of the 3×2 bag photo composites.
// Each image is a 3-column × 2-row grid of colorways.
// colorIndex (0–5) picks which colorway to show, seeded by runCount.

import kellysUrl     from '../assets/kellys.png';
import constancesUrl from '../assets/constances.png';
import birkinsUrl    from '../assets/birkins.png';

// Which sprite sheet each bag ID uses
const SHEET_URL = {
  constance24:   constancesUrl,
  constanceMini: constancesUrl,
  kelly28:       kellysUrl,
  kelly25:       kellysUrl,
  birkin30:      birkinsUrl,
  birkin25:      birkinsUrl,
};

// CSS background-position values for each grid cell (3 cols × 2 rows)
// background-size: 300% 200% makes each cell exactly fill the container
const COL = ['0%', '50%', '100%'];
const ROW = ['0%', '100%'];

export default function BagPhoto({ bagId, colorIndex = 0 }) {
  const url = SHEET_URL[bagId];
  if (!url) return null;

  const idx  = ((colorIndex % 6) + 6) % 6;  // safe modulo
  const xPos = COL[idx % 3];
  const yPos = ROW[Math.floor(idx / 3)];

  return (
    <div
      className="bag-photo-reveal"
      style={{
        backgroundImage:    `url(${url})`,
        backgroundSize:     '300% 200%',
        backgroundPosition: `${xPos} ${yPos}`,
        backgroundRepeat:   'no-repeat',
      }}
    />
  );
}
