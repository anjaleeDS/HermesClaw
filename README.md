# Hermès Claw

> A satirical luxury roguelike. You want a bag. She decides who gets one.

**Version:** 1.0  
**Stack:** Vite + React 18, no backend, no router, no state library  
**Run:** `npm install && npm run dev` → http://localhost:5173

---

## What This Is

Hermès Claw is a 10-turn card game about the social mechanics of luxury retail — specifically the unofficial relationship game required to acquire a Hermès bag. It's satirical but sincere. The NPC remembers you. The rules are hidden. There is a pattern; you'll feel it before you understand it.

Mechanically it sits between Balatro (hidden system mastery, card-based decisions) and a social deduction game (read the NPC, manage invisible meters).

---

## How to Play

1. Each turn you're dealt three cards. Choose one.
2. Over 10 turns, build *favor* (goodwill) and suppress *suspicion* (eagerness).
3. On the right turn, ask about the bag. If you've played well enough, she offers it.
4. Win → next chapter unlocks. The NPC remembers your history.

**Nothing is explained. That's the point.**

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## Game Architecture

### State Machine

```
intro → playing → result → playing → ... → end
```

All state lives in a single `useState` object in `App.jsx`. Every function in `gameLogic.js` is a pure function: `state in → new state out`. No side effects, no context, no Redux.

### Hidden Meters (never shown to player)

| Meter | Range | Effect |
|-------|-------|--------|
| `favor` | 0–10 | Determines NPC mood; gates the ask |
| `suspicion` | 0–10 | Triggers cold shoulder; disqualifies ask |
| `npcMood` | warm/neutral/cold | Affects dialogue pool; derived from favor + suspicion |
| `rareChanceBonus` | 0–1.0 | Added to ask/risk probability by combos |

### Card System

Cards drawn from a weighted pool each turn. Weights shift with game state:
- **Lucky Moment** (`luckyMoment`): weight ↑ with favor, ↓ with suspicion
- **Cold Shoulder** (`coldShoulder`): only appears when suspicion ≥ 4
- **Secondary Market** (`secondaryMarket`): disappears when suspicion ≥ 3

### Hidden Combo System

Last 3 actions tracked in `lastActions[]`. Three combos fire silently:

| Combo | Sequence | Effect |
|-------|----------|--------|
| Good Client Energy | buy → buy → chat | +35% rare chance |
| Patient Admirer | wait → chat → buy | +20% rare chance, +2 favor burst |
| Social Grace | chat → chat → chat | +3 favor burst, −2 suspicion |

When a combo fires, the NPC gives a `comboHint` line — cryptic, never explanatory.

### Passive Item Bonuses

Buying accessories unlocks passive effects that stack silently:
- **Twilly**: wait gives −2 suspicion instead of −1
- **Bracelet**: chat and buy give +1 favor bonus
- **Shoes**: each purchase gives −1 suspicion
- **Kelly Belt**: compliment gives +2 favor instead of +1
- **All four together**: +10% rare chance permanently (`committedClientBonus`)

---

## Chapter Progression

Three chapters, ascending difficulty. Winning a chapter unlocks the next.

| Chapter | Target | Mini Drop | Ask Gate | Extra Rule |
|---------|--------|-----------|----------|------------|
| 0 | Constance 24 | Constance Mini | none | — |
| 1 | Kelly 28 | Kelly 25 | favor ≥ 4 | — |
| 2 | Birkin 30 | Birkin 25 | favor ≥ 7 | no flips this run |

**Regular bags** are won via the `ask` action.  
**Mini bags** are ultra-rare drops from Lucky Moment → `risk` only. The mini is harder to get than the regular bag.

Size variants reflect reality: the smaller, more discreet sizes are the genuinely scarce items.

---

## NPC Memory (localStorage)

A `playerProfile` persists across browser sessions via `src/persistence.js`:

```js
{
  runCount: 0,         // total runs started
  bestScore: 0,        // highest score ever
  chapter: 0,          // current chapter (0/1/2)
  totalWins: 0,        // times any chapter bag acquired
  everFlipped: false,  // used secondary market lifetime
  askedEarlyCount: 0,  // times asked on turn 1–3 lifetime
}
```

The NPC's opening line on IntroScreen changes based on `runCount` and `chapter`:

| Visit | Ch.0 line | Ch.1+ line |
|-------|-----------|------------|
| 1st | *(rules only)* | *(rules only)* |
| 2nd–4th | "Oh. You're back." | "I heard the bag found a good home." |
| 5th+ | "You're back. Again." | "I've been expecting you." |

