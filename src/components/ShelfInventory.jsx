// src/components/ShelfInventory.jsx
// Drawn shelf with Marmaduke-style cartoon item illustrations.
// Replaces the text-badge Inventory component.

// ─────────────────────────────────────────────
// ITEM ILLUSTRATIONS
// Bold outlines, flat fills, newspaper cartoon style
// ─────────────────────────────────────────────

function TwillyIcon() {
  // Silk scarf — loose, flowing, signature Hermès orange
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      {/* Main scarf body — flowing diagonal */}
      <path d="M8 14 Q14 8 20 12 Q28 18 26 26 Q24 34 32 38 Q40 42 44 36"
            stroke="#1a1a1a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {/* Scarf width — second edge */}
      <path d="M14 10 Q20 6 26 10 Q34 16 32 24 Q30 32 38 36 Q44 40 46 34"
            stroke="#1a1a1a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {/* Fill between edges */}
      <path d="M8 14 Q14 8 20 12 Q28 18 26 26 Q24 34 32 38 Q40 42 44 36
               L46 34 Q44 40 38 36 Q30 32 32 24 Q34 16 26 10 Q20 6 14 10 Z"
            fill="#e8601c" opacity="0.9" />
      {/* Scarf print — tiny repeating marks */}
      <path d="M16 14 L18 16" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.5" />
      <path d="M22 18 L24 20" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.5" />
      <path d="M20 24 L22 26" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.5" />
      <path d="M28 30 L30 32" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.5" />
      <path d="M34 34 L36 36" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.5" />
      {/* Fringe at one end */}
      <line x1="42" y1="36" x2="44" y2="40" stroke="#1a1a1a" strokeWidth="1" />
      <line x1="44" y1="35" x2="47" y2="38" stroke="#1a1a1a" strokeWidth="1" />
      <line x1="46" y1="33" x2="49" y2="36" stroke="#1a1a1a" strokeWidth="1" />
    </svg>
  );
}

function BraceletIcon() {
  // Elegant enamel cuff bracelet — gold with enamel detail
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      {/* Cuff outer */}
      <path d="M10 20 Q10 10 26 10 Q42 10 42 20 L42 32 Q42 42 26 42 Q10 42 10 32 Z"
            fill="#b8a06a" stroke="#1a1a1a" strokeWidth="2" />
      {/* Cuff inner cutout */}
      <path d="M16 22 Q16 16 26 16 Q36 16 36 22 L36 30 Q36 36 26 36 Q16 36 16 30 Z"
            fill="#f5f0e8" stroke="#1a1a1a" strokeWidth="1.2" />
      {/* Enamel stripe — orange, signature */}
      <path d="M10 24 L42 24" stroke="#e8601c" strokeWidth="3.5" />
      <path d="M10 28 L42 28" stroke="#e8601c" strokeWidth="3.5" />
      {/* H hardware detail */}
      <text x="26" y="29" textAnchor="middle" fill="#1a1a1a"
            fontSize="8" fontFamily="Georgia, serif" fontWeight="bold">H</text>
      {/* Shine highlight */}
      <path d="M14 18 Q20 14 28 15" stroke="white" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
    </svg>
  );
}

function ShoesIcon() {
  // Classic Hermès pump — pointed toe, block heel
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      {/* Heel */}
      <rect x="34" y="34" width="7" height="12" rx="1"
            fill="#2a2a2a" stroke="#1a1a1a" strokeWidth="1.5" />
      {/* Sole */}
      <path d="M6 44 Q8 46 36 46 L41 46 Q44 46 44 44 L37 44 Q36 46 34 46 Q8 46 6 44 Z"
            fill="#1a1a1a" />
      {/* Upper — shoe body */}
      <path d="M6 44 Q6 38 14 34 Q22 30 32 32 Q36 32 37 34 L34 34 Q28 32 18 36 Q10 40 8 44 Z"
            fill="#2a2a2a" stroke="#1a1a1a" strokeWidth="1.8" />
      {/* Pointed toe */}
      <path d="M6 44 Q2 42 4 40 Q6 38 14 34" fill="#2a2a2a" stroke="#1a1a1a" strokeWidth="1.5" />
      {/* Vamp opening */}
      <path d="M16 36 Q22 30 32 32" stroke="#3a3a3a" strokeWidth="1.2" fill="none" />
      {/* Shine */}
      <path d="M10 41 Q16 37 24 36" stroke="white" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
    </svg>
  );
}

