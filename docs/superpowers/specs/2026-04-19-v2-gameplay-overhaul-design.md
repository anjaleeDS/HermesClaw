# HermesClaw V2 — Gameplay Overhaul Design Spec
**Date:** 2026-04-19  
**Status:** Approved — ready for implementation

---

## Overview

Six interconnected changes to improve game economy, continuity, dialogue depth, inventory display, and asset wiring. One new item (Silk Scarf). No new external dependencies.

---

## 1. Starting Money → $10,000

**Change:** `createInitialState()` in `src/gameLogic.js` — `money: 5000` → `money: 10000`

**Rationale:** $5k made it nearly impossible to afford the cheapest everyday bag ($2,425) after building favor through purchases. $10k preserves spending tension without the hard wall.

**No other changes needed.** Score, prices, and all other logic remain the same.

---

## 2. Image Assets — Source Location Fix

**Problem:** New photos were placed in `dist/assets/` which is the Vite build output directory. It gets wiped on every `npm run build`. Source images must live in `src/assets/`.

**Action:** Copy all new photos from `dist/assets/` into `src/assets/`:
- `belt.png` → Kelly Belt
- `bracelet.png` → Bracelet
- `scarf.png` → Silk Scarf (new item)
- `shoe.png` → Shoes (**rename from `shoe].png`** — the `]` is a typo)
- `twilly.png` → Twilly

The three existing quota bag sprite sheets already live in `src/assets/` correctly:
- `constances.png` (sprite sheet, 3×2 colorways)
- `kellys.png` (sprite sheet, 3×2 colorways)
- `birkins.png` (sprite sheet, 3×2 colorways)

**Everyday bags** (Evelyne, Picotin, Garden Party, Bolide, Roulis, Lindy 26) have no photos yet — they will continue showing text-only on acquisition until photos are supplied.

---

## 3. New Item — Silk Scarf (Carré H)

Added to `src/gameData.js` in the accessories section.

```js
scarfCarre: {
  id: 'scarfCarre',
  name: 'Carré H',
  description: 'Ninety centimetres of intention.',
  score: 125,
  effect: 'wardrobeDepth',
}
```

**Effect — `wardrobeDepth`:** When the player owns the Carré H, `outfitChat` dialogue pool has double the lines available (adds a second, more specific layer of outfit conversation). Also grants +1 favor on the first `chat` action each run.

**Acquisition:** Drops from `buySmall` (joins the pool alongside Twilly and Bracelet). Drop order becomes: Twilly → Carré H → Bracelet. Scarf fills the gap between the two existing small-buy items.

**Photo:** `src/assets/scarf.png` — displayed in ResultMoment on acquisition (same component as accessories).

---

## 4. Accessory Photos in ResultMoment

Currently `ResultMoment.jsx` shows a photo only for quota bags (`BAG_IDS` set). Accessories show text-only.

**Change:** Expand `BagPhoto.jsx` (or create `ItemPhoto.jsx`) to handle single-image accessories alongside the existing sprite-sheet bags.

### Component: `ItemPhoto.jsx` (replaces/extends `BagPhoto.jsx`)

```
src/components/ItemPhoto.jsx
```

Two render modes:
1. **Sprite sheet** (quota bags) — existing behavior, background-position crop from 3×2 grid
2. **Single image** (accessories) — straightforward `<img>` or background-image, full frame

```js
// Sprite sheets (existing)
const SPRITE_SHEETS = {
  constance24: constancesUrl, constanceMini: constancesUrl,
  kelly28: kellysUrl, kelly25: kellysUrl,
  birkin30: birkinsUrl, birkin25: birkinsUrl,
};

// Single photos (accessories + new items)
const SINGLE_PHOTOS = {
  twilly:     twillyUrl,
  bracelet:   braceletUrl,
  shoes:      shoeUrl,
  kellyBelt:  beltUrl,
  scarfCarre: scarfUrl,
};
```

**ResultMoment.jsx update:** Replace `BAG_IDS` gate with `hasPhoto(itemId)` check that covers both sprite-sheet bags and single-photo accessories. All items with a photo get the `bag-photo-wrap` treatment.

---

## 5. Shelf Inventory — Show Only Owned Items

**File:** `src/components/ShelfInventory.jsx`

**Current behavior:** Renders 10 fixed slots (4 accessory + 3 bag + 3 mini), most empty at game start.

**New behavior:** Render only items in `inventory` array, in acquisition order. No empty slots.

**Empty state:** When `inventory.length === 0`, show a single centered line:
> *"Nothing yet. That changes."*

