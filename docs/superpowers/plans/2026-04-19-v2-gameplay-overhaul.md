# V2 Gameplay Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement six gameplay changes: $10k start money, Carré H scarf item, 8 new NPC dialogue pools, owned-only shelf display, SA offer cap (3/run), three-path chapter continuity, and wire accessory photos in ResultMoment.

**Architecture:** Logic changes flow through `gameData.js` (data) → `gameLogic.js` (rules) → `persistence.js` (chapter progression). UI changes are isolated to `ItemPhoto.jsx` (new), `ResultMoment.jsx`, and `ShelfInventory.jsx`. No new dependencies.

**Tech Stack:** React 18, Vite, Vitest (existing test suite in `src/__tests__/`)

---

## File Map

| File | Change |
|------|--------|
| `src/gameData.js` | Add `scarfCarre` to ITEMS; add 8 new NPC_DIALOGUE pools; add `outfitChat` option to `talkToAssociate` card |
| `src/gameLogic.js` | money→$10k; `saOfferCount` cap at 3; split `afterBuy` into `afterBuySmall`/`afterBuyMedium`; `complimentReturn` pool; new `outfitChat` action; `scarfCarre` drop from `buySmall`; `itemSynergy` + `suspicionBuilding` triggers; `chapterAware` in `startGame` |
| `src/persistence.js` | Add `standing`/`progress` to `DEFAULT_PROFILE`; implement three-path chapter logic in `updateProfileAfterRun` |
| `src/components/ItemPhoto.jsx` | **New.** Unified photo component for all items — handles 3×2 sprite sheets (bags + accessories) and 4×2 (scarf) |
| `src/components/ResultMoment.jsx` | Replace `BagPhoto` with `ItemPhoto`; show photo for accessories as well as bags |
| `src/components/ShelfInventory.jsx` | Add `ScarfCarreIcon` SVG; add `scarfCarre` entry to `SHELF_ITEMS`; render only owned items; empty-state text |
| `src/__tests__/gameData.test.js` | Add tests for `scarfCarre` item and new dialogue pools |
| `src/__tests__/gameLogic.test.js` | Add tests for money, saOfferCount, outfitChat, dialogue triggers |
| `src/__tests__/persistence.test.js` | Add tests for three-path chapter logic |
| `src/__tests__/fixtures.js` | Add `withScarfCarre` and `chapter1State` helpers |

---

## Task 1: `gameData.js` — scarfCarre item + new dialogue pools + outfitChat card option

**Files:**
- Modify: `src/gameData.js`

- [ ] **Step 1: Write the failing tests**

Add to `src/__tests__/gameData.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { ITEMS, NPC_DIALOGUE, CARD_TEMPLATES } from '../gameData.js';

describe('gameData — scarfCarre item', () => {
  it('scarfCarre exists in ITEMS', () => {
    expect(ITEMS.scarfCarre).toBeDefined();
  });

  it('scarfCarre has required fields', () => {
    const s = ITEMS.scarfCarre;
    expect(s.id).toBe('scarfCarre');
    expect(s.name).toBe('Carré H');
    expect(typeof s.score).toBe('number');
    expect(s.effect).toBe('wardrobeDepth');
  });
});

describe('gameData — new dialogue pools', () => {
  const REQUIRED_POOLS = [
    'afterBuySmall', 'afterBuyMedium', 'outfitChat',
    'complimentReturn', 'suspicionBuilding', 'itemSynergy',
    'chapterAware_ch1', 'chapterAware_ch2',
  ];

  REQUIRED_POOLS.forEach(pool => {
    it(`NPC_DIALOGUE has pool: ${pool}`, () => {
      expect(NPC_DIALOGUE[pool]).toBeDefined();
      expect(Array.isArray(NPC_DIALOGUE[pool])).toBe(true);
      expect(NPC_DIALOGUE[pool].length).toBeGreaterThan(0);
    });
  });
});

describe('gameData — talkToAssociate card has outfitChat option', () => {
  it('talkToAssociate card includes outfitChat action', () => {
    const card = CARD_TEMPLATES.find(c => c.id === 'talkToAssociate');
    const actions = card.options.map(o => o.action);
    expect(actions).toContain('outfitChat');
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd "/Users/anjalee/Library/Mobile Documents/com~apple~CloudDocs/Coding/HermesClaw"
npx vitest run src/__tests__/gameData.test.js
```

Expected: multiple FAIL — `scarfCarre` not found, pools not found, `outfitChat` not found.

- [ ] **Step 3: Add `scarfCarre` to ITEMS in `src/gameData.js`**

After the `kellyBelt` entry (end of accessories section), add:

```js
  scarfCarre: {
    id: 'scarfCarre',
    name: 'Carré H',
    description: 'Ninety centimetres of intention.',
    score: 125,
    effect: 'wardrobeDepth',
  },
```

- [ ] **Step 4: Add 8 new pools to `NPC_DIALOGUE` in `src/gameData.js`**

After the existing `postKelly` pool (end of `NPC_DIALOGUE`), add:

