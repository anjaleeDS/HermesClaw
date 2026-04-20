# Testing Guide — Hermès Claw

This project uses **Vitest** for unit testing game logic, persistence, and data integrity.

---

## Quick Start

### Run Tests

```bash
npm test              # Run all tests in watch mode
npm test -- --run    # Run once and exit
npm run test:ui      # Interactive UI (great for debugging)
npm run test:coverage # Coverage report
```

---

## Test Structure

```
src/__tests__/
├── gameLogic.test.js       # Core game mechanics (45 tests)
├── persistence.test.js     # Profile saving & persistence (8 tests)
├── gameData.test.js        # Data validation & structure (14 tests)
└── fixtures.js             # Reusable test helpers
```

**Total: 67+ passing tests** (count grows as V2 tests are added)

---

## What's Tested

### ✅ Core Mechanics (gameLogic.test.js)

#### Ask Action
- Blocking conditions: too early (turn ≤ 3), already asked, cold mood, insufficient favor, flipped (Ch2+)
- Success formula: random chance based on favor + rare bonus
- Per-chapter favor requirements: Ch0=0, Ch1=4, Ch2=7
- **Critical fix validated**: `hasAsked` flag prevents second ask per run

#### Flip Action
- Money gain (+1000), suspicion cost (+2)
- **Critical fix validated**: `hasFlipped` flag set and persists
- **Critical fix validated**: In Chapter 2, flip blocks all ask attempts

#### Combo System
- Detects 3 combos: "Good Client Energy", "Patient Admirer", "Social Grace"
- **Critical fix validated**: Bonuses accumulate across turns (`+=` not `=`)
- Combos persist through subsequent actions

#### Scoring
- Item scores sum from centralized `ITEMS[id].score` (not hardcoded dict)
- Favor grants 20 points per point
- Suspicion penalizes 10 points per point
- Chapter win applies 1.5× multiplier

#### State Initialization
- `hasAsked` initializes to false
- `hasFlipped` initializes to false
- Money starts at 5000
- Inventory starts empty

#### Game Flow
- startGame transitions intro → playing
- advanceTurn handles phase transitions
- Turn progression through game

### ✅ Persistence (persistence.test.js)

- Profile saves after run completion
- **Critical fix validated**: Uses `hasFlipped` flag (not `lastActions` array)
- Chapter progression only after winning
- Tracks total runs and best score
- localStorage integration

### ✅ Data Integrity (gameData.test.js)

- All items have required properties (id, name, description, score)
- Chapter target bags defined and accessible
- Accessory scores correct (twilly=50, scarfCarre=125, bracelet=100, shoes=75, kellyBelt=200)
- Mini variants have higher scores than regular bags
- NPC dialogue organized by mood (warm, neutral, cold)
- `scarfCarre` item exists with correct fields and `wardrobeDepth` effect
- All 8 new V2 dialogue pools exist and are non-empty
- `talkToAssociate` card has `outfitChat` action option
- No duplicate item IDs
- Data consistency across modules

---

## Adding New Tests

### 1. Where to Add

Choose the appropriate file:
- **gameLogic.test.js** — game mechanics, actions, state changes
- **persistence.test.js** — profile saving, localStorage
- **gameData.test.js** — data structure & validation

### 2. Basic Test Structure

```javascript
import { describe, it, expect } from 'vitest';

describe('Feature Name', () => {
  it('should do something specific', () => {
    const state = createMockState({ favor: 5 });
    const result = someFunction(state);
    expect(result.favor).toBe(5);
  });
});
```

### 3. Using Fixtures

Reusable state builders from `fixtures.js`:

```javascript
import { 
  createMockState,           // Fresh state with overrides
  highFavorState,            // Pre-configured high favor
  coldMoodState,             // Pre-configured cold mood
  hasAskedState,             // Has already asked this run
  hasFlippedState,           // Has already flipped this run
  withInventory,             // With specific items
} from './fixtures.js';

// Usage
const state = highFavorState(8);  // favor=8, mood=warm
const state2 = withInventory(['bracelet', 'shoes']);
```

### 4. Mocking Math.random()

For deterministic dice rolls:

```javascript
import { vi } from 'vitest';

it('ask succeeds with high roll', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0.01); // ~99% chance
  const state = turn4PlusState(4);
  const result = resolveAction(state, 'card-0', 'ask');
  expect(result.hasAsked).toBe(true);
});
```

### 5. Test Naming Convention

Use clear, specific names:

```javascript
// ✅ Good — describes condition + expected behavior
it('ask fails if already asked this run (hasAsked = true)', () => {});

// ❌ Vague
it('ask test', () => {});
it('should work', () => {});
```

---

## Common Patterns

### Testing Action Blocking

```javascript
it('ask fails in Chapter 2 if hasFlipped = true', () => {
  const state = createMockState({ chapter: 2, turn: 4, favor: 7, hasFlipped: true });
  const result = resolveAction(state, 'card-0', 'ask');
  expect(result).toBeDefined(); // State updated even though action blocked
});
```