**No changes to CSS class structure needed** — just map over `inventory` instead of `SHELF_ITEMS`. Each item renders its name, description, and score value.

---

## 6. Expanded NPC Dialogue Pools

All new pools added to `NPC_DIALOGUE` in `src/gameData.js`.

### `afterBuySmall`
Replaces generic `afterBuy` for $500 boutique purchases.
```
'Subtle. I appreciate that.'
'Small things reveal everything.'
'Not everyone starts here. I noticed.'
'A considered choice.'
'It suits you. I can tell already.'
'The details are always where it begins.'
```

### `afterBuyMedium`
Replaces generic `afterBuy` for $1,500 boutique purchases.
```
'Now we\'re speaking the same language.'
'You understand commitment.'
'I had a feeling about you.'
'Yes. That\'s exactly right.'
'That\'s more like it.'
'This is how a relationship begins.'
```

### `outfitChat`
Triggered when player uses "Ask About a Bag" on a new third option: **"Discuss an Outfit"** (replaces or supplements existing Ask). Available from turn 1, no suspicion cost, +1 favor if player owns ≥1 accessory.
```
'What you\'re describing — structured, but not stiff. That\'s very Constance.'
'For something everyday, I\'d think Evelyne. You seem like someone who moves.'
'The Kelly reads formal, but she\'s surprisingly versatile. What\'s the occasion?'
'If you\'re building a wardrobe around it — start with the scarf. Everything else follows.'
'For travel? The Lindy. For arrival? The Kelly.'
'You want people to notice, or you want them to wonder? Those are different bags.'
'A Birkin is never casual. If you need casual, I have something else in mind.'
'What you wear with it matters as much as the bag itself. What are we working with?'
'The belt anchors everything. Once you have that, the bag becomes obvious.'
'I always ask: is it for you, or is it for the room? The answer changes everything.'
'There\'s a version of this that\'s very quiet. And a version that announces itself. Which are you?'
'If you\'re wearing the scarf, the bag almost doesn\'t matter. Almost.'
```

### `complimentReturn`
Used when player selects "Compliment Her Taste" (existing action), replacing the hardcoded line.
```
'I\'ve been doing this long enough to trust my instincts.'
'How kind. Most clients don\'t notice the display arrangement.'
'I was wondering if anyone would say something about that.'
'You\'re very perceptive. I appreciate that.'
'It took us three weeks to find exactly the right piece for that corner.'
'The craft deserves to be noticed. Thank you for seeing it.'
'I don\'t often hear that. It means something, coming from you.'
```

### `suspicionBuilding`
Fires when `suspicion` reaches 3–4 (before full `highSuspicion` at 6). Replaces neutral message.
```
'You seem to have a very specific idea of what you\'re after.'
'I want to make sure I understand what you\'re looking for, exactly.'
'We like to get to know our clients a little first.'
'Some clients find it helpful to come back another time.'
'I\'m just going to — excuse me one moment.'
'We do move carefully here. I hope you understand.'
```

### `itemSynergy`
Triggered in `resolveAction` when player owns ≥2 items **and** this turn's action was `chat`, `compliment`, or `outfitChat`. Overrides the normal post-action message.
```
'The scarf and the belt together — that\'s not an accident. You planned this.'
'I notice you have the Twilly. The Kelly would complete that story.'
'Someone who understands the belt already understands what comes next.'
'The way you wear these things — it\'s consistent. That matters here.'
'Your eye is getting sharper. I\'ve been watching.'
'You know, the bracelet reads differently with what you\'ve chosen. It\'s working.'
'I don\'t say this to everyone — but you\'re building something.'
'That combination is very specific. Very you. I respect that.'
```

### `chapterAware`
Split into `chapterAware_ch1` and `chapterAware_ch2`. Called from `startGame()` as the opening line when chapter ≥ 1 (instead of `postConstance` / `postKelly` which remain as fallbacks).

**ch1:**
```
'You\'ve been here before. I remember.'
'Your Constance is settling in well, I hope?'
'We\'ve come a long way from our first conversation.'
'You\'ve earned a certain kind of conversation.'
'I was hoping you\'d come back.'
```

**ch2:**
```
'This is a different kind of visit.'
'I don\'t have many clients at this level.'
'What you\'re looking for — it\'s not impossible. But it requires everything.'
'We\'re not talking about the same world anymore.'
'I hope you understand what\'s expected of someone in your position.'
```

### Wiring Summary

