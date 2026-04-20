import { describe, it, expect } from 'vitest';
import { ITEMS, NPC_DIALOGUE, CARD_TEMPLATES } from '../gameData.js';
import { CHAPTER_TARGETS } from '../persistence.js';

describe('ITEMS Data Structure', () => {
  it('all items have required properties', () => {
    Object.entries(ITEMS).forEach(([id, item]) => {
      expect(item.id).toBe(id);
      expect(item.name).toBeDefined();
      expect(item.description).toBeDefined();
      expect(typeof item.score).toBe('number');
      expect(item.score).toBeGreaterThanOrEqual(0);
    });
  });

  it('chapter target bags are defined', () => {
    expect(ITEMS['constance24']).toBeDefined();
    expect(ITEMS['kelly28']).toBeDefined();
    expect(ITEMS['birkin30']).toBeDefined();
  });

  it('accessories have correct scores', () => {
    expect(ITEMS['twilly'].score).toBe(50);
    expect(ITEMS['bracelet'].score).toBe(100);
    expect(ITEMS['shoes'].score).toBe(75);
    expect(ITEMS['kellyBelt'].score).toBe(200);
    expect(ITEMS['scarfCarre'].score).toBe(125);
  });

  it('chapter target bags have distinct high scores', () => {
    const scores = [
      ITEMS['constance24'].score,
      ITEMS['kelly28'].score,
      ITEMS['birkin30'].score,
    ];
    expect(scores[0]).toBeLessThan(scores[1]);
    expect(scores[1]).toBeLessThan(scores[2]);
  });

  it('mini variants have higher scores than regular bags', () => {
    expect(ITEMS['constanceMini'].score).toBeGreaterThan(ITEMS['constance24'].score);
    expect(ITEMS['kelly25'].score).toBeGreaterThan(ITEMS['kelly28'].score);
    expect(ITEMS['birkin25'].score).toBeGreaterThan(ITEMS['birkin30'].score);
  });
});

describe('NPC_DIALOGUE Data Structure', () => {
  it('dialogue organized by mood', () => {
    const moods = ['warm', 'neutral', 'cold'];
    moods.forEach(mood => {
      expect(NPC_DIALOGUE[mood]).toBeDefined();
      expect(Array.isArray(NPC_DIALOGUE[mood])).toBe(true);
    });
  });

  it('each mood has dialogue options', () => {
    const moods = ['warm', 'neutral', 'cold'];
    moods.forEach(mood => {
      expect(NPC_DIALOGUE[mood].length).toBeGreaterThan(0);
    });
  });

  it('all dialogue strings are non-empty', () => {
    Object.entries(NPC_DIALOGUE).forEach(([mood, lines]) => {
      expect(Array.isArray(lines)).toBe(true);
      lines.forEach(line => {
        expect(typeof line).toBe('string');
        expect(line.length).toBeGreaterThan(0);
      });
    });
  });
});

describe('CHAPTER_TARGETS Data Structure', () => {
  it('chapter targets are defined for chapters 0, 1, 2', () => {
    expect(CHAPTER_TARGETS[0]).toBe('constance24');
    expect(CHAPTER_TARGETS[1]).toBe('kelly28');
    expect(CHAPTER_TARGETS[2]).toBe('birkin30');
  });

  it('all chapter targets exist in ITEMS', () => {
    [0, 1, 2].forEach(chapter => {
      const target = CHAPTER_TARGETS[chapter];
      expect(ITEMS[target]).toBeDefined();
    });
  });
});

describe('Item Distribution', () => {
  it('has accessories category items', () => {
    const accessories = ['twilly', 'bracelet', 'shoes', 'kellyBelt'];
    accessories.forEach(id => {
      expect(ITEMS[id]).toBeDefined();
      expect(ITEMS[id].score).toBeGreaterThan(0);
    });
  });

  it('has everyday bag items', () => {
    const everydayBags = ['evelyneTpm', 'picotin18', 'gardenParty', 'bolide', 'roulis', 'lindy26'];
    everydayBags.forEach(id => {
      expect(ITEMS[id]).toBeDefined();
    });
  });

  it('has regular chapter bags', () => {
    const chapterBags = ['constance24', 'kelly28', 'birkin30'];
    chapterBags.forEach(id => {
      expect(ITEMS[id]).toBeDefined();
    });
  });

  it('has mini chapter variants', () => {
    const miniBags = ['constanceMini', 'kelly25', 'birkin25'];
    miniBags.forEach(id => {
      expect(ITEMS[id]).toBeDefined();
    });
  });
});

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

describe('Data Consistency', () => {
  it('no duplicate item IDs', () => {
    const ids = Object.keys(ITEMS);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('item scores are non-negative', () => {
    Object.values(ITEMS).forEach(item => {
      expect(item.score).toBeGreaterThanOrEqual(0);
    });
  });

  it('no item has a name that is just a number', () => {
    Object.values(ITEMS).forEach(item => {
      expect(isNaN(parseInt(item.name))).toBe(true);
    });
  });
});