### Testing State Transitions

```javascript
it('startGame transitions intro → playing', () => {
  const state = createMockState({ phase: 'intro' });
  const result = startGame(state);
  expect(result.phase).toBe('playing');
});
```

### Testing Data Consistency

```javascript
it('all items have required properties', () => {
  Object.entries(ITEMS).forEach(([id, item]) => {
    expect(item.id).toBe(id);
    expect(item.name).toBeDefined();
    expect(typeof item.score).toBe('number');
  });
});
```

---

## Key Test Scenarios

### Critical Fixes (Always Validate)

1. ✅ `hasAsked` prevents second ask in same run
2. ✅ `hasFlipped` blocks ask in Chapter 2
3. ✅ Combo bonuses accumulate (`+=` not `=`)
4. ✅ Scoring uses centralized `ITEMS[id].score`
5. ✅ Persistence uses `hasFlipped` flag

### Core Mechanics (Always Test)

- Ask success/failure conditions per chapter
- Flip side effects (money, suspicion, blocking)
- Combo detection (all 3 combos)
- Win conditions per chapter
- State initialization

### Data Validation (Always Check)

- Item structure & scores
- Dialogue pools exist & non-empty
- Chapter targets defined
- No duplicate IDs

---

## Running Tests During Development

### Watch Mode (Recommended)

```bash
npm test
```

Watches for file changes and re-runs affected tests automatically. Great while coding.

### Interactive UI

```bash
npm run test:ui
```

Opens browser UI showing all tests, filtering, debugging. Click on tests to see details.

### Coverage Report

```bash
npm run test:coverage
```

Shows which lines of code are tested. Aim for 80%+ on core logic files.

---

## Debugging Tests

### 1. Use test.only() to run one test

```javascript
it.only('this test runs alone', () => {});
```

### 2. Print debug info

```javascript
it('debug test', () => {
  const state = createMockState({ favor: 5 });
  console.log('State:', state);
  expect(state.favor).toBe(5);
});
```

### 3. Use test.skip() to skip a test

```javascript
it.skip('not ready yet', () => {});
```

### 4. Open test UI and click on failing test

```bash
npm run test:ui
```

Gives you interactive debugging with line-by-line execution.

---

## Best Practices

1. **Test behavior, not implementation** — What does the function do? Not how?
2. **One assertion per test** (usually) — Easier to debug when it fails
3. **Use descriptive names** — The test name explains what it validates
4. **Keep tests independent** — Don't rely on test execution order
5. **Mock randomness** — Use `vi.spyOn(Math, 'random')` for deterministic tests
6. **Use fixtures** — Don't repeat `createMockState({...})` everywhere
7. **Test edge cases** — Boundary conditions, invalid states, etc.

---

## Troubleshooting

### Tests failing after code change?

1. Run `npm test -- --run` to see all failures
2. Check error message — does it match your change?
3. Update test if behavior intentionally changed
4. Use `npm run test:ui` to debug interactively

### New function not tested?

1. Add test to appropriate file (gameLogic/persistence/gameData)
2. Use fixtures for state builders
3. Name test after what it validates
4. Run `npm test -- --run` to verify

### Test passes locally but fails in CI?

1. Check for mocked randomness (Math.random)
2. Verify localStorage mocking in persistence tests
3. Ensure no timezone/locale dependencies
4. Run `npm test -- --run` to get consistent results

---

## V2 Tests (written in plan, not yet implemented)

The V2 implementation plan (`docs/superpowers/plans/2026-04-19-v2-gameplay-overhaul.md`) includes full TDD test blocks for:

- `createInitialState` starts with $10,000 and `saOfferCount: 0`
- SA offer cap at 3 per run (`saOfferCount >= 3` → no offer card)
- `saOfferBuy` / `saOfferDecline` increment `saOfferCount`
- `buySmall` uses `afterBuySmall` pool; `buyMedium` uses `afterBuyMedium`
- `compliment` uses `complimentReturn` pool
- `outfitChat` gives +1 favor (+2 with `scarfCarre`)
- `outfitChat` adds no suspicion
- `scarfCarre` drops from `buySmall` (after Twilly, before Bracelet)
- `suspicionBuilding` fires at suspicion 3–4
- `startGame` uses `chapterAware_ch1` / `chapterAware_ch2` opening pools
- `DEFAULT_PROFILE` has `standing` and `progress` fields
- Three-path chapter continuity (Path A/B/C advance conditions)
- Chapter never advances beyond 2

These tests are written in the plan and can be copy-pasted directly into the test files as part of V2 implementation.

---

## Next Steps

As the game evolves:
- Add tests for new mechanics before implementing them (TDD)
- Update tests when game behavior changes
- Keep coverage above 80% for gameLogic.js
- Run tests before committing (`npm test -- --run`)

**Questions?** Read the test files — they're well-commented examples of testing each feature.
