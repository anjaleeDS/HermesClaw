// src/components/AssociatePortrait.jsx
// Three distinct NPCs — one per chapter. Marmaduke style: bold outlines, flat fills.

// ─────────────────────────────────────────────
// Chapter 0: THE MAN — suited, stiff, intimidating
// Junior associate who has memorised the policy manual
// ─────────────────────────────────────────────
function ManPortrait({ mood }) {
  const mouthPath = {
    neutral: 'M34 54 L46 54',
    warm:    'M34 52 Q40 57 46 52',
    cold:    'M34 55 Q40 51 46 55',
  }[mood];

  const browLeft = mood === 'cold'
    ? 'M27 36 Q33 31 39 35'
    : 'M27 37 Q33 34 39 37';

  const accentColor = mood === 'warm' ? '#b8a06a' : mood === 'cold' ? '#8b2e2e' : '#6b6b6b';

  return (
    <svg width="100" height="110" viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hair — short, slicked */}
      <ellipse cx="40" cy="24" rx="20" ry="14" fill="#1a1a1a" />
      <path d="M20 24 Q20 14 40 12 Q60 14 60 24" fill="#1a1a1a" />
      {/* Side part line */}
      <path d="M28 12 L30 24" stroke="#3a3a3a" strokeWidth="1" />

      {/* Face — slightly square jaw */}
      <path d="M22 40 Q20 50 22 58 Q26 66 40 68 Q54 66 58 58 Q60 50 58 40 Q55 30 40 28 Q25 30 22 40 Z"
            fill="#d4b896" stroke="#1a1a1a" strokeWidth="1.5" />

      {/* Eyebrows — stern */}
      <path d={browLeft} stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
      <path d="M41 37 Q47 34 53 37" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />

      {/* Eyes — heavy lidded */}
      <ellipse cx="34" cy="42" rx="4" ry="2.8" fill="#1a1a1a" />
      <ellipse cx="46" cy="42" rx="4" ry="2.8" fill="#1a1a1a" />
      <circle cx="35.2" cy="41.2" r="1" fill="white" />
      <circle cx="47.2" cy="41.2" r="1" fill="white" />
      {/* Heavy upper lid */}
      <path d="M30 40 Q34 38 38 40" stroke="#1a1a1a" strokeWidth="1.2" />
      <path d="M42 40 Q46 38 50 40" stroke="#1a1a1a" strokeWidth="1.2" />

      {/* Nose — straight, prominent */}
      <path d="M40 46 L38 54 Q40 56 42 54 L40 46" stroke="#b8956a" strokeWidth="1" fill="none" />

      {/* Mouth */}
      <path d={mouthPath} stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />

      {/* Ear */}
      <ellipse cx="21" cy="47" rx="3" ry="5" fill="#d4b896" stroke="#1a1a1a" strokeWidth="1.2" />
      <ellipse cx="59" cy="47" rx="3" ry="5" fill="#d4b896" stroke="#1a1a1a" strokeWidth="1.2" />

      {/* Neck */}
      <rect x="35" y="66" width="10" height="8" fill="#d4b896" />

      {/* Suit jacket — dark, structured */}
      <path d="M10 90 L22 66 L35 72 L40 68 L45 72 L58 66 L70 90 Z"
            fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="1" />
      {/* Lapels */}
      <path d="M35 72 L38 82 L40 78 L42 82 L45 72" fill="#2a2a2a" stroke="#3a3a3a" strokeWidth="0.8" />
      {/* White shirt collar */}
      <path d="M35 72 L32 68 L40 70 L48 68 L45 72" fill="#f5f0e8" />
      {/* Tie — slim, dark */}
      <path d="M40 70 L38 80 L40 84 L42 80 Z" fill={accentColor} />
      {/* Tie knot */}
      <path d="M38 70 L40 73 L42 70 Q41 68 40 68 Q39 68 38 70 Z" fill={accentColor} />

      {/* Pocket square — subtle */}
      <path d="M18 74 L22 74 L21 70 L19 70 Z" fill="#f5f0e8" opacity="0.6" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// Chapter 1: THE WOMAN — polished, refined, the original gatekeeper
// ─────────────────────────────────────────────
function WomanPortrait({ mood }) {
  const mouth = {
    neutral: 'M33 52 L47 52',
    warm:    'M33 50 Q40 56 47 50',
    cold:    'M33 53 Q40 49 47 53',
  }[mood];

  const browLeft = mood === 'cold'
    ? 'M28 34 Q33 30 38 33'
    : 'M28 35 Q33 32 38 35';

  const accentFill = mood === 'warm' ? '#b8a06a' : mood === 'cold' ? '#8b2e2e' : '#6b6b6b';

  return (
    <svg width="100" height="110" viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hair — swept back chignon */}
      <ellipse cx="40" cy="26" rx="22" ry="20" fill="#2a2a2a" />
      <path d="M18 26 Q16 10 30 8 Q40 5 50 8 Q64 10 62 26" fill="#2a2a2a" />
      {/* Chignon bun at back */}
      <ellipse cx="56" cy="18" rx="8" ry="7" fill="#1a1a1a" />
      {/* Hair highlight */}
      <path d="M22 18 Q35 10 48 14" stroke="#4a4a4a" strokeWidth="0.8" opacity="0.5" />

      {/* Face */}
      <ellipse cx="40" cy="44" rx="18" ry="20" fill="#e8d5bf" stroke="#1a1a1a" strokeWidth="1.2" />

      {/* Eyebrows — arched */}
      <path d={browLeft} stroke="#2a2a2a" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M42 35 Q47 32 52 35" stroke="#2a2a2a" strokeWidth="1.4" strokeLinecap="round" />

      {/* Eyes */}
      <ellipse cx="34" cy="40" rx="3.5" ry="2.5" fill="#2a2a2a" />
      <ellipse cx="46" cy="40" rx="3.5" ry="2.5" fill="#2a2a2a" />
      <circle cx="35.2" cy="39.2" r="0.9" fill="white" />
      <circle cx="47.2" cy="39.2" r="0.9" fill="white" />
      {/* Lashes — top */}
      <path d="M30 38 Q34 36 38 38" stroke="#2a2a2a" strokeWidth="1" />
      <path d="M42 38 Q46 36 50 38" stroke="#2a2a2a" strokeWidth="1" />

      {/* Nose */}
      <path d="M40 44 Q38 48 36 49 Q39 51 43 49 Q42 48 40 44"
            stroke="#c4a882" strokeWidth="0.8" fill="none" />

      {/* Lips — fuller */}
      <path d={mouth} stroke="#2a2a2a" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M33 52 Q37 50 40 51 Q43 50 47 52" stroke="#2a2a2a" strokeWidth="0.6" fill="none" opacity="0.5" />

      {/* Pearl earrings */}
      <circle cx="22" cy="48" r="3" fill="#f5f0e8" stroke="#d4cfc6" strokeWidth="1" />
      <circle cx="58" cy="48" r="3" fill="#f5f0e8" stroke="#d4cfc6" strokeWidth="1" />

      {/* Neck */}
      <rect x="35" y="62" width="10" height="10" fill="#e8d5bf" />

      {/* Jacket */}
      <path d="M12 90 L24 66 L35 72 L40 68 L45 72 L56 66 L68 90 Z" fill="#2a2a2a" />
      {/* Lapels */}
      <path d="M35 72 L40 80 L45 72" stroke="#4a4a4a" strokeWidth="0.8" fill="none" />
      {/* Collar scarf hint — Twilly */}
      <path d="M33 68 Q40 72 47 68" stroke="#e8601c" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

      {/* Accent gem */}
      <circle cx="40" cy="76" r="2.5" fill={accentFill} />
    </svg>
  );
}

