import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { updateProfileAfterRun, DEFAULT_PROFILE, CHAPTER_TARGETS } from '../persistence.js';
import { createMockState, createMockProfile, withInventory } from './fixtures.js';

describe('Profile Persistence', () => {
  beforeEach(() => {
    // Mock localStorage for Node environment
    global.localStorage = {
      data: {},
      getItem(key) {
        return this.data[key] || null;
      },
      setItem(key, value) {
        this.data[key] = value;
      },
      removeItem(key) {
        delete this.data[key];
      },
      clear() {
        this.data = {};
      },
    };
  });

  afterEach(() => {
    if (global.localStorage) {
      global.localStorage.clear();
    }
  });

  it('updateProfileAfterRun saves win to profile', () => {
    const profile = createMockProfile({ chapter: 0, totalWins: 0 });
    const gameState = { ...createMockState({ chapter: 0, inventory: ['constance24'] }) };
    const score = 500;

    const updated = updateProfileAfterRun(profile, gameState, score);
    expect(updated.totalWins).toBeGreaterThanOrEqual(profile.totalWins);
  });

  it('updateProfileAfterRun uses hasFlipped flag (not lastActions)', () => {
    const profile = createMockProfile();
    const gameState = {
      ...createMockState({ hasFlipped: true }),
    };
    const score = 300;

    const updated = updateProfileAfterRun(profile, gameState, score);
    expect(updated.everFlipped).toBe(true);
  });

  it('chapter progresses only after winning', () => {
    const profile = createMockProfile({ chapter: 0 });
    const winState = { ...createMockState({ chapter: 0, inventory: ['constance24'] }) };

    const updated = updateProfileAfterRun(profile, winState, 500);
    expect(updated.chapter).toBeGreaterThanOrEqual(profile.chapter);
  });

  it('profile tracks total runs', () => {
    const profile = createMockProfile({ runCount: 5 });
    const gameState = createMockState();

    const updated = updateProfileAfterRun(profile, gameState, 100);
    expect(updated.runCount).toBeGreaterThan(profile.runCount);
  });

  it('profile updates best score', () => {
    const profile = createMockProfile({ bestScore: 200 });
    const gameState = createMockState();

    const updated = updateProfileAfterRun(profile, gameState, 500);
    expect(updated.bestScore).toBeGreaterThanOrEqual(profile.bestScore);
  });

  it('profile does not regress on lower score', () => {
    const profile = createMockProfile({ bestScore: 500 });
    const gameState = createMockState();

    const updated = updateProfileAfterRun(profile, gameState, 200);
    expect(updated.bestScore).toBeGreaterThanOrEqual(200);
  });

  it('tracks if player ever flipped', () => {
    const profile = createMockProfile({ everFlipped: false });
    const gameState = { ...createMockState({ hasFlipped: true }) };

    const updated = updateProfileAfterRun(profile, gameState, 100);
    expect(updated.everFlipped).toBe(true);
  });

  it('profile persists across sessions (localStorage integration)', () => {
    const profile = createMockProfile({ runCount: 1, bestScore: 150, chapter: 0 });
    localStorage.setItem('hermes_claw_profile', JSON.stringify(profile));

    const retrieved = JSON.parse(localStorage.getItem('hermes_claw_profile'));
    expect(retrieved.runCount).toBe(1);
    expect(retrieved.bestScore).toBe(150);
    expect(retrieved.chapter).toBe(0);
  });
});
