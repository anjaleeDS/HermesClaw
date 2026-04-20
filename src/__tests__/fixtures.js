// Test fixtures and state builders for reuse across tests
import { createInitialState } from '../gameLogic.js';

export function createMockState(overrides = {}) {
  const base = createInitialState();
  return { ...base, ...overrides };
}

export function createMockProfile(overrides = {}) {
  return {
    runCount: 0,
    bestScore: 0,
    chapter: 0,
    totalWins: 0,
    everFlipped: false,
    askedEarlyCount: 0,
    standing: 0,
    progress: 0,
    ...overrides,
  };
}

// State builders for specific scenarios
export function highFavorState(favor = 8) {
  return createMockState({ favor, npcMood: 'warm' });
}

export function coldMoodState(suspicion = 8) {
  return createMockState({ suspicion, npcMood: 'cold' });
}

export function turn4PlusState(turn = 4) {
  return createMockState({ turn });
}

export function chapter2State() {
  return createMockState({ chapter: 2 });
}

export function withInventory(items = []) {
  return createMockState({ inventory: items });
}

export function hasAskedState() {
  return createMockState({ hasAsked: true });
}

export function hasFlippedState() {
  return createMockState({ hasFlipped: true });
}

export function withMoney(amount = 3000) {
  return createMockState({ money: amount });
}

export function withComboBonus(rareChanceBonus = 0.5) {
  return createMockState({ rareChanceBonus });
}

export function chapter1State() {
  return createMockState({ chapter: 1, favor: 1 });
}

export function withScarfCarre() {
  return createMockState({ inventory: ['scarfCarre'] });
}
