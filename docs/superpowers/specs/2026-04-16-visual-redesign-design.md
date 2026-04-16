# Hermès Claw — Visual Redesign v1.1

**Date:** 2026-04-16
**Scope:** Visual/CSS only. No game logic changes.

---

## Summary

Full visual redesign toward a Balatro-inspired aesthetic while preserving the game's luxury editorial identity. Dark shell, cream cards, Hermès orange accents.

---

## Design Decisions

### 1. Shell Background
- **Old:** `#f5f0e8` cream everywhere
- **New:** `#1c1830` midnight navy for all shell elements (body, header, shelf area, intro screen, end screen)
- Cards remain cream (`#f5f0e8`) — dark shell contrast makes them pop

### 2. Typography
- **Old:** Cormorant Garamond (Google Fonts)
- **New:** Playfair Display (Google Fonts) — higher contrast thin/thick serifs, closer to Hermès Didot

### 3. Card Design
- No geometry changes. Sharp corners stay. Cream background stays.
- Hover state unchanged (charcoal bg, cream text)

### 4. Intro & End Screens
- Full dark background `#1c1830`
- Faint oversized **"H"** ghost behind content via CSS `::before` — `rgba(212,175,106,0.055)`, 380px, Playfair Display
- No cream panel wrapper — text lives directly on dark bg
- End screen score gets subtle gold text-shadow glow
- Intro CTA button: orange `#e8601c` background

### 5. Hermès Orange (`#e8601c`)
Used throughout as the primary accent color:
- NPC warm mood border + tag
- Card highlight action button border
- Chapter target in header
- Chapter unlock banner border + label
- New item glow on shelf (`box-shadow`)
- Intro CTA button

### 6. NPC Mood Colors
| State | Color | Hex |
|---|---|---|
| Warm | Hermès orange | `#e8601c` |
| Neutral | Gold | `#D4AF6A` |
| Cold | Dark red | `#8b2e2e` (unchanged) |

### 7. Bag Icons (SVG Redraw)
- **ConstanceIcon, KellyIcon, BirkinIcon** — cleaner paths, better proportions
- Same approach: 2-tone flat fills, bold outline (`strokeWidth: 2.2`), gold hardware
- Accessory icons unchanged (Twilly, Bracelet, Shoes, KellyBelt)

---

## Files Changed

- `src/index.css` — font import, CSS variables, body background
- `src/components/components.css` — shell colors, mood colors, screen styles
- `src/components/ShelfInventory.jsx` — redrawn bag SVGs

---

## CSS Variable Changes

```css
/* New/changed variables */
--gold:        #D4AF6A;        /* brighter gold */
--orange:      #e8601c;        /* Hermès orange - new */
--shell-bg:    #1c1830;        /* midnight navy - new */
--shell-border:#2e2a48;        /* shell divider - new */
--shell-mid:   #6666aa;        /* muted shell text - new */
--mood-warm:   #e8601c;        /* orange */
--mood-neutral:#D4AF6A;        /* gold */
--mood-cold:   #8b2e2e;        /* unchanged */
--font-serif:  'Playfair Display', Georgia, serif;
```
