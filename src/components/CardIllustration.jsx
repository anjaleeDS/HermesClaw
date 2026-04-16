// src/components/CardIllustration.jsx
// Each card type gets a distinct SVG illustration

function BoutiqueVisit() {
  // Orange Hermès box
  return (
    <svg width="100%" height="100%" viewBox="0 0 120 90" fill="none">
      {/* Box shadow */}
      <rect x="22" y="34" width="76" height="46" rx="1" fill="#c45010" opacity="0.3" />
      {/* Box body */}
      <rect x="20" y="30" width="76" height="46" rx="1" fill="#e8601c" />
      {/* Box lid */}
      <rect x="16" y="20" width="84" height="14" rx="1" fill="#d4561a" />
      {/* Lid highlight */}
      <rect x="16" y="20" width="84" height="4" rx="1" fill="#f07030" opacity="0.4" />
      {/* Ribbon vertical */}
      <rect x="56" y="20" width="8" height="56" fill="#f5f0e8" opacity="0.6" />
      {/* Ribbon horizontal */}
      <rect x="16" y="41" width="84" height="7" fill="#f5f0e8" opacity="0.6" />
      {/* Bow top-left loop */}
      <path d="M52 20 Q44 10 38 14 Q34 18 42 22 Z" fill="#f5f0e8" opacity="0.8" />
      {/* Bow top-right loop */}
      <path d="M68 20 Q76 10 82 14 Q86 18 78 22 Z" fill="#f5f0e8" opacity="0.8" />
      {/* H lettermark */}
      <text x="60" y="62" textAnchor="middle" fill="#f5f0e8"
            fontSize="16" fontFamily="Georgia, serif" fontWeight="bold" opacity="0.9">H</text>
    </svg>
  );
}

function TalkToAssociate() {
  // Elegant face — the associate
  return (
    <svg width="100%" height="100%" viewBox="0 0 120 90" fill="none">
      {/* Background circle */}
      <circle cx="60" cy="48" r="34" fill="#1a1a1a" opacity="0.06" />
      {/* Hair */}
      <ellipse cx="60" cy="34" rx="22" ry="20" fill="#2a2a2a" />
      {/* Face */}
      <ellipse cx="60" cy="50" rx="17" ry="19" fill="#e8d5bf" />
      {/* Eyes */}
      <ellipse cx="53" cy="46" rx="3" ry="2" fill="#2a2a2a" />
      <ellipse cx="67" cy="46" rx="3" ry="2" fill="#2a2a2a" />
      <circle cx="54" cy="45.3" r="0.8" fill="white" />
      <circle cx="68" cy="45.3" r="0.8" fill="white" />
      {/* Eyebrows */}
      <path d="M49 41 Q53 38 57 40" stroke="#2a2a2a" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M63 40 Q67 38 71 41" stroke="#2a2a2a" strokeWidth="1.2" strokeLinecap="round" />
      {/* Nose */}
      <path d="M60 50 Q58 54 56 55 Q59 57 63 55 Q62 54 60 50"
            stroke="#c4a882" strokeWidth="0.7" fill="none" />
      {/* Neutral/slight smile */}
      <path d="M53 59 Q60 63 67 59" stroke="#2a2a2a" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      {/* Collar */}
      <path d="M30 88 L43 70 L60 76 L77 70 L90 88 Z" fill="#2a2a2a" />
      <path d="M53 70 L60 78 L67 70" stroke="#4a4a4a" strokeWidth="0.8" fill="none" />
      {/* Pearl earrings */}
      <circle cx="43" cy="56" r="2.5" fill="#f5f0e8" stroke="#d4cfc6" strokeWidth="0.5" />
      <circle cx="77" cy="56" r="2.5" fill="#f5f0e8" stroke="#d4cfc6" strokeWidth="0.5" />
    </svg>
  );
}

function WaitCard() {
  // Hourglass — patience is currency
  return (
    <svg width="100%" height="100%" viewBox="0 0 120 90" fill="none">
      {/* Outer frame */}
      <line x1="38" y1="12" x2="82" y2="12" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="38" y1="78" x2="82" y2="78" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
      {/* Top half — glass (sand falling) */}
      <path d="M40 12 L80 12 L60 45 Z" fill="#d4cfc6" opacity="0.5" />
      <path d="M40 12 L80 12 L60 45 Z" stroke="#1a1a1a" strokeWidth="1.5" />
      {/* Bottom half — glass (sand accumulating) */}
      <path d="M40 78 L80 78 L60 45 Z" stroke="#1a1a1a" strokeWidth="1.5" />
      {/* Sand in bottom */}
      <path d="M48 78 L72 78 L60 60 Z" fill="#d4cfc6" opacity="0.7" />
      {/* Sand grain falling */}
      <line x1="60" y1="45" x2="60" y2="54" stroke="#6b6b6b" strokeWidth="1" strokeDasharray="2 2" />
      {/* Decorative lines on frame */}
      <line x1="34" y1="8"  x2="34" y2="82" stroke="#d4cfc6" strokeWidth="1" />
      <line x1="86" y1="8"  x2="86" y2="82" stroke="#d4cfc6" strokeWidth="1" />
    </svg>
  );
}