| Pool | Trigger location | Condition |
|------|-----------------|-----------|
| `afterBuySmall` | `resolveAction` case `buySmall` | replaces `afterBuy` |
| `afterBuyMedium` | `resolveAction` case `buyMedium` | replaces `afterBuy` |
| `outfitChat` | `resolveAction` case `outfitChat` (new action) | new card option |
| `complimentReturn` | `resolveAction` case `compliment` | replaces hardcoded line |
| `suspicionBuilding` | `resolveAction` end of switch | suspicion === 3 or 4 |
| `itemSynergy` | `resolveAction` end of switch | inventory.length ≥ 2 + social action |
| `chapterAware_ch1` | `startGame()` | chapter === 1 |
| `chapterAware_ch2` | `startGame()` | chapter === 2 |

---

## 7. SA Everyday Offer Cap — Max 3 Per Run

**New state field:** `saOfferCount: 0` added to `createInitialState()`.

**Change in `generateCards()`:** Before building the `saOffer` card, check `state.saOfferCount >= 3`. If true, set `offerItemId = null` — no offer card generated.

**Increment:** In `resolveAction`, cases `saOfferBuy` and `saOfferDecline` both increment `saOfferCount` (offer was shown and player responded).

---

## 8. Chapter Continuity — Three Random Paths

After each 10-turn run, chapter advancement is determined by randomly selecting one of three paths. The player never knows which path applies — that uncertainty is part of the game.

### New profile fields (in `src/persistence.js`)
```js
{
  standing: 0,        // Path A: accumulated relationship score (0–30)
  progress: 0,        // Path C: cumulative bag-acquisition counter
  // existing fields unchanged
}
```

### Path A — Relationship Carry (33%)
- **Condition:** Random roll lands in 0–0.33
- **Logic:** `standing += floor(game.favor / 2)`. Standing decays 10% each run. Next run starts with `favor = floor(standing / 4)` (capped at 3).
- **Advance chapter if:** `standing >= 12` AND `won === false` (she decides you're ready without the bag)
- **Message on advance:** *"Something has shifted. She sees you differently now."*

### Path B — Milestone Unlock (33%)
- **Condition:** Random roll lands in 0.33–0.66
- **Logic:** Check if `game.favor >= 6 AND game.inventory` contains ≥ 2 accessories.
- **Advance chapter if:** Both conditions met, regardless of bag acquisition.
- **Message on advance:** *"You didn't get the bag. But she noticed everything else."*

### Path C — Cumulative Progress (33%)
- **Condition:** Random roll lands in 0.66–1.0
- **Logic:** `progress += won ? 2 : hasEverydayBag ? 1 : 0`. Thresholds: ch0→ch1 at progress ≥ 3, ch1→ch2 at progress ≥ 5.
- **Advance chapter if:** Threshold reached.
- **Message on advance:** *"Over time, the door opened. You were patient."*

### Implementation location
`updateProfileAfterRun()` in `src/persistence.js`. Roll the path, apply logic, return updated profile. `EndScreen.jsx` shows the advance message when `profile.chapter > game.chapter`.

### Guard: all three paths
If multiple paths would advance in the same run, still only advance by 1 chapter. Winning the quota bag directly always advances regardless of path roll.

---

## File Change Summary

| File | Change |
|------|--------|
| `src/assets/` | Add: belt.png, bracelet.png, scarf.png, shoe.png, twilly.png |
| `src/gameData.js` | Add `scarfCarre` item; add 8 new NPC_DIALOGUE pools |
| `src/gameLogic.js` | money→10k; saOfferCount cap; suspicionBuilding trigger; itemSynergy trigger; afterBuySmall/Medium split; outfitChat action; complimentReturn pool |
| `src/components/ItemPhoto.jsx` | New component (replaces BagPhoto for all items) |
| `src/components/BagPhoto.jsx` | Deprecate or fold into ItemPhoto |
| `src/components/ResultMoment.jsx` | Use ItemPhoto; show photo for accessories too |
| `src/components/ShelfInventory.jsx` | Render owned items only; empty state text |
| `src/persistence.js` | Add `standing`, `progress` fields; three-path chapter logic in `updateProfileAfterRun` |
| `src/gameLogic.js` | `createInitialState` adds `saOfferCount: 0`; `startGame` uses chapterAware pools |

---

## Out of Scope (V3 backlog)
- Everyday bag photos (Evelyne, Picotin, Garden Party, Bolide, Roulis, Lindy 26)
- Ch.3 / post-Birkin endgame
- Legacy screen (lifetime collection tracker)
- NPC portrait mood refinement
- afterFlip dialogue pool wiring
