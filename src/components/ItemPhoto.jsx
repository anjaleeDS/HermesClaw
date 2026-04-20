// src/components/ItemPhoto.jsx
// Unified photo component for all acquired items.
// Handles two sprite-sheet formats:
//   3×2 grid (6 colorways): bags + twilly, bracelet, shoes, belt
//   4×2 grid (8 colorways): scarfCarre
// colorIndex (0–5 or 0–7) is seeded by runCount for variety across runs.

import constancesUrl from '../assets/constances.png';
import kellysUrl     from '../assets/kellys.png';
import birkinsUrl    from '../assets/birkins.png';
import twillyUrl     from '../assets/twilly.png';
import braceletUrl   from '../assets/bracelet.png';
import shoeUrl       from '../assets/shoe.png';
import beltUrl       from '../assets/belt.png';
import scarfUrl      from '../assets/scarf.png';

// 3×2 sprite sheets: 3 columns, 2 rows → 6 colorways
// backgroundSize: '300% auto' makes one cell fill the container
const GRID_3X2 = {
  constance24:   constancesUrl,
  constanceMini: constancesUrl,
  kelly28:       kellysUrl,
  kelly25:       kellysUrl,
  birkin30:      birkinsUrl,
  birkin25:      birkinsUrl,
  twilly:        twillyUrl,
  bracelet:      braceletUrl,
  shoes:         shoeUrl,
  kellyBelt:     beltUrl,
};

// 4×2 sprite sheet: 4 columns, 2 rows → 8 colorways
// backgroundSize: '400% auto'
const GRID_4X2 = {
  scarfCarre: scarfUrl,
};

const COL_3 = ['0%', '50%', '100%'];
const COL_4 = ['0%', '33.33%', '66.67%', '100%'];
const ROW   = ['0%', '100%'];

export default function ItemPhoto({ itemId, colorIndex = 0 }) {
  if (GRID_3X2[itemId]) {
    const url = GRID_3X2[itemId];
    const idx  = ((colorIndex % 6) + 6) % 6;  // safe modulo
    const xPos = COL_3[idx % 3];
    const yPos = ROW[Math.floor(idx / 3)];
    return (
      <div
        className="bag-photo-reveal"
        style={{
          backgroundImage:    `url(${url})`,
          backgroundSize:     '300% auto',
          backgroundPosition: `${xPos} ${yPos}`,
          backgroundRepeat:   'no-repeat',
        }}
      />
    );
  }

  if (GRID_4X2[itemId]) {
    const url = GRID_4X2[itemId];
    const idx  = ((colorIndex % 8) + 8) % 8;  // safe modulo
    const xPos = COL_4[idx % 4];
    const yPos = ROW[Math.floor(idx / 4)];
    return (
      <div
        className="bag-photo-reveal"
        style={{
          backgroundImage:    `url(${url})`,
          backgroundSize:     '400% auto',
          backgroundPosition: `${xPos} ${yPos}`,
          backgroundRepeat:   'no-repeat',
        }}
      />
    );
  }

  // No photo available for this item
  return null;
}
