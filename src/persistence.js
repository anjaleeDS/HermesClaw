// src/persistence.js
const KEY = 'hermes_claw_profile';

export const DEFAULT_PROFILE = {
  runCount: 0,          // total runs ever started
  bestScore: 0,         // highest score ever
  chapter: 0,           // 0=Constance, 1=Kelly, 2=Birkin
  totalWins: 0,         // times any chapter bag was acquired
  everFlipped: false,   // did player ever use secondary market (lifetime)
  askedEarlyCount: 0,   // times asked before turn 3 (lifetime)
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

export function updateProfileAfterRun(profile, gameState, score) {
  // Win = acquiring the regular-size chapter bag (not just mini)
  const targetBag  = CHAPTER_TARGETS[profile.chapter];
  const won        = gameState.inventory.includes(targetBag);
  const flipped    = gameState.hasFlipped;
  const askedEarly = gameState.lastActions.slice(0, 2).includes('ask');

  return {
    ...profile,
    runCount:        profile.runCount + 1,
    bestScore:       Math.max(profile.bestScore, score),
    totalWins:       won ? profile.totalWins + 1 : profile.totalWins,
    chapter:         won ? Math.min(2, profile.chapter + 1) : profile.chapter,
    everFlipped:     profile.everFlipped || flipped,
    askedEarlyCount: askedEarly ? profile.askedEarlyCount + 1 : profile.askedEarlyCount,
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