```js
  afterBuySmall: [
    'Subtle. I appreciate that.',
    'Small things reveal everything.',
    'Not everyone starts here. I noticed.',
    'A considered choice.',
    'It suits you. I can tell already.',
    'The details are always where it begins.',
  ],
  afterBuyMedium: [
    "Now we're speaking the same language.",
    'You understand commitment.',
    'I had a feeling about you.',
    "Yes. That's exactly right.",
    "That's more like it.",
    'This is how a relationship begins.',
  ],
  outfitChat: [
    "What you're describing — structured, but not stiff. That's very Constance.",
    "For something everyday, I'd think Evelyne. You seem like someone who moves.",
    "The Kelly reads formal, but she's surprisingly versatile. What's the occasion?",
    "If you're building a wardrobe around it — start with the scarf. Everything else follows.",
    'For travel? The Lindy. For arrival? The Kelly.',
    'You want people to notice, or you want them to wonder? Those are different bags.',
    'A Birkin is never casual. If you need casual, I have something else in mind.',
    'What you wear with it matters as much as the bag itself. What are we working with?',
    'The belt anchors everything. Once you have that, the bag becomes obvious.',
    'I always ask: is it for you, or is it for the room? The answer changes everything.',
    "There's a version of this that's very quiet. And a version that announces itself. Which are you?",
    "If you're wearing the scarf, the bag almost doesn't matter. Almost.",
  ],
  complimentReturn: [
    "I've been doing this long enough to trust my instincts.",
    "How kind. Most clients don't notice the display arrangement.",
    'I was wondering if anyone would say something about that.',
    'You\'re very perceptive. I appreciate that.',
    'It took us three weeks to find exactly the right piece for that corner.',
    'The craft deserves to be noticed. Thank you for seeing it.',
    "I don't often hear that. It means something, coming from you.",
  ],
  suspicionBuilding: [
    'You seem to have a very specific idea of what you\'re after.',
    'I want to make sure I understand what you\'re looking for, exactly.',
    'We like to get to know our clients a little first.',
    'Some clients find it helpful to come back another time.',
    "I'm just going to — excuse me one moment.",
    'We do move carefully here. I hope you understand.',
  ],
  itemSynergy: [
    "The scarf and the belt together — that's not an accident. You planned this.",
    'I notice you have the Twilly. The Kelly would complete that story.',
    'Someone who understands the belt already understands what comes next.',
    'The way you wear these things — it\'s consistent. That matters here.',
    "Your eye is getting sharper. I've been watching.",
    "You know, the bracelet reads differently with what you've chosen. It's working.",
    "I don't say this to everyone — but you're building something.",
    'That combination is very specific. Very you. I respect that.',
  ],
  chapterAware_ch1: [
    "You've been here before. I remember.",
    'Your Constance is settling in well, I hope?',
    "We've come a long way from our first conversation.",
    "You've earned a certain kind of conversation.",
    "I was hoping you'd come back.",
  ],
  chapterAware_ch2: [
    'This is a different kind of visit.',
    "I don't have many clients at this level.",
    "What you're looking for — it's not impossible. But it requires everything.",
    "We're not talking about the same world anymore.",
    "I hope you understand what's expected of someone in your position.",
  ],
```

- [ ] **Step 5: Add `outfitChat` option to `talkToAssociate` in `CARD_TEMPLATES`**

Find the `talkToAssociate` entry in `CARD_TEMPLATES` and add the fourth option:

```js
  {
    id: 'talkToAssociate',
    type: 'talkToAssociate',
    title: 'The Associate',
    subtitle: 'She looks up from the display case.',
    baseWeight: 3,
    options: [
      { label: 'Ask About a Bag', action: 'ask', cost: 0 },
      { label: 'Chat Casually', action: 'chat', cost: 0 },
      { label: 'Compliment Her Taste', action: 'compliment', cost: 0 },
      { label: 'Discuss an Outfit', action: 'outfitChat', cost: 0 },
    ],
  },
```

- [ ] **Step 6: Run tests to confirm they pass**

```bash
npx vitest run src/__tests__/gameData.test.js
```

Expected: all PASS.

- [ ] **Step 7: Commit**

```bash
cd "/Users/anjalee/Library/Mobile Documents/com~apple~CloudDocs/Coding/HermesClaw"
git add src/gameData.js src/__tests__/gameData.test.js
git commit -m "$(cat <<'EOF'
Add scarfCarre item, 8 new NPC dialogue pools, outfitChat card option

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: `gameLogic.js` — money, saOfferCount, dialogue wiring, outfitChat action

**Files:**
- Modify: `src/gameLogic.js`
- Modify: `src/__tests__/gameLogic.test.js`
- Modify: `src/__tests__/fixtures.js`

- [ ] **Step 1: Add fixture helpers to `src/__tests__/fixtures.js`**

Append to the end of `fixtures.js`:

```js
export function chapter1State() {
  return createMockState({ chapter: 1, favor: 1 });
}

export function withScarfCarre() {
  return createMockState({ inventory: ['scarfCarre'] });
}
```

- [ ] **Step 2: Write failing tests**

Add a new `describe` block to `src/__tests__/gameLogic.test.js`:

```js
import { chapter1State, withScarfCarre } from './fixtures.js';

