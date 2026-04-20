# Hermès Claw — Conversation Handoff

**Version at handoff:** Pre-V2 (V2 spec + plan written, implementation not started)
**Date:** April 2026
**Repo:** local git, origin/main

This document is for a new Claude conversation picking up the project. Read this before touching any code.

---

## Where We Left Off

The V2 gameplay overhaul is fully designed and planned — ready to implement.

- **Spec:** `docs/superpowers/specs/2026-04-19-v2-gameplay-overhaul-design.md`
- **Plan:** `docs/superpowers/plans/2026-04-19-v2-gameplay-overhaul.md`

The plan is task-by-task with TDD steps, exact code snippets, and commit messages. Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to run it.

**V2 changes in scope (none implemented yet):**
1. Starting money → $10,000
2. Image assets moved from `dist/` to `src/assets/` (belt, bracelet, scarf, shoe, twilly)
3. Accessory photos displayed in ResultMoment (currently bags only)
4. Shelf shows only owned items (currently shows all 10 empty slots)
5. SA everyday offer cap — max 3 per run
6. Three-path chapter continuity (Path A/B/C — player can advance without winning)

**Already done as part of V2 prep (committed):**
- `scarfCarre` item added to `gameData.js`
- 8 new NPC dialogue pools added (`afterBuySmall`, `afterBuyMedium`, `outfitChat`, `complimentReturn`, `suspicionBuilding`, `itemSynergy`, `chapterAware_ch1`, `chapterAware_ch2`)
- `outfitChat` action added to `talkToAssociate` card options

---

## What Has Been Built

A complete, playable browser card game. 10-turn social strategy, hidden meters, NPC memory, three-chapter bag progression.

### What works right now

- Full game loop: intro → 10 turns → end screen, fully playable
- Hidden favor/suspicion system driving NPC mood and offer probability
- Hidden combo system (3 combos: buy→buy→chat, wait→chat→buy, chat→chat→chat)
- Passive item bonuses (5 accessories: Twilly, Carré H scarf, Bracelet, Shoes, Kelly Belt)
- Chapter progression: Constance 24 (Ch0) → Kelly 28 (Ch1) → Birkin 30 (Ch2)
- Mini-bag variants (Constance Mini, Kelly 25, Birkin 25) as ultra-rare Lucky Moment drops
- Everyday bags: SA offers Evelyne, Picotin, Garden Party, Bolide 1923 Mini, Roulis Mini, Lindy 26 at favor ≥ 4
- localStorage persistence: NPC remembers run count, best score, current chapter
- Returning-player intro screen with her opening line + stats
- Opening dialogue wired to returningClient / loyalClient / postConstance / postKelly pools
- End screen: score, verdict, chapter unlock banner, cryptic strategy nudge
- Three SVG NPC portraits switching by chapter (man → woman → androgynous)
- Drawn shelf with 10 SVG item slots (rendered, but pre-V2 all slots show even when empty)
- Full NPC dialogue: 23 pools total (original 15 + 8 new V2 pools)
- Bag photos: Constance, Kelly, Birkin shown on acquisition as 3×2 sprite sheet colorways
- "Discuss an Outfit" (`outfitChat`) card option on talkToAssociate card
- Vitest unit test suite: see `src/__tests__/` (gameLogic, persistence, gameData + fixtures)

---

## File Map

```
src/App.jsx                — shell. Phase routing. Profile state. handleRestart saves profile.
src/gameLogic.js           — ALL game rules. Pure functions. Start here.
src/gameData.js            — ITEMS object, NPC_DIALOGUE pools, CARD_TEMPLATES weights
src/persistence.js         — localStorage. loadProfile, saveProfile, updateProfileAfterRun,
                             CHAPTER_TARGETS, CHAPTER_NAMES
src/archetypes.js          — 6 hidden run archetypes (not yet wired in)
src/index.css              — CSS variables (--cream, --gold, etc), body, .game-shell layout
src/components/
  AssociatePortrait.jsx    — 3 SVG portrait components. Props: mood, chapter.
  BagPhoto.jsx             — sprite-sheet crop component (bags only — V2 replaces with ItemPhoto)
  CardRow.jsx              — renders game.currentCards as 3 clickable cards
  CardIllustration.jsx     — SVG illustration per card type
  EndScreen.jsx            — score, verdict, chapter unlock, nudge, items list
  GameHeader.jsx           — money / title + chapter target / turn. Imports CHAPTER_NAMES.
  IntroScreen.jsx          — first visit (rules) + returning player (her line + stats)
  NPCDialogue.jsx          — NPC speech bubble + mood tag + AssociatePortrait
  ResultMoment.jsx         — post-action result. Shows NPC message, delta, new item.
  ShelfInventory.jsx       — drawn shelf. SHELF_ITEMS array with 10 slots. SVG icons inline.
  components.css           — all component CSS
src/__tests__/
  gameLogic.test.js        — core game mechanics (45+ tests)
  persistence.test.js      — profile saving & persistence (8+ tests)
  gameData.test.js         — data validation & structure (14+ tests)
  fixtures.js              — reusable test helpers (createMockState, highFavorState, etc.)
```

---

## Key Data Structures

