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
  // Two speech bubbles — the conversation, not the person
  return (
    <svg width="100%" height="100%" viewBox="0 0 120 90" fill="none">
      {/* Large bubble — her voice */}
      <rect x="18" y="12" width="62" height="36" rx="8"
            fill="#f5f0e8" stroke="#1a1a1a" strokeWidth="2.2" />
      {/* Bubble tail — points down-left (her side) */}
      <path d="M30 48 L22 62 L44 48 Z"
            fill="#f5f0e8" stroke="#1a1a1a" strokeWidth="2.2"
            strokeLinejoin="round" />
      {/* Ellipsis inside — she's considering */}
      <circle cx="38" cy="30" r="3.5" fill="#1a1a1a" opacity="0.18" />
      <circle cx="52" cy="30" r="3.5" fill="#1a1a1a" opacity="0.18" />
      <circle cx="66" cy="30" r="3.5" fill="#1a1a1a" opacity="0.18" />
      {/* Small bubble — your reply */}
      <rect x="52" y="54" width="46" height="26" rx="7"
            fill="#e8601c" stroke="#1a1a1a" strokeWidth="2" />
      {/* Bubble tail — points up-right (your side) */}
      <path d="M86 54 L96 44 L72 54 Z"
            fill="#e8601c" stroke="#1a1a1a" strokeWidth="2"
            strokeLinejoin="round" />
      {/* Dash inside — waiting, listening */}
      <rect x="66" y="64" width="24" height="3" rx="1.5"
            fill="#fff" opacity="0.7" />
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
  // Closed door — shut out
  return (
    <svg width="100%" height="100%" viewBox="0 0 120 90" fill="none">
      {/* Door frame */}
      <rect x="28" y="8" width="64" height="76" rx="2"
            fill="none" stroke="#1a1a1a" strokeWidth="2.2" />
      {/* Door panel */}
      <rect x="34" y="14" width="52" height="64" rx="1"
            fill="#f5f0e8" stroke="#1a1a1a" strokeWidth="2" />
      {/* Upper panel inset */}
      <rect x="40" y="20" width="40" height="22" rx="1"
            fill="none" stroke="#d4cfc6" strokeWidth="1.2" />
      {/* Lower panel inset */}
      <rect x="40" y="48" width="40" height="22" rx="1"
            fill="none" stroke="#d4cfc6" strokeWidth="1.2" />
      {/* Door knob */}
      <circle cx="76" cy="46" r="4.5"
              fill="#D4AF6A" stroke="#1a1a1a" strokeWidth="1.8" />
      <circle cx="76" cy="46" r="1.8" fill="#1a1a1a" opacity="0.3" />
      {/* Red X — not today */}
      <line x1="14" y1="62" x2="26" y2="74" stroke="#8b2e2e" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="26" y1="62" x2="14" y2="74" stroke="#8b2e2e" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function SaOffer() {
  // Hangtag with ribbon — the SA discreetly presents something
  return (
    <svg width="100%" height="100%" viewBox="0 0 120 90" fill="none">
      {/* Ribbon from top */}
      <path d="M60 8 Q60 20 60 28" stroke="#b8a06a" strokeWidth="1.5" strokeDasharray="3 2" strokeLinecap="round" />
      {/* Tag body */}
      <rect x="32" y="28" width="56" height="50" rx="3"
            fill="#f5f0e8" stroke="#1a1a1a" strokeWidth="2" />
      {/* Hole at top of tag */}
      <circle cx="60" cy="30" r="3.5" fill="white" stroke="#1a1a1a" strokeWidth="1.5" />
      {/* Tag top fold shadow */}
      <rect x="32" y="28" width="56" height="10" rx="3"
            fill="#ede8e0" stroke="#1a1a1a" strokeWidth="2" />
      {/* Bag silhouette on tag */}
      <path d="M46 62 L44 52 Q44 50 46 50 L74 50 Q76 50 76 52 L74 62 Z"
            fill="#e8601c" opacity="0.85" stroke="#1a1a1a" strokeWidth="1.5" />
      <path d="M52 50 Q52 44 60 42 Q68 44 68 50"
            stroke="#1a1a1a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Price line — suggests a label */}
      <rect x="40" y="66" width="40" height="5" rx="2" fill="#d4cfc6" opacity="0.6" />
      <rect x="44" y="73" width="28" height="4" rx="2" fill="#d4cfc6" opacity="0.4" />
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
  saOffer:          SaOffer,
};

// Background tints per card type
const BG_TINTS = {
  boutiqueVisit:   '#fff8f3',
  talkToAssociate: '#f5f0e8',
  wait:            '#f8f7f5',
  secondaryMarket: '#fdf9f0',
  luckyMoment:     '#fff8f3',
  coldShoulder:    '#faf5f5',
  saOffer:         '#fdf9f0',
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
