# Hermès Claw — Conversation Handoff

**Version at handoff:** 1.0  
**Date:** April 2026  
**Repo:** local git, origin/main, single commit history

This document is for a new Claude conversation picking up the project. Read this before touching any code.

---

## What Has Been Built

A complete, playable browser card game. 10-turn social strategy, hidden meters, NPC memory, three-chapter bag progression. Build is clean (`npm run build` passes with no errors or warnings).

### What works right now
- Full game loop: intro → 10 turns → end screen, fully playable
- Hidden favor/suspicion system driving NPC mood and offer probability
- Hidden combo system (3 combos: buy/buy/chat, wait/chat/buy, chat/chat/chat)
- Passive item bonuses (4 accessories, combinable)
- Chapter progression: Constance 24 (Ch0) → Kelly 28 (Ch1) → Birkin 30 (Ch2)
- Mini-bag variants (Constance Mini, Kelly 25, Birkin 25) as ultra-rare Lucky Moment drops
- localStorage persistence: NPC remembers run count, best score, current chapter
- Returning-player intro screen with her opening line + stats
- End screen: score, verdict, chapter unlock banner, cryptic strategy nudge
- Three SVG NPC portraits switching by chapter (man → woman → androgynous)
- Drawn shelf with 10 SVG item slots (4 accessories + 3 regular bags + 3 minis)
- Full NPC dialogue: 15 pools (neutral, warm, cold, afterBuy, afterAsk, afterChat, afterWait, comboHint, highSuspicion, returningClient, loyalClient, postConstance, postKelly, afterFlip, coldShoulder variants)

---

## File Map (what each file does)

```
src/App.jsx                — shell. Phase routing. Profile state. handleRestart saves profile.
src/gameLogic.js           — ALL game rules. Pure functions. Start here.
src/gameData.js            — ITEMS object, NPC_DIALOGUE pools, CARD_TEMPLATES weights
src/persistence.js         — localStorage. loadProfile, saveProfile, updateProfileAfterRun,
                             CHAPTER_TARGETS, CHAPTER_NAMES
src/index.css              — CSS variables (--cream, --gold, etc), body, .game-shell layout
src/components/
  AssociatePortrait.jsx    — 3 SVG portrait components. Props: mood, chapter.
  CardRow.jsx              — renders game.currentCards as 3 clickable cards
  EndScreen.jsx            — score, verdict, chapter unlock, nudge, items list
  GameHeader.jsx           — money / title + chapter target / turn. Imports CHAPTER_NAMES.
  IntroScreen.jsx          — first visit (rules) + returning player (her line + stats)
  NPCDialogue.jsx          — NPC speech bubble + mood tag + AssociatePortrait
  ResultMoment.jsx         — post-action result. Shows NPC message, delta, new item. Must press Continue.
  ShelfInventory.jsx       — drawn shelf. SHELF_ITEMS array with 10 slots. SVG icons inline.
  components.css           — all component CSS
```

---

## Key Data Structures

### Game state (all in App.jsx useState)
```js
{
  phase: 'intro' | 'playing' | 'result' | 'end',
  turn: 1–11,           // increments after each action
  money: 5000,
  inventory: [],         // item IDs acquired this run
  lastActions: [],       // rolling last 3 action strings (for combos)
  favor: 0–10,           // hidden
  suspicion: 0–10,       // hidden
  npcMood: 'warm' | 'neutral' | 'cold',
  rareChanceBonus: 0–1,  // set by combos
  currentCards: [],      // 3 card objects for this turn
  pendingCards: [],       // pre-generated for next turn
  lastNPCMessage: '',
  actionSummary: { moneyDelta, newItem } | null,
  chapter: 0 | 1 | 2,   // drives ask thresholds, scoring, NPC portrait
  runCount: number,       // from profile, drives NPC opening dialogue
}
```

### Player profile (localStorage)
```js
{
  runCount: 0,
  bestScore: 0,
  chapter: 0,            // 0=Constance, 1=Kelly, 2=Birkin
  totalWins: 0,
  everFlipped: false,
  askedEarlyCount: 0,
}
```

### Item IDs (canonical)
```
Accessories: twilly, bracelet, shoes, kellyBelt
Ch0 bags:    constance24, constanceMini
Ch1 bags:    kelly28, kelly25
Ch2 bags:    birkin30, birkin25
```

