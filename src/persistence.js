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

// Accessory IDs — used by Path B milestone check
const ACCESSORY_IDS = ['twilly', 'scarfCarre', 'bracelet', 'shoes', 'kellyBelt'];

// Everyday bag IDs — used by Path C progress
const EVERYDAY_BAG_IDS = ['evelyneTpm', 'picotin18', 'gardenParty', 'bolide', 'roulis', 'lindy26'];

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
      // Path A — Relationship Carry: standing accumulates from favor, decays 10% per run
      newStanding = Math.round(newStanding * 0.9) + Math.floor(favor / 2);
      newStanding = Math.min(30, newStanding);
      if (newStanding >= 12) pathAdvanced = true;

    } else if (pathRoll < 0.66) {
      // Path B — Milestone Unlock: high favor + 2+ accessories
      const accessoriesOwned = inventory.filter(id => ACCESSORY_IDS.includes(id)).length;
      if (favor >= 6 && accessoriesOwned >= 2) pathAdvanced = true;

    } else {
      // Path C — Cumulative Progress: everyday bag acquired adds +1 to progress counter
      const hasEverydayBag = inventory.some(id => EVERYDAY_BAG_IDS.includes(id));
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

// Regular-size bag win condition per chapter
export const CHAPTER_TARGETS = {
  0: 'constance24',
  1: 'kelly28',
  2: 'birkin30',
};

// Chapter display names (shown in header + end screen)
export const CHAPTER_NAMES = {
  0: 'The Constance',
  1: 'The Kelly 28',
  2: 'The Birkin 30',
};