// ─────────────────────────────────────────────
// Chapter 2: THE ANDROGYNOUS FIGURE — ageless, unknowable, the final arbiter
// ─────────────────────────────────────────────
function AndrogynousPortrait({ mood }) {
  const mouth = {
    neutral: 'M34 53 L46 53',       // perfectly flat — unreadable
    warm:    'M34 52 Q40 55 46 52',  // barely there
    cold:    'M35 54 Q40 52 45 54',  // barely there
  }[mood];

  const accentColor = mood === 'warm' ? '#b8a06a' : mood === 'cold' ? '#8b2e2e' : '#2a2a2a';

  return (
    <svg width="100" height="110" viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hair — geometric, severe, neither short nor long */}
      <path d="M20 32 L20 16 Q40 6 60 16 L60 32 Q56 14 40 12 Q24 14 20 32 Z" fill="#1a1a1a" />
      {/* Sharp side cut */}
      <path d="M20 16 L20 40 Q18 44 20 48" stroke="#1a1a1a" strokeWidth="2" />
      <path d="M60 16 L60 32" stroke="#1a1a1a" strokeWidth="2" />
      {/* Geometric fringe */}
      <path d="M26 16 L24 26 L30 26 L28 16 Z" fill="#2a2a2a" />
      <path d="M34 14 L33 24 L39 24 L38 14 Z" fill="#2a2a2a" />

      {/* Face — more angular */}
      <path d="M20 38 Q20 50 22 60 Q28 68 40 68 Q52 68 58 60 Q60 50 60 38 Q56 28 40 26 Q24 28 20 38 Z"
            fill="#ddc9a8" stroke="#1a1a1a" strokeWidth="1.5" />

      {/* Eyebrows — perfectly horizontal, architectural */}
      <line x1="27" y1="36" x2="38" y2="36" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="square" />
      <line x1="42" y1="36" x2="53" y2="36" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="square" />

      {/* Eyes — almost geometric, almond shaped */}
      <path d="M27 41 Q34 37 41 41 Q34 45 27 41 Z" fill="#1a1a1a" />
      <path d="M39 41 Q46 37 53 41 Q46 45 39 41 Z" fill="#1a1a1a" />
      <circle cx="34" cy="41" r="1.2" fill="white" />
      <circle cx="46" cy="41" r="1.2" fill="white" />

      {/* Nose — sharp, straight */}
      <line x1="40" y1="44" x2="40" y2="52" stroke="#c4a882" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M36 52 Q40 54 44 52" stroke="#c4a882" strokeWidth="0.8" fill="none" />

      {/* Mouth — minimal */}
      <path d={mouth} stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="square" />

      {/* Neck */}
      <rect x="35" y="66" width="10" height="10" fill="#ddc9a8" />

      {/* Outfit — high neck, architectural */}
      <path d="M8 90 L22 64 L36 70 L40 66 L44 70 L58 64 L72 90 Z" fill="#1a1a1a" />
      {/* High collar */}
      <path d="M34 68 L32 62 L40 64 L48 62 L46 68" fill="#2a2a2a" stroke="#3a3a3a" strokeWidth="0.5" />
      {/* Architectural detail — single geometric brooch */}
      <rect x="37" y="74" width="6" height="6" fill="none" stroke={accentColor} strokeWidth="1.5" />
      <rect x="38.5" y="75.5" width="3" height="3" fill={accentColor} />
    </svg>
  );
}

// ─────────────────────────────────────────────
// EXPORT — picks portrait by chapter
// ─────────────────────────────────────────────
export default function AssociatePortrait({ mood, chapter = 0 }) {
  const portraits = [ManPortrait, WomanPortrait, AndrogynousPortrait];
  const Portrait  = portraits[chapter] ?? ManPortrait;
  return <Portrait mood={mood ?? 'neutral'} />;
}
