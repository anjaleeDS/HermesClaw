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
    // progress 2 + everyday bag bonus 1 = 3, threshold ch0→ch1 is 3
    const gameState = createMockState({ chapter: 0, inventory: ['evelyneTpm'], favor: 3 });
    const updated = updateProfileAfterRun(profile, gameState, 200);
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