function SecondaryMarket() {
  // Two coins exchanging hands — gold tone
  return (
    <svg width="100%" height="100%" viewBox="0 0 120 90" fill="none">
      {/* Left coin — back */}
      <circle cx="42" cy="48" r="20" fill="#b8a06a" opacity="0.25" />
      <circle cx="42" cy="48" r="20" stroke="#b8a06a" strokeWidth="1.5" />
      <text x="42" y="54" textAnchor="middle" fill="#b8a06a"
            fontSize="18" fontFamily="Georgia, serif">$</text>
      {/* Right coin — front */}
      <circle cx="78" cy="48" r="20" fill="#b8a06a" opacity="0.15" />
      <circle cx="78" cy="48" r="20" stroke="#b8a06a" strokeWidth="1.5" />
      <text x="78" y="54" textAnchor="middle" fill="#b8a06a"
            fontSize="18" fontFamily="Georgia, serif">$</text>
      {/* Exchange arrow top */}
      <path d="M46 28 Q60 20 74 28" stroke="#b8a06a" strokeWidth="1.2"
            fill="none" strokeLinecap="round" markerEnd="url(#arrowGold)" />
      <polygon points="74,24 78,30 70,30" fill="#b8a06a" />
      {/* Exchange arrow bottom */}
      <path d="M74 68 Q60 76 46 68" stroke="#b8a06a" strokeWidth="1.2"
            fill="none" strokeLinecap="round" />
      <polygon points="46,72 42,66 50,66" fill="#b8a06a" />
    </svg>
  );
}

function LuckyMoment() {
  // Orange box glimpsed — rare moment
  return (
    <svg width="100%" height="100%" viewBox="0 0 120 90" fill="none">
      {/* Radiating lines — spotlight */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle, i) => {
        const r1 = 22, r2 = 42;
        const rad = (angle * Math.PI) / 180;
        const x1 = 60 + r1 * Math.cos(rad);
        const y1 = 45 + r1 * Math.sin(rad);
        const x2 = 60 + r2 * Math.cos(rad);
        const y2 = 45 + r2 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                     stroke="#b8a06a" strokeWidth="0.8" opacity="0.5" />;
      })}
      {/* Diamond shape */}
      <path d="M60 18 L80 45 L60 72 L40 45 Z" fill="#e8601c" opacity="0.15" />
      <path d="M60 18 L80 45 L60 72 L40 45 Z" stroke="#e8601c" strokeWidth="1.5" />
      {/* Inner diamond */}
      <path d="M60 30 L70 45 L60 60 L50 45 Z" fill="#e8601c" opacity="0.3" />
      {/* Question mark — mystery */}
      <text x="60" y="51" textAnchor="middle" fill="#e8601c"
            fontSize="16" fontFamily="Georgia, serif" fontWeight="300">?</text>
    </svg>
  );
}

function ColdShoulder() {
  // Figure turning away — rejection
  return (
    <svg width="100%" height="100%" viewBox="0 0 120 90" fill="none">
      {/* Figure — back turned, 3/4 view */}
      {/* Head from behind */}
      <ellipse cx="62" cy="28" rx="16" ry="17" fill="#2a2a2a" />
      {/* Hair sweep — back of head visible */}
      <path d="M46 28 Q50 12 62 10 Q74 12 78 28" fill="#1a1a1a" />
      {/* Neck */}
      <rect x="57" y="43" width="10" height="9" fill="#e8d5bf" />
      {/* Turned body */}
      <path d="M34 88 L46 62 L57 68 L62 64 L78 58 L88 88 Z" fill="#2a2a2a" />
      {/* Shoulder line — turned away */}
      <path d="M46 62 Q52 56 78 58" stroke="#4a4a4a" strokeWidth="1" fill="none" />
      {/* Ice crystal — cold */}
      <line x1="22" y1="20" x2="22" y2="40" stroke="#8b2e2e" strokeWidth="1.5" />
      <line x1="14" y1="30" x2="30" y2="30" stroke="#8b2e2e" strokeWidth="1.5" />
      <line x1="15" y1="23" x2="29" y2="37" stroke="#8b2e2e" strokeWidth="1" opacity="0.7" />
      <line x1="29" y1="23" x2="15" y2="37" stroke="#8b2e2e" strokeWidth="1" opacity="0.7" />
      {/* Snowflake dots */}
      <circle cx="22" cy="18" r="1.5" fill="#8b2e2e" />
      <circle cx="22" cy="42" r="1.5" fill="#8b2e2e" />
      <circle cx="12" cy="30" r="1.5" fill="#8b2e2e" />
      <circle cx="32" cy="30" r="1.5" fill="#8b2e2e" />
    </svg>
  );
}

// Map card type → illustration component
const ILLUSTRATIONS = {
  boutiqueVisit:    BoutiqueVisit,
  talkToAssociate:  TalkToAssociate,
  wait:             WaitCard,
  secondaryMarket:  SecondaryMarket,
  luckyMoment:      LuckyMoment,
  coldShoulder:     ColdShoulder,
};

// Background tints per card type
const BG_TINTS = {
  boutiqueVisit:   '#fff8f3',
  talkToAssociate: '#f5f0e8',
  wait:            '#f8f7f5',
  secondaryMarket: '#fdf9f0',
  luckyMoment:     '#fff8f3',
  coldShoulder:    '#faf5f5',
};

export default function CardIllustration({ cardType }) {
  const Illustration = ILLUSTRATIONS[cardType] ?? TalkToAssociate;
  const bg = BG_TINTS[cardType] ?? '#faf8f4';
  return (
    <div className="card-illustration" style={{ background: bg }}>
      <Illustration />
    </div>
  );
}