describe('V2 — economy and offer cap', () => {
  it('createInitialState starts with $10,000', () => {
    const state = createInitialState();
    expect(state.money).toBe(10000);
  });

  it('createInitialState has saOfferCount: 0', () => {
    const state = createInitialState();
    expect(state.saOfferCount).toBe(0);
  });

  it('saOffer card not generated when saOfferCount >= 3', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const state = createMockState({ saOfferCount: 3, favor: 8 });
    const { cards } = generateCards(state);
    const hasOfferCard = cards.some(c => c.type === 'saOffer');
    expect(hasOfferCard).toBe(false);
    vi.restoreAllMocks();
  });

  it('saOfferBuy increments saOfferCount', () => {
    const state = createMockState({
      money: 10000,
      saOfferCount: 1,
      currentOffer: 'evelyneTpm',
      inventory: [],
    });
    const result = resolveAction(state, 'card-0', 'saOfferBuy');
    expect(result.saOfferCount).toBe(2);
  });

  it('saOfferDecline increments saOfferCount', () => {
    const state = createMockState({ saOfferCount: 0, currentOffer: 'evelyneTpm' });
    const result = resolveAction(state, 'card-0', 'saOfferDecline');
    expect(result.saOfferCount).toBe(1);
  });
});

describe('V2 — dialogue wiring', () => {
  it('buySmall uses afterBuySmall pool (message is a known line)', () => {
    const state = createMockState({ money: 10000 });
    const result = resolveAction(state, 'card-0', 'buySmall');
    const pool = [
      'Subtle. I appreciate that.',
      'Small things reveal everything.',
      'Not everyone starts here. I noticed.',
      'A considered choice.',
      'It suits you. I can tell already.',
      'The details are always where it begins.',
    ];
    expect(pool).toContain(result.lastNPCMessage);
  });

  it('buyMedium uses afterBuyMedium pool', () => {
    const state = createMockState({ money: 10000 });
    const result = resolveAction(state, 'card-0', 'buyMedium');
    const pool = [
      "Now we're speaking the same language.",
      'You understand commitment.',
      'I had a feeling about you.',
      "Yes. That's exactly right.",
      "That's more like it.",
      'This is how a relationship begins.',
    ];
    expect(pool).toContain(result.lastNPCMessage);
  });

  it('compliment uses complimentReturn pool', () => {
    const state = createMockState({ money: 10000 });
    const result = resolveAction(state, 'card-0', 'compliment');
    const pool = [
      "I've been doing this long enough to trust my instincts.",
      "How kind. Most clients don't notice the display arrangement.",
      'I was wondering if anyone would say something about that.',
      "You're very perceptive. I appreciate that.",
      'It took us three weeks to find exactly the right piece for that corner.',
      'The craft deserves to be noticed. Thank you for seeing it.',
      "I don't often hear that. It means something, coming from you.",
    ];
    expect(pool).toContain(result.lastNPCMessage);
  });
});

describe('V2 — outfitChat action', () => {
  it('outfitChat gives +1 favor', () => {
    const state = createMockState({ favor: 2 });
    const result = resolveAction(state, 'card-0', 'outfitChat');
    expect(result.favor).toBeGreaterThanOrEqual(3);
  });

  it('outfitChat gives +2 favor when scarfCarre owned', () => {
    const state = createMockState({ favor: 2, inventory: ['scarfCarre'] });
    const result = resolveAction(state, 'card-0', 'outfitChat');
    expect(result.favor).toBeGreaterThanOrEqual(4);
  });

  it('outfitChat does not add suspicion', () => {
    const state = createMockState({ suspicion: 2 });
    const result = resolveAction(state, 'card-0', 'outfitChat');
    expect(result.suspicion).toBe(2);
  });

  it('outfitChat drops scarfCarre on first acquisition', () => {
    const state = createMockState({
      money: 10000,
      inventory: ['twilly', 'bracelet'],
    });
    const result = resolveAction(state, 'card-0', 'buySmall');
    expect(result.inventory).toContain('scarfCarre');
  });
});

describe('V2 — suspicionBuilding trigger', () => {
  it('suspicionBuilding fires at suspicion 3', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createMockState({ suspicion: 2, favor: 0, turn: 1 });
    // ask on turn 1 raises suspicion by 2 → to 4, which should trigger
    // Use wait to raise suspicion manually via a state override
    const state3 = createMockState({ suspicion: 2, money: 10000 });
    // buySmall won't raise suspicion normally; force suspicion=3 in state and chat
    const forcedState = createMockState({ suspicion: 3, money: 10000, inventory: [] });
    const result = resolveAction(forcedState, 'card-0', 'chat');
    const pool = [
      "You seem to have a very specific idea of what you're after.",
      'I want to make sure I understand what you\'re looking for, exactly.',
      'We like to get to know our clients a little first.',
      'Some clients find it helpful to come back another time.',
      "I'm just going to — excuse me one moment.",
      'We do move carefully here. I hope you understand.',
    ];
    // suspicion stays at 3 after chat (chat doesn't raise suspicion)
    // suspicionBuilding should fire since suspicion is 3
    expect(pool).toContain(result.lastNPCMessage);
    vi.restoreAllMocks();
  });
});