function KellyBeltIcon() {
  // Slim leather belt with iconic H buckle
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      {/* Belt strap */}
      <rect x="2" y="22" width="48" height="8" rx="2"
            fill="#2a2a2a" stroke="#1a1a1a" strokeWidth="1.8" />
      {/* H Buckle — center */}
      <rect x="20" y="18" width="12" height="16" rx="1"
            fill="#b8a06a" stroke="#1a1a1a" strokeWidth="1.8" />
      {/* H shape cutout in buckle */}
      <rect x="22" y="20" width="2.5" height="12" fill="#1a1a1a" opacity="0.3" />
      <rect x="27.5" y="20" width="2.5" height="12" fill="#1a1a1a" opacity="0.3" />
      <rect x="22" y="25" width="8" height="2" fill="#1a1a1a" opacity="0.3" />
      {/* Belt holes */}
      <circle cx="38" cy="26" r="1.2" fill="#1a1a1a" opacity="0.6" />
      <circle cx="42" cy="26" r="1.2" fill="#1a1a1a" opacity="0.6" />
      <circle cx="46" cy="26" r="1.2" fill="#1a1a1a" opacity="0.6" />
      {/* Stitching detail */}
      <path d="M2 23 L20 23" stroke="#3a3a3a" strokeWidth="0.6" strokeDasharray="2 2" />
      <path d="M32 23 L50 23" stroke="#3a3a3a" strokeWidth="0.6" strokeDasharray="2 2" />
    </svg>
  );
}

function BirkinIcon() {
  // THE Birkin — trapezoidal silhouette, flap, lock, handles
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      {/* Bag body — trapezoid */}
      <path d="M6 48 L6 22 Q6 18 10 18 L42 18 Q46 18 46 22 L46 48 Z"
            fill="#e8601c" stroke="#1a1a1a" strokeWidth="2.2" />
      {/* Flap — folds over top */}
      <path d="M6 22 Q6 14 10 12 L42 12 Q46 14 46 22"
            fill="#d4561a" stroke="#1a1a1a" strokeWidth="2" />
      {/* Bottom gusset */}
      <rect x="6" y="44" width="40" height="4" rx="1"
            fill="#c44c16" stroke="#1a1a1a" strokeWidth="1.5" />
      {/* Handles — paired */}
      <path d="M16 18 Q14 10 18 8 Q20 7 22 8 Q24 10 22 18"
            stroke="#1a1a1a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M30 18 Q28 10 30 8 Q32 7 34 8 Q36 10 36 18"
            stroke="#1a1a1a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {/* Turnlock clasp — center */}
      <rect x="22" y="20" width="8" height="6" rx="1"
            fill="#b8a06a" stroke="#1a1a1a" strokeWidth="1.5" />
      <rect x="24.5" y="22" width="3" height="2" rx="0.5" fill="#1a1a1a" opacity="0.4" />
      {/* Strap — short closure */}
      <rect x="23" y="14" width="6" height="8" rx="1"
            fill="#d4561a" stroke="#1a1a1a" strokeWidth="1.2" />
      {/* Side feet */}
      <circle cx="10" cy="48" r="1.5" fill="#b8a06a" stroke="#1a1a1a" strokeWidth="1" />
      <circle cx="42" cy="48" r="1.5" fill="#b8a06a" stroke="#1a1a1a" strokeWidth="1" />
      {/* Shine */}
      <path d="M10 26 Q14 22 20 22" stroke="white" strokeWidth="1.5" opacity="0.35" strokeLinecap="round" />
    </svg>
  );
}

function KellyIcon() {
  // The Kelly — more structured, rigid trapezoid with fold-over flap and single handle
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      {/* Bag body — more square than Birkin */}
      <rect x="7" y="22" width="38" height="26" rx="2"
            fill="#2a2a2a" stroke="#1a1a1a" strokeWidth="2.2" />
      {/* Flap — structured fold-over */}
      <path d="M7 22 L7 14 Q7 10 12 10 L40 10 Q45 10 45 14 L45 22"
            fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="2" />
      {/* Flap curved bottom edge */}
      <path d="M7 22 Q26 28 45 22" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="1" />
      {/* Single top handle — the Kelly's signature */}
      <path d="M18 22 Q18 12 26 10 Q34 12 34 22"
            stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Turnlock clasp */}
      <ellipse cx="26" cy="24" rx="5" ry="4"
               fill="#b8a06a" stroke="#1a1a1a" strokeWidth="1.8" />
      <ellipse cx="26" cy="24" rx="2" ry="1.5"
               fill="#1a1a1a" opacity="0.4" />
      {/* Strap */}
      <rect x="23" y="14" width="6" height="10" rx="1"
            fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="1" />
      {/* Corner hardware */}
      <circle cx="10" cy="46" r="2" fill="#b8a06a" stroke="#1a1a1a" strokeWidth="1" />
      <circle cx="42" cy="46" r="2" fill="#b8a06a" stroke="#1a1a1a" strokeWidth="1" />
      <circle cx="10" cy="24" r="2" fill="#b8a06a" stroke="#1a1a1a" strokeWidth="1" />
      <circle cx="42" cy="24" r="2" fill="#b8a06a" stroke="#1a1a1a" strokeWidth="1" />
      {/* Stitching */}
      <rect x="10" y="25" width="32" height="20" rx="1"
            fill="none" stroke="#3a3a3a" strokeWidth="0.8" strokeDasharray="2 2" />
      {/* Shine */}
      <path d="M11 28 Q16 24 22 25" stroke="white" strokeWidth="1.2" opacity="0.3" strokeLinecap="round" />
    </svg>
  );
}