### Game state (all in App.jsx useState)
```js
{
  phase: 'intro' | 'playing' | 'result' | 'end',
  turn: 1–11,
  money: 5000,               // V2 changes to 10000
  inventory: [],
  lastActions: [],           // rolling last 3 action strings (for combos)
  hasAsked: false,
  hasFlipped: false,
  favor: 0–10,               // hidden
  suspicion: 0–10,           // hidden
  npcMood: 'warm' | 'neutral' | 'cold',
  rareChanceBonus: 0–1,
  currentCards: [],
  pendingCards: [],
  currentOffer: null,        // everyday bag ID offered this turn
  pendingOffer: null,
  lastNPCMessage: '',
  actionSummary: { moneyDelta, newItem } | null,
  chapter: 0 | 1 | 2,
  runCount: number,
}
// saOfferCount: 0 — added in V2 (not in state yet)
```

### Player profile (localStorage)
```js
{
  runCount: 0,
  bestScore: 0,
  chapter: 0,
  totalWins: 0,
  everFlipped: false,
  askedEarlyCount: 0,
  // V2 adds: standing: 0, progress: 0
}
```

### Item IDs (canonical)
```
Accessories: twilly, scarfCarre, bracelet, shoes, kellyBelt
Ch0 bags:    constance24, constanceMini
Ch1 bags:    kelly28, kelly25
Ch2 bags:    birkin30, birkin25
Everyday:    evelyneTpm, picotin18, gardenParty, bolide, roulis, lindy26
```

### Chapter targets
```js
CHAPTER_TARGETS = { 0: 'constance24', 1: 'kelly28', 2: 'birkin30' }
// Mini drops (Lucky Moment only):
['constanceMini', 'kelly25', 'birkin25'][chapter]
```

---

## Known Issues / Intentional Gaps

### Image assets in wrong directory
New accessory photos (`belt.png`, `bracelet.png`, `scarf.png`, `shoe.png`, `twilly.png`) are currently in `dist/assets/` — the Vite build output, which is wiped on `npm run build`. They must be moved to `src/assets/`. This is Step 2 of the V2 plan.

### Accessory photos not shown on acquisition
`ResultMoment.jsx` only shows photos for quota bags (`constance24`, `kelly28`, etc.). Accessories acquired during a run show text-only. V2 plan Task 4-5 fixes this with a new `ItemPhoto.jsx` component.

### Shelf shows all 10 slots, most empty
`ShelfInventory.jsx` renders 10 fixed slots regardless of what the player owns. V2 plan Task 6 changes this to owned-items-only rendering.

### afterFlip dialogue is wired but unused
`NPC_DIALOGUE.afterFlip` pool exists. The `flip` case in `gameLogic.js` uses a hardcoded string. Fix: replace with `pickDialogue('afterFlip', s.npcMood)`. Low priority.

### No Ch.3 after Birkin
Ch.2 win shows a final verdict with no unlock. Post-game state (legacy screen, meta-victory) is unresolved. V3 scope.

### Money resets to $5,000
V2 changes this to $10,000. Not yet implemented.

---

## V2 Backlog (already designed — see spec + plan)

All of the following are in the V2 spec (`docs/superpowers/specs/2026-04-19-v2-gameplay-overhaul-design.md`) with a detailed implementation plan (`docs/superpowers/plans/2026-04-19-v2-gameplay-overhaul.md`).

- Starting money → $10,000
- Move accessory image assets to `src/assets/`
- `ItemPhoto.jsx` — unified photo component for bags + accessories
- Accessory photos in `ResultMoment.jsx`
- `ShelfInventory.jsx` — owned-only display with empty state
- SA everyday offer cap (3 per run)
- Three-path chapter continuity (Path A: relationship carry, Path B: milestone unlock, Path C: cumulative progress)

---

## V3 Backlog (undesigned)

- **Hidden archetypes** — `src/archetypes.js` defines 6 run archetypes. Ready to wire into `gameLogic.js`.
- **Ch.3 / post-Birkin endgame** — No further unlock exists. Legacy screen or meta-victory.
- **Legacy screen** — Lifetime collection tracker across all runs.
- **Everyday bag photos** — Evelyne, Picotin, Garden Party, etc. have no photos yet.
- **NPC portrait refinement** — More distinct mouth/brow shapes per mood state.
- **afterFlip dialogue** — Replace hardcoded string with `pickDialogue('afterFlip', ...)`.

---

## How the Game Loop Works

1. `createInitialState(profile)` sets up state with chapter + runCount from profile
2. `startGame(state)` → phase = 'playing', generates first 3 cards, sets opening NPC line
3. Player picks a card option → `resolveAction(state, cardId, action)`
   - Updates favor, suspicion, money, inventory
   - Calls `checkCombos(lastActions)` → applies rareBonus, favorBurst, suspicionDrop
   - Updates npcMood via `updateMood(favor, suspicion)`
   - Increments turn, sets phase = 'result', pre-generates next turn's cards
4. Player presses Continue → `advanceTurn(state)` → phase = 'playing', swaps in pendingCards
5. After turn 10, action sets phase = 'end' directly
6. EndScreen → player clicks restart → `handleRestart()` in App.jsx:
   - `calculateScore(game)` → score
   - `updateProfileAfterRun(profile, game, score)` → updates chapter if won
   - `saveProfile(updated)` → localStorage
   - `createInitialState(updated)` → new game at new chapter

---

## Running Locally

```bash
cd "path/to/HermesClaw"
npm install
npm run dev       # → http://localhost:5173
npm run build     # production build to dist/
npm test          # Vitest watch mode
npm test -- --run # single run
```

No environment variables. No API keys. No backend. Fully self-contained.