To reset: clear localStorage key `hermes_claw_profile`.

---

## Scoring

```
score = (itemScore + favorScore − suspicionPenalty) × multiplier
multiplier = won ? 1.5 : 1.0
```

| Item | Points |
|------|--------|
| Twilly | 50 |
| Bracelet | 100 |
| Shoes | 75 |
| Kelly Belt | 200 |
| Constance 24 | 350 |
| Constance Mini | 550 |
| Kelly 28 | 600 |
| Kelly 25 | 850 |
| Birkin 30 | 900 |
| Birkin 25 | 1,400 |
| Each favor point | +20 |
| Each suspicion point | −10 |

---

## File Map

```
src/
├── App.jsx                    — shell, phase routing, profile state
├── gameLogic.js               — all game rules, pure functions
├── gameData.js                — ITEMS, NPC_DIALOGUE, CARD_TEMPLATES
├── persistence.js             — localStorage load/save/update
├── index.css                  — CSS variables, body, game-shell layout
└── components/
    ├── AssociatePortrait.jsx  — 3 SVG NPC portraits (switches by chapter)
    ├── CardRow.jsx            — renders 3 action cards per turn
    ├── EndScreen.jsx          — score, verdict, nudge, chapter unlock
    ├── GameHeader.jsx         — money / title+target / turn counter
    ├── IntroScreen.jsx        — first visit rules + returning player variant
    ├── NPCDialogue.jsx        — NPC speech bubble + mood tag + portrait
    ├── ResultMoment.jsx       — post-action NPC response, press Continue to advance
    ├── ShelfInventory.jsx     — drawn shelf with 10 SVG item slots
    └── components.css         — all component styles
```

---

## NPC Portraits

Three SVG portraits in `AssociatePortrait.jsx`, switching by `chapter` prop:

| Chapter | Character | Description |
|---------|-----------|-------------|
| 0 | The Associate (man) | Slicked hair, stern suit, slim tie |
| 1 | The Associate (woman) | Chignon bun, pearl earrings, Twilly at collar |
| 2 | The Senior Associate | Geometric crop, horizontal brows, square brooch |

Each portrait has warm/neutral/cold mood variants via SVG path changes.

---

## Design Principles

**1 core mechanic, 2 emotional hooks**
1. *Core:* Master a hidden system through pattern recognition — like Balatro but social
2. *Emotional 1:* The NPC remembers you. Returning feels different every time.
3. *Emotional 2:* Winning unlocks a harder version of the same desire — there is no ceiling

**Why the rules are hidden**  
Explaining the mechanics kills the satire. The game *is* the feeling of not knowing the rules but sensing that rules exist. Players who get it feel seen. Players who don't get to feel exactly like someone standing in the boutique for the first time.

**Why the NPC never explains**  
She doesn't say "you asked too early." She says "That particular piece has a process." Every cryptic line is a design decision. You're supposed to feel it, not read it.

**On difficulty scaling**  
The Constance is achievable in a few runs. The Kelly requires you've earned trust. The Birkin requires you to be the kind of client who has never once thought about reselling. That's not arbitrary — it's the point.

---

## CSS Design Tokens

Luxury palette in `src/index.css`:

```css
--cream:       #f5f1ea   /* page background */
--warm-white:  #faf8f5   /* card / panel backgrounds */
--charcoal:    #1a1a1a   /* primary text, buttons */
--mid-gray:    #888880   /* secondary text, labels */
--light-gray:  #d4cfc6   /* borders, dividers */
--gold:        #b8a06a   /* accents, chapter target, combo hints */
--danger:      #8b2e2e   /* cold mood, negative deltas */
```

Typography: Cormorant Garamond (Google Fonts), loaded in `index.html`.

---

## V2 Backlog

- **Bag icon redraw** — Current SVG illustrations are too rough. Needs clean, iconic silhouettes.
- **Money carry between chapters** — Currently resets to $5,000 each run. Unresolved.
- **Ch.3 after Birkin** — Currently Ch.2 win shows a final verdict with no further unlock. Unresolved.
- **Legacy screen** — Show all bags ever acquired across all-time runs.
- **NPC portrait refinement** — More distinct mouth/brow expressions per mood state.

---

## Development Notes

**No CLI scaffold** — `npm create vite@latest` cancelled non-interactively. Project was scaffolded manually: `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`.

**afterFlip dialogue** — `NPC_DIALOGUE.afterFlip` pool exists but the `flip` action in `gameLogic.js` uses a hardcoded string. Known inconsistency; parked for V2.