function ConstanceIcon() {
  // The Constance — compact crossbody, the iconic H clasp front and center
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      {/* Bag body — compact square */}
      <rect x="10" y="18" width="32" height="28" rx="3"
            fill="#8b6914" stroke="#1a1a1a" strokeWidth="2.2" />
      {/* Shoulder strap — long, thin */}
      <path d="M10 24 Q4 18 6 10 Q8 4 14 6 Q18 8 16 16"
            stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Flap — top half of bag face */}
      <rect x="10" y="18" width="32" height="16" rx="3"
            fill="#7a5c10" stroke="#1a1a1a" strokeWidth="1.5" />
      {/* THE H CLASP — signature, front center, prominent */}
      <rect x="20" y="29" width="12" height="10" rx="1"
            fill="#b8a06a" stroke="#1a1a1a" strokeWidth="2" />
      {/* H shape */}
      <rect x="21.5" y="30.5" width="2.5" height="7" fill="#1a1a1a" />
      <rect x="28" y="30.5" width="2.5" height="7" fill="#1a1a1a" />
      <rect x="21.5" y="33.5" width="9" height="2" fill="#1a1a1a" />
      {/* Gusset sides */}
      <line x1="10" y1="34" x2="10" y2="46" stroke="#6a4e0e" strokeWidth="1.5" />
      <line x1="42" y1="34" x2="42" y2="46" stroke="#6a4e0e" strokeWidth="1.5" />
      {/* Shine */}
      <path d="M13 22 Q18 20 24 21" stroke="white" strokeWidth="1.2" opacity="0.35" strokeLinecap="round" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// ITEM CONFIG — slot order, icons, empty state
// ─────────────────────────────────────────────

const SHELF_ITEMS = [
  // Accessories (always available)
  { id: 'twilly',        Icon: TwillyIcon,    label: 'Twilly',         bg: '#fff3ed' },
  { id: 'bracelet',      Icon: BraceletIcon,  label: 'Bracelet',       bg: '#fdf9f0' },
  { id: 'shoes',         Icon: ShoesIcon,     label: 'Shoes',          bg: '#f8f7f5' },
  { id: 'kellyBelt',     Icon: KellyBeltIcon, label: 'Kelly Belt',     bg: '#fdf9f0' },
  // Chapter 0 bags
  { id: 'constance24',   Icon: ConstanceIcon, label: 'Constance 24',   bg: '#fdf9f0' },
  { id: 'constanceMini', Icon: ConstanceIcon, label: 'Constance Mini', bg: '#fdf9f0', mini: true },
  // Chapter 1 bags
  { id: 'kelly28',       Icon: KellyIcon,     label: 'Kelly 28',       bg: '#f5f0e8' },
  { id: 'kelly25',       Icon: KellyIcon,     label: 'Kelly 25',       bg: '#f5f0e8', mini: true },
  // Chapter 2 bags
  { id: 'birkin30',      Icon: BirkinIcon,    label: 'Birkin 30',      bg: '#fff3ed' },
  { id: 'birkin25',      Icon: BirkinIcon,    label: 'Birkin 25',      bg: '#fff3ed', mini: true },
];

// ─────────────────────────────────────────────
// SHELF COMPONENT
// ─────────────────────────────────────────────

export default function ShelfInventory({ inventory, lastAcquired }) {
  return (
    <div className="shelf-wrapper">
      <div className="shelf-label">Your Acquisitions</div>

      {/* The shelf surface */}
      <div className="shelf-surface">
        {/* Shelf plank SVG background */}
        <svg className="shelf-plank" viewBox="0 0 100 8" preserveAspectRatio="none">
          <rect x="0" y="0" width="100" height="8" fill="#c4a882" />
          <rect x="0" y="0" width="100" height="2" fill="#d4b896" opacity="0.7" />
          <line x1="0" y1="6" x2="100" y2="6" stroke="#b09070" strokeWidth="0.5" />
        </svg>

        {/* Item slots */}
        <div className="shelf-items">
          {SHELF_ITEMS.map((item) => {
            const { id, Icon, label, bg } = item;
            const owned   = inventory.includes(id);
            const isNew   = id === lastAcquired;
            return (
              <div
                key={id}
                className={`shelf-slot${owned ? ' shelf-slot--owned' : ' shelf-slot--empty'}${isNew ? ' shelf-slot--new' : ''}`}
                style={owned ? { background: bg } : {}}
                title={owned ? label : ''}
              >
                {owned ? (
                  <>
                    <div className="shelf-item-icon" style={item.mini ? { transform: 'scale(0.75)' } : {}}>
                      <Icon />
                    </div>
                    <div className="shelf-item-label">
                      {label}
                      {item.mini && <span className="shelf-item-mini-tag">mini</span>}
                    </div>
                  </>
                ) : (
                  <div className="shelf-slot-empty-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <rect x="3" y="3" width="14" height="14" rx="2"
                            stroke="#d4cfc6" strokeWidth="1.5" fill="none" strokeDasharray="3 2" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