### Chapter targets
```js
CHAPTER_TARGETS = { 0: 'constance24', 1: 'kelly28', 2: 'birkin30' }
// Mini drops (Lucky Moment only):
['constanceMini', 'kelly25', 'birkin25'][chapter]
```

---

## Known Issues / Intentional Gaps

### afterFlip dialogue is wired but unused
`NPC_DIALOGUE.afterFlip` pool exists in gameData.js. The `flip` case in gameLogic.js uses a hardcoded string (`'The transaction is clean. She clocked it.'`) instead of `pickDialogue('afterFlip', s.npcMood)`. This is a known inconsistency. Fix: replace the hardcoded string with the pickDialogue call.

### returningClient / loyalClient / postConstance / postKelly pools exist but aren't wired
These NPC_DIALOGUE pools are defined but never called from gameLogic.js. They were planned for `startGame()` — the idea is the NPC's *first line of the run* should come from these pools based on runCount and chapter. Right now `startGame()` always says `'Good afternoon. Welcome.'`.

**How to wire it:**
```js
// In startGame(), replace the hardcoded opening line with:
function getOpeningPool(runCount, chapter) {
  if (chapter === 2) return 'postKelly';
  if (chapter === 1) return 'postConstance';
  if (runCount >= 5) return 'loyalClient';
  if (runCount >= 1) return 'returningClient';
  return null; // first ever visit
}
const pool = getOpeningPool(s.runCount, s.chapter);
s.lastNPCMessage = pool
  ? pickDialogue(pool, s.npcMood)
  : 'Good afternoon. Welcome.';
```

### Bag icon illustrations are rough
User feedback: the SVG bag icons in ShelfInventory.jsx are recognizable in silhouette to someone who knows the bags, but feel "too rough" and "not like Balatro." The intent is Marmaduke-style cartoon illustrations — bold outlines, flat fills. The icons exist and work; they just need a redraw pass. The 3 bag icons to prioritize: ConstanceIcon, KellyIcon, BirkinIcon.

### No Ch.3 after Birkin
Winning Ch.2 shows a final "You understand us completely" verdict with no unlock. Whether there should be a post-game state (meta-victory, legacy screen, something else) is unresolved.

### Money always resets to $5,000
Whether money should carry between chapters is unresolved. Currently always resets.

---

## Immediate Next Tasks (V2)

Priority order based on user feedback:

1. **Wire startGame() opening line to returningClient / loyalClient / postConstance / postKelly pools** — this makes the "she remembers you" feeling actually work in-game, not just on the intro screen. Code is above.

2. **Fix afterFlip dialogue** — one-line fix in gameLogic.js `flip` case.

3. **Redraw bag icons as clean silhouettes** — ConstanceIcon, KellyIcon, BirkinIcon in ShelfInventory.jsx. Keep same SVG structure, improve paths to read as iconic shapes.

4. **Resolve V2 questions with user:**
   - Does money carry between chapters?
   - Is there a Ch.3 / post-Birkin state?
   - Legacy screen for all-time bag collection?

5. **NPC portrait mood expressiveness** — the warm/neutral/cold variants already work via SVG path props in AssociatePortrait.jsx. The female portrait (Ch.1) and androgynous portrait (Ch.2) could use more distinctive mouth shapes.

---

## How the Game Loop Works (for quick orientation)

1. `createInitialState(profile)` sets up state with chapter + runCount from profile
2. `startGame(state)` → phase = 'playing', generates first 3 cards, sets opening NPC line
3. Player picks a card option → `resolveAction(state, cardId, action)`
   - Updates favor, suspicion, money, inventory
   - Calls `checkCombos(lastActions)` → applies rareBonus, favorBurst, suspicionDrop
   - Updates npcMood via `updateMood(favor, suspicion)`
   - Increments turn, sets phase = 'result', pre-generates next turn's cards
4. Player presses Continue → `advanceTurn(state)` → phase = 'playing', swaps in pendingCards
5. After turn 10, action sets phase = 'end' directly (skips result)
6. EndScreen shows → player clicks restart → `handleRestart()` in App.jsx:
   - `calculateScore(game)` → score
   - `updateProfileAfterRun(profile, game, score)` → updates chapter if won
   - `saveProfile(updated)` → localStorage
   - `createInitialState(updated)` → new game at new chapter

---

## Running Locally

```bash
cd "path/to/HermesClaw"
npm install
npm run dev
# → http://localhost:5173

npm run build   # production build to dist/
```

No environment variables. No API keys. No backend. Fully self-contained.