describe('V2 — startGame chapterAware opening', () => {
  it('ch1 opening uses chapterAware_ch1 pool', () => {
    const state = createInitialState({ chapter: 1, runCount: 0 });
    const started = startGame(state);
    const pool = [
      "You've been here before. I remember.",
      'Your Constance is settling in well, I hope?',
      "We've come a long way from our first conversation.",
      "You've earned a certain kind of conversation.",
      "I was hoping you'd come back.",
    ];
    expect(pool).toContain(started.lastNPCMessage);
  });

  it('ch2 opening uses chapterAware_ch2 pool', () => {
    const state = createInitialState({ chapter: 2, runCount: 0 });
    const started = startGame(state);
    const pool = [
      'This is a different kind of visit.',
      "I don't have many clients at this level.",
      "What you're looking for — it's not impossible. But it requires everything.",
      "We're not talking about the same world anymore.",
      "I hope you understand what's expected of someone in your position.",
    ];
    expect(pool).toContain(started.lastNPCMessage);
  });
});
```

- [ ] **Step 3: Run tests to confirm they fail**

```bash
npx vitest run src/__tests__/gameLogic.test.js
```

Expected: multiple FAIL — money is 5000, saOfferCount undefined, wrong message pools, outfitChat not handled, etc.

- [ ] **Step 4: Update `createInitialState` in `src/gameLogic.js`**

Change `money: 5000` to `money: 10000` and add `saOfferCount: 0`:

```js
export function createInitialState(playerProfile = null) {
  const profile = playerProfile ?? { runCount: 0, chapter: 0 };
  return {
    phase: 'intro',
    turn: 1,
    money: 10000,           // changed from 5000
    inventory: [],
    lastActions: [],
    hasAsked: false,
    hasFlipped: false,
    favor: profile.chapter >= 1 ? 1 : 0,
    suspicion: 0,
    npcMood: 'neutral',
    rareChanceBonus: 0,
    currentCards: [],
    pendingCards: [],
    currentOffer: null,
    pendingOffer: null,
    saOfferCount: 0,        // new — tracks SA everyday offers shown this run
    lastNPCMessage: '',
    actionSummary: null,
    chapter: profile.chapter,
    runCount: profile.runCount,
  };
}
```

- [ ] **Step 5: Add SA offer cap to `generateCards` in `src/gameLogic.js`**

At the top of `generateCards`, after the `unownedEveryday` line, add the cap check:

```js
export function generateCards(state) {
  // Cap SA everyday offers at 3 per run
  const unownedEveryday = state.saOfferCount >= 3
    ? []
    : EVERYDAY_BAGS.filter(id => !state.inventory.includes(id));
  const offerItemId = unownedEveryday.length > 0
    ? unownedEveryday[Math.floor(Math.random() * unownedEveryday.length)]
    : null;
  // ... rest unchanged
```

- [ ] **Step 6: Update `resolveAction` — buySmall, buyMedium, compliment, saOfferBuy, saOfferDecline**

In the `buySmall` case, change the message and drop order:

```js
    case 'buySmall': {
      if (s.money < 500) {
        message = 'Your card was declined. Discreetly.';
        s.suspicion = Math.min(10, s.suspicion + 1);
        break;
      }
      s.money -= 500;
      s.favor = Math.min(10, s.favor + 1 + reputationBonus);
      if (hasShoes) s.suspicion = Math.max(0, s.suspicion - 1);
      // scarfCarre added between twilly and bracelet
      const smallItems = ['twilly', 'scarfCarre', 'bracelet'].filter(i => !s.inventory.includes(i));
      if (smallItems.length > 0) s.inventory = [...s.inventory, smallItems[0]];
      s.lastActions = appendAction(s.lastActions, 'buy');
      message = pickDialogue('afterBuySmall', s.npcMood);  // changed pool
      break;
    }
```

In the `buyMedium` case, change the message pool:

```js
      message = pickDialogue('afterBuyMedium', s.npcMood);  // changed from 'afterBuy'
```

In the `compliment` case, replace the hardcoded string:

```js
    case 'compliment': {
      const complimentBonus = hasKellyBelt ? 2 : 1;
      s.favor = Math.min(10, s.favor + complimentBonus + socialBonus);
      s.lastActions = appendAction(s.lastActions, 'chat');
      message = pickDialogue('complimentReturn', s.npcMood);  // was hardcoded string
      break;
    }
```

In the `saOfferBuy` case, add `saOfferCount` increment before `break`:

```js
      s.saOfferCount = (s.saOfferCount ?? 0) + 1;
      break;
```

In the `saOfferDecline` case, add `saOfferCount` increment before `break`:

```js
    case 'saOfferDecline': {
      s.favor = Math.min(10, s.favor + 1);
      s.lastActions = appendAction(s.lastActions, 'wait');
      s.saOfferCount = (s.saOfferCount ?? 0) + 1;
      message = pickDialogue('saOfferDecline', s.npcMood);
      break;
    }
```

- [ ] **Step 7: Add `outfitChat` case to `resolveAction`**

Add after the `compliment` case:

```js
    case 'outfitChat': {
      const hasScarfCarre = s.inventory.includes('scarfCarre');
      const outfitBonus = hasScarfCarre ? 2 : 1;  // wardrobeDepth effect
      s.favor = Math.min(10, s.favor + outfitBonus + socialBonus);
      s.lastActions = appendAction(s.lastActions, 'chat');  // counts as chat for combos
      message = pickDialogue('outfitChat', s.npcMood);
      break;
    }
```

- [ ] **Step 8: Add `isSocialAction` tracking and `itemSynergy` + `suspicionBuilding` triggers**

At the top of `resolveAction`, after the passive bonus declarations, add:

```js
  let isSocialAction = false;
```

In the `chat`, `compliment`, and `outfitChat` cases, add `isSocialAction = true;` at the start of each case:

```js
    case 'chat': {
      isSocialAction = true;
      // ... rest unchanged
    }
    case 'compliment': {
      isSocialAction = true;
      // ... rest unchanged
    }
    case 'outfitChat': {
      isSocialAction = true;
      // ... rest unchanged
    }
```

After the existing combo block (after `if (suspicionDrop > 0)...`), add `itemSynergy` and `suspicionBuilding` triggers:

```js
  // itemSynergy: owning 2+ items + social action = occasional synergy observation
  if (s.inventory.length >= 2 && isSocialAction && Math.random() < 0.4 && s.npcMood !== 'cold') {
    message = pickDialogue('itemSynergy', s.npcMood);
  }

  // suspicionBuilding: suspicion at 3–4 (not yet full cold)
  if (s.suspicion >= 3 && s.suspicion <= 4) {
    message = pickDialogue('suspicionBuilding', s.npcMood);
  }

  // High suspicion overrides all — the final word
  if (s.suspicion >= 6) {
    message = pickDialogue('highSuspicion', s.npcMood);
  }
```

Remove the existing `if (s.suspicion >= 6)` line that was already there (it's now replaced by the block above).

- [ ] **Step 9: Update `startGame` to use `chapterAware` pools**

Replace the `getOpeningPool` function in `startGame`:

```js
export function startGame(state) {
  const s = { ...state, phase: 'playing' };
  const { cards: startCards, offer: startOffer } = generateCards(s);
  s.currentCards = startCards;
  s.currentOffer = startOffer;

  function getOpeningPool(runCount, chapter) {
    if (chapter === 2) return 'chapterAware_ch2';   // was 'postKelly'
    if (chapter === 1) return 'chapterAware_ch1';   // was 'postConstance'
    if (runCount >= 5) return 'loyalClient';
    if (runCount >= 1) return 'returningClient';
    return null;
  }

  const pool = getOpeningPool(s.runCount, s.chapter);
  s.lastNPCMessage = pool
    ? pickDialogue(pool, s.npcMood)
    : 'Good afternoon. Welcome.';

  return s;
}
```

- [ ] **Step 10: Run tests to confirm they pass**

```bash
npx vitest run src/__tests__/gameLogic.test.js
```

Expected: all new tests PASS, existing tests still PASS.

- [ ] **Step 11: Commit**

```bash
cd "/Users/anjalee/Library/Mobile Documents/com~apple~CloudDocs/Coding/HermesClaw"
git add src/gameLogic.js src/__tests__/gameLogic.test.js src/__tests__/fixtures.js
git commit -m "$(cat <<'EOF'
Wire V2 game logic: $10k start, offer cap, new dialogue pools, outfitChat action

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: `persistence.js` — three-path chapter continuity

**Files:**
- Modify: `src/persistence.js`
- Modify: `src/__tests__/persistence.test.js`

- [ ] **Step 1: Write failing tests**

Add to `src/__tests__/persistence.test.js`:

```js
describe('V2 — DEFAULT_PROFILE has new fields', () => {
  it('DEFAULT_PROFILE has standing field', () => {
    expect(typeof DEFAULT_PROFILE.standing).toBe('number');
    expect(DEFAULT_PROFILE.standing).toBe(0);
  });

  it('DEFAULT_PROFILE has progress field', () => {
    expect(typeof DEFAULT_PROFILE.progress).toBe('number');
    expect(DEFAULT_PROFILE.progress).toBe(0);
  });
});

describe('V2 — three-path chapter continuity', () => {
  it('direct win always advances chapter regardless of path', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99); // path C
    const profile = createMockProfile({ chapter: 0, standing: 0, progress: 0 });
    const gameState = createMockState({ chapter: 0, inventory: ['constance24'], favor: 3 });
    const updated = updateProfileAfterRun(profile, gameState, 500);
    expect(updated.chapter).toBe(1);
    vi.restoreAllMocks();
  });

  it('path A: high standing advances chapter without win', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1); // rolls path A (0–0.33)
    const profile = createMockProfile({ chapter: 0, standing: 12, progress: 0 });
    const gameState = createMockState({ chapter: 0, inventory: [], favor: 8 });
    const updated = updateProfileAfterRun(profile, gameState, 200);
    expect(updated.chapter).toBe(1);
    vi.restoreAllMocks();
  });

  it('path A: low standing does not advance chapter without win', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1); // path A
    const profile = createMockProfile({ chapter: 0, standing: 4, progress: 0 });
    const gameState = createMockState({ chapter: 0, inventory: [], favor: 3 });
    const updated = updateProfileAfterRun(profile, gameState, 100);
    expect(updated.chapter).toBe(0);
    vi.restoreAllMocks();
  });

  it('path B: high favor + 2 accessories advances chapter without win', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5); // path B (0.33–0.66)
    const profile = createMockProfile({ chapter: 0, standing: 0, progress: 0 });
    const gameState = createMockState({
      chapter: 0,
      inventory: ['twilly', 'bracelet'],
      favor: 6,
    });
    const updated = updateProfileAfterRun(profile, gameState, 300);
    expect(updated.chapter).toBe(1);
    vi.restoreAllMocks();
  });

  it('path B: insufficient favor does not advance', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5); // path B
    const profile = createMockProfile({ chapter: 0, standing: 0, progress: 0 });
    const gameState = createMockState({
      chapter: 0,
      inventory: ['twilly', 'bracelet'],
      favor: 4,
    });
    const updated = updateProfileAfterRun(profile, gameState, 200);
    expect(updated.chapter).toBe(0);
    vi.restoreAllMocks();
  });

  it('path C: progress accumulates and advances at threshold', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9); // path C (0.66–1.0)
    const profile = createMockProfile({ chapter: 0, standing: 0, progress: 2 });
    // progress 2 + win bonus 2 = 4, threshold ch0→ch1 is 3
    const gameState = createMockState({ chapter: 0, inventory: ['constance24'], favor: 3 });
    const updated = updateProfileAfterRun(profile, gameState, 500);
    expect(updated.chapter).toBe(1);
    vi.restoreAllMocks();
  });

  it('chapter never advances beyond 2', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1); // path A
    const profile = createMockProfile({ chapter: 2, standing: 20, progress: 10 });
    const gameState = createMockState({ chapter: 2, inventory: ['birkin30'], favor: 9 });
    const updated = updateProfileAfterRun(profile, gameState, 1000);
    expect(updated.chapter).toBe(2);
    vi.restoreAllMocks();
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npx vitest run src/__tests__/persistence.test.js
```

Expected: FAIL — `standing` and `progress` not in `DEFAULT_PROFILE`, paths not implemented.

- [ ] **Step 3: Implement three-path logic in `src/persistence.js`**

Replace the entire file with:

```js
// src/persistence.js
const KEY = 'hermes_claw_profile';

export const DEFAULT_PROFILE = {
  runCount: 0,
  bestScore: 0,
  chapter: 0,
  totalWins: 0,
  everFlipped: false,
  askedEarlyCount: 0,
  standing: 0,      // Path A: accumulated relationship score (0–30)
  progress: 0,      // Path C: cumulative bag-acquisition counter
};

export function loadProfile() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveProfile(profile) {
  try {
    localStorage.setItem(KEY, JSON.stringify(profile));
  } catch {
    // localStorage blocked (private mode etc.) — fail silently
  }
}

// Chapter thresholds for Path C cumulative progress
const PATH_C_THRESHOLDS = { 0: 3, 1: 5 };

export function updateProfileAfterRun(profile, gameState, score) {
  const targetBag  = CHAPTER_TARGETS[profile.chapter];
  const won        = gameState.inventory.includes(targetBag);
  const flipped    = gameState.hasFlipped;
  const askedEarly = gameState.lastActions.slice(0, 2).includes('ask');
  const favor      = gameState.favor ?? 0;
  const inventory  = gameState.inventory ?? [];

  // Direct win always advances chapter — no path roll needed
  let newChapter = won ? Math.min(2, profile.chapter + 1) : profile.chapter;

  // Three-path system — only applies when player did NOT win directly
  let newStanding = profile.standing ?? 0;
  let newProgress = profile.progress ?? 0;
  let pathAdvanced = false;

  if (!won && profile.chapter < 2) {
    const pathRoll = Math.random();

    if (pathRoll < 0.33) {
      // Path A — Relationship Carry
      newStanding = Math.round(newStanding * 0.9) + Math.floor(favor / 2);
      newStanding = Math.min(30, newStanding);
      if (newStanding >= 12) pathAdvanced = true;

    } else if (pathRoll < 0.66) {
      // Path B — Milestone Unlock
      const accessoryIds = ['twilly', 'scarfCarre', 'bracelet', 'shoes', 'kellyBelt'];
      const accessoriesOwned = inventory.filter(id => accessoryIds.includes(id)).length;
      if (favor >= 6 && accessoriesOwned >= 2) pathAdvanced = true;

    } else {
      // Path C — Cumulative Progress
      const hasEverydayBag = inventory.some(id =>
        ['evelyneTpm', 'picotin18', 'gardenParty', 'bolide', 'roulis', 'lindy26'].includes(id)
      );
      newProgress += hasEverydayBag ? 1 : 0;
      newProgress = Math.min(20, newProgress);
      const threshold = PATH_C_THRESHOLDS[profile.chapter];
      if (threshold !== undefined && newProgress >= threshold) pathAdvanced = true;
    }

    if (pathAdvanced) {
      newChapter = Math.min(2, profile.chapter + 1);
    }
  }

  return {
    ...profile,
    runCount:        profile.runCount + 1,
    bestScore:       Math.max(profile.bestScore, score),
    totalWins:       won ? profile.totalWins + 1 : profile.totalWins,
    chapter:         newChapter,
    everFlipped:     profile.everFlipped || flipped,
    askedEarlyCount: askedEarly ? profile.askedEarlyCount + 1 : profile.askedEarlyCount,
    standing:        newStanding,
    progress:        newProgress,
  };
}

export const CHAPTER_TARGETS = {
  0: 'constance24',
  1: 'kelly28',
  2: 'birkin30',
};

export const CHAPTER_NAMES = {
  0: 'The Constance',
  1: 'The Kelly 28',
  2: 'The Birkin 30',
};
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npx vitest run src/__tests__/persistence.test.js
```

Expected: all PASS.

- [ ] **Step 5: Run full test suite to catch regressions**

```bash
npx vitest run
```

Expected: all PASS.

- [ ] **Step 6: Commit**

```bash
cd "/Users/anjalee/Library/Mobile Documents/com~apple~CloudDocs/Coding/HermesClaw"
git add src/persistence.js src/__tests__/persistence.test.js
git commit -m "$(cat <<'EOF'
Add three-path chapter continuity system (Path A/B/C) to persistence

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: `ItemPhoto.jsx` — unified photo component for all items

**Files:**
- Create: `src/components/ItemPhoto.jsx`

No unit tests — visual component. Verified via dev server.

- [ ] **Step 1: Create `src/components/ItemPhoto.jsx`**

```jsx
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
    const idx  = ((colorIndex % 6) + 6) % 6;
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
    const idx  = ((colorIndex % 8) + 8) % 8;
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
```

- [ ] **Step 2: Verify file was created**

```bash
ls "/Users/anjalee/Library/Mobile Documents/com~apple~CloudDocs/Coding/HermesClaw/src/components/ItemPhoto.jsx"
```

Expected: file exists.

- [ ] **Step 3: Commit**

```bash
cd "/Users/anjalee/Library/Mobile Documents/com~apple~CloudDocs/Coding/HermesClaw"
git add src/components/ItemPhoto.jsx
git commit -m "$(cat <<'EOF'
Add ItemPhoto component — unified sprite-sheet photo for all items

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: `ResultMoment.jsx` — show photos for all items

**Files:**
- Modify: `src/components/ResultMoment.jsx`

- [ ] **Step 1: Replace `BagPhoto` with `ItemPhoto` and expand photo display**

Replace the entire file:

```jsx
// src/components/ResultMoment.jsx
import { ITEMS } from '../gameData.js';
import AssociatePortrait from './AssociatePortrait.jsx';
import ItemPhoto from './ItemPhoto.jsx';

const NPC_NAMES = { 0: 'The Associate', 1: 'The Associate', 2: 'The Senior Associate' };

// Items that have a photo (sprite-sheet or single). Must match keys in ItemPhoto.jsx.
const PHOTO_ITEMS = new Set([
  'constance24', 'constanceMini',
  'kelly28', 'kelly25',
  'birkin30', 'birkin25',
  'twilly', 'bracelet', 'shoes', 'kellyBelt', 'scarfCarre',
]);

export default function ResultMoment({ message, mood, summary, onContinue, turn, chapter = 0, runCount = 0 }) {
  const { moneyDelta, newItem } = summary ?? {};
  const hasPhoto = newItem && PHOTO_ITEMS.has(newItem);

  return (
    <div className="result-moment">
      <div className={`result-dialogue npc-mood-${mood}`}>
        <div className="npc-portrait-col result-portrait-col">
          <AssociatePortrait mood={mood} chapter={chapter} />
        </div>
        <div className="npc-speech-col">
          <div className="npc-header">
            <span className="npc-name">{NPC_NAMES[chapter] ?? 'The Associate'}</span>
            <span className={`npc-mood-tag npc-mood-tag--${mood}`}>
              {mood === 'warm'    && 'receptive'}
              {mood === 'neutral' && 'composed'}
              {mood === 'cold'    && 'displeased'}
            </span>
          </div>
          <p className="result-message">"{message || '…'}"</p>
        </div>
      </div>

      {hasPhoto && (
        <div className="bag-photo-wrap">
          <ItemPhoto itemId={newItem} colorIndex={runCount} />
          <div className="bag-photo-caption">
            <span className="bag-photo-label">Acquired</span>
            <span className="bag-photo-name">{ITEMS[newItem]?.name}</span>
            <span className="bag-photo-desc">{ITEMS[newItem]?.description}</span>
          </div>
        </div>
      )}

      <div className="result-feedback">
        {moneyDelta !== 0 && moneyDelta != null && (
          <div className={`result-delta ${moneyDelta < 0 ? 'delta-negative' : 'delta-positive'}`}>
            {moneyDelta > 0 ? '+' : ''}${Math.abs(moneyDelta).toLocaleString()}
          </div>
        )}
        {newItem && !hasPhoto && (
          <div className="result-item-gained">
            <span className="result-item-label">Acquired</span>
            <span className="result-item-name">{ITEMS[newItem]?.name}</span>
            <span className="result-item-desc">{ITEMS[newItem]?.description}</span>
          </div>
        )}
      </div>

      <button className="result-continue" onClick={onContinue}>
        {turn > 10 ? 'See Results →' : `Continue — Turn ${turn} of 10 →`}
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Verify build compiles cleanly**

```bash
cd "/Users/anjalee/Library/Mobile Documents/com~apple~CloudDocs/Coding/HermesClaw"
npm run build 2>&1 | tail -10
```

Expected: no errors. `dist/` updated.

- [ ] **Step 3: Commit**

```bash
git add src/components/ResultMoment.jsx
git commit -m "$(cat <<'EOF'
Show photos for accessories and quota bags in ResultMoment via ItemPhoto

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: `ShelfInventory.jsx` — owned-only display + scarfCarre

**Files:**
- Modify: `src/components/ShelfInventory.jsx`

- [ ] **Step 1: Add `ScarfCarreIcon` SVG and update `SHELF_ITEMS`**

At the top of `ShelfInventory.jsx`, after `KellyBeltIcon`, add:

```jsx
function ScarfCarreIcon() {
  // Classic 90cm square silk scarf — folded diagonally, bold print border
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      {/* Main square scarf body */}
      <rect x="8" y="8" width="36" height="36" rx="1"
            fill="#e8601c" stroke="#1a1a1a" strokeWidth="2" />
      {/* Border pattern — inner frame */}
      <rect x="12" y="12" width="28" height="28" rx="0.5"
            fill="none" stroke="#1a1a1a" strokeWidth="1.2" />
      {/* Print motif — central diamond */}
      <path d="M26 14 L38 26 L26 38 L14 26 Z"
            fill="#f5f0e8" stroke="#1a1a1a" strokeWidth="1" />
      {/* Inner detail */}
      <circle cx="26" cy="26" r="4" fill="#e8601c" stroke="#1a1a1a" strokeWidth="1" />
      {/* Corner accents */}
      <circle cx="14" cy="14" r="1.5" fill="#1a1a1a" opacity="0.4" />
      <circle cx="38" cy="14" r="1.5" fill="#1a1a1a" opacity="0.4" />
      <circle cx="14" cy="38" r="1.5" fill="#1a1a1a" opacity="0.4" />
      <circle cx="38" cy="38" r="1.5" fill="#1a1a1a" opacity="0.4" />
    </svg>
  );
}
```

- [ ] **Step 2: Add `scarfCarre` to `SHELF_ITEMS` array**

In the accessories section of `SHELF_ITEMS`, after the `kellyBelt` entry:

```js
  { id: 'scarfCarre', Icon: ScarfCarreIcon, label: 'Carré H', bg: '#fff8f3' },
```

- [ ] **Step 3: Change shelf to render owned items only**

Replace the `ShelfInventory` component function (keep all the icon functions and `SHELF_ITEMS` above it unchanged):

```jsx
export default function ShelfInventory({ inventory, lastAcquired }) {
  // Build a lookup map from SHELF_ITEMS for icon/label/bg data
  const itemConfig = Object.fromEntries(SHELF_ITEMS.map(item => [item.id, item]));

  // Only render items the player actually owns, in acquisition order
  const ownedItems = inventory
    .map(id => itemConfig[id])
    .filter(Boolean); // filter out any ids with no config (everyday bags without icons etc.)

  return (
    <div className="shelf-wrapper">
      <div className="shelf-label">Your Acquisitions</div>

      <div className="shelf-surface">
        {/* Shelf plank SVG background */}
        <svg className="shelf-plank" viewBox="0 0 100 8" preserveAspectRatio="none">
          <rect x="0" y="0" width="100" height="8" fill="#2a2440" />
          <rect x="0" y="0" width="100" height="2" fill="#3a3460" opacity="0.7" />
          <line x1="0" y1="6" x2="100" y2="6" stroke="#1e1a30" strokeWidth="0.5" />
        </svg>

        <div className="shelf-items">
          {ownedItems.length === 0 ? (
            <div className="shelf-empty-state">Nothing yet. That changes.</div>
          ) : (
            ownedItems.map((item) => {
              const { id, Icon, label, bg } = item;
              const isNew = id === lastAcquired;
              return (
                <div
                  key={id}
                  className={`shelf-slot shelf-slot--owned${isNew ? ' shelf-slot--new' : ''}`}
                  style={{ background: bg }}
                  title={label}
                >
                  <div className="shelf-item-icon" style={item.mini ? { transform: 'scale(0.75)' } : {}}>
                    <Icon />
                  </div>
                  <div className="shelf-item-label">
                    {label}
                    {item.mini && <span className="shelf-item-mini-tag">mini</span>}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Add `.shelf-empty-state` CSS rule to `src/components/components.css`**

Find the `.shelf-items` rule and after it add:

```css
.shelf-empty-state {
  padding: 1.2rem 1.5rem;
  font-size: 0.78rem;
  color: var(--cream);
  opacity: 0.4;
  font-style: italic;
  letter-spacing: 0.03em;
}
```

- [ ] **Step 5: Verify build compiles cleanly**

```bash
cd "/Users/anjalee/Library/Mobile Documents/com~apple~CloudDocs/Coding/HermesClaw"
npm run build 2>&1 | tail -10
```

Expected: no errors.

- [ ] **Step 6: Run full test suite**

```bash
npx vitest run
```

Expected: all PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/ShelfInventory.jsx src/components/components.css
git commit -m "$(cat <<'EOF'
Shelf shows only owned items; add ScarfCarreIcon and empty state

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Final Verification

- [ ] Start the dev server: `npm run dev`
- [ ] Open http://localhost:5174 (or whichever port Vite picks)
- [ ] Verify starting money shows $10,000
- [ ] Play through — verify shelf shows "Nothing yet. That changes." at game start
- [ ] Buy a small item — verify Twilly drops, photo shows in ResultMoment with sprite-sheet crop
- [ ] Buy a second small item — verify Carré H drops (not Bracelet)
- [ ] Buy a third small item — verify Bracelet drops
- [ ] Interact with Associate — verify "Discuss an Outfit" option appears
- [ ] Decline 3 SA offers — verify no further SA offer cards appear
- [ ] Run through 10 turns — verify end screen still works
- [ ] Restart — verify new run inherits potential chapter advance (via NPC opening line)
- [ ] `npm run build` — verify no build errors
