// src/gameLogic.js
import { CARD_TEMPLATES, NPC_DIALOGUE, ITEMS, EVERYDAY_BAGS } from './gameData.js';

// ─────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────

export function createInitialState(playerProfile = null) {
  const profile = playerProfile ?? { runCount: 0, chapter: 0 };
  return {
    phase: 'intro',          // 'intro' | 'playing' | 'result' | 'end'
    turn: 1,                 // 1–10
    money: 10000,
    inventory: [],           // array of item ids
    lastActions: [],         // rolling last 3 action strings
    hasAsked: false,         // true once player asks this run (prevents re-ask)
    hasFlipped: false,       // true once player flips this run (blocks Ch2 ask)
    favor: profile.chapter >= 1 ? 1 : 0,  // known client gets a head start
    suspicion: 0,            // 0–10, hidden from player
    npcMood: 'neutral',      // 'warm' | 'neutral' | 'cold'
    rareChanceBonus: 0,      // added by combos
    currentCards: [],        // 3 card objects for this turn
    pendingCards: [],        // next turn's cards, ready after result phase
    currentOffer: null,      // everyday bag id offered this turn (for saOffer card)
    pendingOffer: null,      // everyday bag id for next turn's saOffer
    saOfferCount: 0,         // tracks SA everyday offers shown this run
    lastNPCMessage: '',
    actionSummary: null,     // { moneyDelta, newItem } — visible feedback
    chapter: profile.chapter,    // 0=Constance, 1=Kelly, 2=Birkin
    runCount: profile.runCount,  // drives NPC opening dialogue
  };
}

// Move from intro → playing
export function startGame(state) {
  const s = { ...state, phase: 'playing' };
  const { cards: startCards, offer: startOffer } = generateCards(s);
  s.currentCards = startCards;
  s.currentOffer = startOffer;

  // Wire opening dialogue to returning player pools
  function getOpeningPool(runCount, chapter) {
    if (chapter === 2) return 'chapterAware_ch2';
    if (chapter === 1) return 'chapterAware_ch1';
    if (runCount >= 5) return 'loyalClient';
    if (runCount >= 1) return 'returningClient';
    return null; // first ever visit
  }

  const pool = getOpeningPool(s.runCount, s.chapter);
  s.lastNPCMessage = pool
    ? pickDialogue(pool, s.npcMood)
    : 'Good afternoon. Welcome.';

  return s;
}

// Move from result → playing (or end)
export function advanceTurn(state) {
  if (state.turn > 10) {
    return { ...state, phase: 'end' };
  }
  return {
    ...state,
    phase: 'playing',
    currentCards: state.pendingCards,
    currentOffer: state.pendingOffer,
    actionSummary: null,
  };
}

// ─────────────────────────────────────────────
// CARD GENERATION (state-weighted)
// ─────────────────────────────────────────────

export function generateCards(state) {
  // Cap SA everyday offers at 3 per run
  const unownedEveryday = (state.saOfferCount ?? 0) >= 3
    ? []
    : EVERYDAY_BAGS.filter(id => !state.inventory.includes(id));
  const offerItemId = unownedEveryday.length > 0
    ? unownedEveryday[Math.floor(Math.random() * unownedEveryday.length)]
    : null;

  // Clone templates with adjustable weights
  const weighted = CARD_TEMPLATES.map(card => ({
    ...card,
    weight: card.baseWeight,
  }));

  // Lucky Moment: more likely when favor is high, less when suspicion is high
  const lucky = weighted.find(c => c.id === 'luckyMoment');
  if (lucky) {
    lucky.weight = Math.max(0, 1 + Math.floor(state.favor / 2) - Math.floor(state.suspicion / 2));
  }

  // Cold Shoulder: only appears when suspicion >= 4
  const cold = weighted.find(c => c.id === 'coldShoulder');
  if (cold) {
    cold.weight = state.suspicion >= 4 ? 3 : 0;
  }

  // Secondary Market: disappears when suspicion is high (she's watching)
  const market = weighted.find(c => c.id === 'secondaryMarket');
  if (market) {
    market.weight = state.suspicion >= 3 ? 0 : 1;
  }

  // Build weighted pool
  const pool = [];
  for (const card of weighted) {
    for (let i = 0; i < card.weight; i++) {
      pool.push(card);
    }
  }

  // SA Offer: dynamic card weighted by favor — appears once there's some rapport
  if (offerItemId) {
    const item = ITEMS[offerItemId];
    const offerWeight = Math.max(0, 1 + Math.floor(state.favor / 3));
    const saOfferCard = {
      id: 'saOffer',
      type: 'saOffer',
      title: 'The Associate Offers',
      subtitle: `"We have a ${item.name} available."`,
      weight: offerWeight,
      options: [
        { label: `Purchase — $${item.price.toLocaleString()}`, action: 'saOfferBuy', cost: item.price },
        { label: 'Perhaps another time', action: 'saOfferDecline', cost: 0 },
      ],
    };
    for (let i = 0; i < offerWeight; i++) pool.push(saOfferCard);
  }

  // Shuffle and pick 3 unique card types
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const seen = new Set();
  const picked = [];
  for (const card of shuffled) {
    if (!seen.has(card.id) && picked.length < 3) {
      seen.add(card.id);
      picked.push(card);
    }
  }

  // Fallback: pad with Boutique Visit if pool was too thin
  while (picked.length < 3) {
    picked.push(CARD_TEMPLATES.find(c => c.id === 'boutiqueVisit'));
  }

  return { cards: picked, offer: offerItemId };
}

// ─────────────────────────────────────────────
// COMBO DETECTION
// ─────────────────────────────────────────────

export function checkCombos(lastActions) {
  const last3 = lastActions.slice(-3);
  let rareBonus    = 0;
  let favorBurst   = 0;
  let suspicionDrop = 0;
  let comboFired   = false;

  // Combo 1: buy → buy → chat  ("Good Client Energy")
  // Spending AND socialising — you're not just a wallet
  if (last3[0]==='buy' && last3[1]==='buy' && last3[2]==='chat') {
    rareBonus  = 0.35;
    comboFired = true;
  }

  // Combo 2: wait → chat → buy  ("Patient Admirer")
  // Restraint, then connection, then commitment — the trust arc
  if (last3[0]==='wait' && last3[1]==='chat' && last3[2]==='buy') {
    rareBonus    = Math.max(rareBonus, 0.20);
    favorBurst   = 2;
    comboFired   = true;
  }

  // Combo 3: chat → chat → chat  ("Social Grace")
  // Pure relationship — she can't help but warm to you
  if (last3[0]==='chat' && last3[1]==='chat' && last3[2]==='chat') {
    favorBurst    = Math.max(favorBurst, 3);
    suspicionDrop = 2;
    comboFired    = true;
  }

  return { rareBonus, favorBurst, suspicionDrop, comboFired };
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function pickDialogue(context, npcMood) {
  const lines = NPC_DIALOGUE[context] || NPC_DIALOGUE[npcMood] || NPC_DIALOGUE.neutral;
  return lines[Math.floor(Math.random() * lines.length)];
}

function appendAction(lastActions, action) {
  return [...lastActions, action].slice(-3);
}

function updateMood(favor, suspicion) {
  if (suspicion >= 5) return 'cold';
  if (favor >= 4) return 'warm';
  return 'neutral';
}

// ─────────────────────────────────────────────
// ACTION RESOLUTION
// ─────────────────────────────────────────────

export function resolveAction(state, cardId, action) {
  let s = { ...state };
  let message = '';
  const moneyBefore = s.money;
  const inventoryBefore = [...s.inventory];

  // Inventory-based passive bonuses
  const hasTwilly    = s.inventory.includes('twilly');
  const hasBracelet  = s.inventory.includes('bracelet');
  const hasShoes     = s.inventory.includes('shoes');
  const hasKellyBelt = s.inventory.includes('kellyBelt');

  const socialBonus     = hasTwilly   ? 1 : 0;
  const reputationBonus = hasBracelet ? 1 : 0;

  // Committed client: owning all 4 non-birkin items adds base rare chance
  const allFour = hasTwilly && hasBracelet && hasShoes && hasKellyBelt;
  const committedClientBonus = allFour ? 0.10 : 0;

  let isSocialAction = false;
  let isBuyAction = false;

  switch (action) {

    case 'buySmall': {
      isBuyAction = true;
      if (s.money < 500) {
        message = 'Your card was declined. Discreetly.';
        s.suspicion = Math.min(10, s.suspicion + 1);
        break;
      }
      s.money -= 500;
      s.favor = Math.min(10, s.favor + 1 + reputationBonus);
      if (hasShoes) s.suspicion = Math.max(0, s.suspicion - 1);
      const smallItems = ['twilly', 'scarfCarre', 'bracelet'].filter(i => !s.inventory.includes(i));
      if (smallItems.length > 0) s.inventory = [...s.inventory, smallItems[0]];
      s.lastActions = appendAction(s.lastActions, 'buy');
      message = pickDialogue('afterBuySmall', s.npcMood);
      break;
    }

    case 'buyMedium': {
      isBuyAction = true;
      if (s.money < 1500) {
        message = 'Your card was declined. Discreetly.';
        s.suspicion = Math.min(10, s.suspicion + 1);
        break;
      }
      s.money -= 1500;
      s.favor = Math.min(10, s.favor + 2 + reputationBonus);
      if (hasShoes) s.suspicion = Math.max(0, s.suspicion - 1);
      const mediumItems = ['shoes', 'kellyBelt'].filter(i => !s.inventory.includes(i));
      if (mediumItems.length > 0) s.inventory = [...s.inventory, mediumItems[0]];
      s.lastActions = appendAction(s.lastActions, 'buy');
      message = pickDialogue('afterBuyMedium', s.npcMood);
      break;
    }

    case 'leave': {
      s.lastActions = appendAction(s.lastActions, 'leave');
      message = 'You leave. Nothing is said. Something is felt.';
      break;
    }

    case 'ask': {
      const tooEarly    = s.turn <= 3;
      const askedBefore = s.hasAsked;

      // Harder each chapter: Ch0 none, Ch1 favor>=4, Ch2 favor>=7
      const favorRequired  = s.chapter === 0 ? 0 : s.chapter === 1 ? 4 : 7;
      const notEnoughFavor = s.favor < favorRequired;

      // Ch2 rule: any flip this run disqualifies the ask entirely
      const flippedThisRun = s.chapter >= 2 && s.hasFlipped;

      if (tooEarly || askedBefore || s.npcMood === 'cold' || notEnoughFavor || flippedThisRun) {
        s.suspicion = Math.min(10, s.suspicion + 2);
        message = pickDialogue('afterAsk', s.npcMood);
      } else {
        const chance    = 0.05 + (s.favor * 0.05) + s.rareChanceBonus + committedClientBonus;
        // Regular win targets per chapter (ascending rarity)
        const targetBag = ['constance24', 'kelly28', 'birkin30'][s.chapter] ?? 'constance24';
        const bagPrice = ITEMS[targetBag]?.price ?? 0;
        if (Math.random() < chance && !s.inventory.includes(targetBag) && s.money >= bagPrice) {
          s.inventory = [...s.inventory, targetBag];
          s.money -= bagPrice;
          const winMessages = {
            constance24: 'She steps away for a moment. Returns with a slim box tied in ribbon. "I thought of you."',
            kelly28:     'She unlocks a cabinet you\'ve never seen opened. "I\'ve been waiting for the right person."',
            birkin30:    'She disappears behind a curtain. Returns with something wrapped in orange. "For you."',
          };
          message = winMessages[targetBag];
        } else {
          s.suspicion = Math.min(10, s.suspicion + 1);
          message = pickDialogue('afterAsk', s.npcMood);
        }
      }
      s.hasAsked = true;
      s.lastActions = appendAction(s.lastActions, 'ask');
      break;
    }

    case 'chat': {
      isSocialAction = true;
      // Bracelet = recognized client — chatting means more
      const chatFavorBonus = hasBracelet ? 1 : 0;
      s.favor = Math.min(10, s.favor + 1 + socialBonus + chatFavorBonus);
      s.lastActions = appendAction(s.lastActions, 'chat');
      message = pickDialogue('afterChat', s.npcMood);
      break;
    }

    case 'compliment': {
      isSocialAction = true;
      const complimentBonus = hasKellyBelt ? 2 : 1;
      s.favor = Math.min(10, s.favor + complimentBonus + socialBonus);
      s.lastActions = appendAction(s.lastActions, 'chat');
      message = pickDialogue('complimentReturn', s.npcMood);
      break;
    }

    case 'outfitChat': {
      isSocialAction = true;
      const hasScarfCarre = s.inventory.includes('scarfCarre');
      const outfitBonus = hasScarfCarre ? 2 : 1;
      s.favor = Math.min(10, s.favor + outfitBonus + socialBonus);
      s.lastActions = appendAction(s.lastActions, 'chat');
      message = pickDialogue('outfitChat', s.npcMood);
      break;
    }

    case 'wait': {
      // Twilly = effortless energy — waiting costs nothing socially
      const waitSuspicionDrop = hasTwilly ? 2 : 1;
      s.suspicion = Math.max(0, s.suspicion - waitSuspicionDrop);
      s.lastActions = appendAction(s.lastActions, 'wait');
      message = pickDialogue('afterWait', s.npcMood);
      break;
    }

    case 'flip': {
      s.money += 1000;
      s.suspicion = Math.min(10, s.suspicion + 2);
      s.hasFlipped = true;
      s.lastActions = appendAction(s.lastActions, 'flip');
      message = pickDialogue('afterFlip', s.npcMood);
      break;
    }

    case 'declineFlip': {
      s.favor = Math.min(10, s.favor + 1);
      s.lastActions = appendAction(s.lastActions, 'leave');
      message = 'You decline. This was noted.';
      break;
    }

    case 'risk': {
      const rareChance = 0.12 + (s.favor * 0.06) + s.rareChanceBonus + committedClientBonus;
      // Mini targets per chapter (ultra-rare — harder than regular ask win)
      const miniTarget = ['constanceMini', 'kelly25', 'birkin25'][s.chapter] ?? 'constanceMini';
      const roll = Math.random();
      const miniPrice = ITEMS[miniTarget]?.price ?? 0;
      if (roll < rareChance && !s.inventory.includes(miniTarget) && s.money >= miniPrice) {
        s.inventory = [...s.inventory, miniTarget];
        s.money -= miniPrice;
        const miniMessages = {
          constanceMini: 'A moment of luck. She produces something small, perfect, unexpected.',
          kelly25:       'Against all reason, she opens a second drawer. "We had one left. Now we don\'t."',
          birkin25:      'Against all odds, the moment opens. An orange box appears.',
        };
        message = miniMessages[miniTarget];
      } else if (roll < rareChance + 0.28) {
        const bonusItems = ['twilly', 'bracelet', 'shoes', 'kellyBelt'].filter(i => !s.inventory.includes(i));
        if (bonusItems.length > 0) {
          s.inventory = [...s.inventory, bonusItems[0]];
          message = 'Not what you came for. But something.';
        } else {
          message = 'Nothing materializes. The moment closes.';
        }
      } else {
        s.suspicion = Math.min(10, s.suspicion + 1);
        message = 'A misstep. She notices.';
      }
      s.lastActions = appendAction(s.lastActions, 'risk');
      break;
    }

    case 'safe': {
      s.favor = Math.min(10, s.favor + 1);
      s.lastActions = appendAction(s.lastActions, 'wait');
      message = 'Restraint noted. In this world, that is everything.';
      break;
    }

    case 'apologize': {
      s.suspicion = Math.max(0, s.suspicion - 1);
      s.favor     = Math.max(0, s.favor - 1);
      s.lastActions = appendAction(s.lastActions, 'wait');
      message = 'She accepts your apology with the minimum visible effort.';
      break;
    }

    case 'leaveQuietly': {
      s.suspicion = Math.max(0, s.suspicion - 2);
      s.lastActions = appendAction(s.lastActions, 'leave');
      message = 'Sometimes leaving is the right move.';
      break;
    }

    case 'saOfferBuy': {
      isBuyAction = true;
      const itemId = s.currentOffer;
      const item = ITEMS[itemId];
      if (!itemId || !item || s.inventory.includes(itemId)) {
        message = 'The moment has passed.';
        break;
      }
      if (s.money < item.price) {
        message = 'Your card was declined. Discreetly.';
        s.suspicion = Math.min(10, s.suspicion + 1);
        break;
      }
      s.money -= item.price;
      s.inventory = [...s.inventory, itemId];
      s.favor = Math.min(10, s.favor + 1);
      s.lastActions = appendAction(s.lastActions, 'buy');
      message = `She presents the ${item.name}. "A very good choice."`;
      s.saOfferCount = (s.saOfferCount ?? 0) + 1;
      break;
    }

    case 'saOfferDecline': {
      s.favor = Math.min(10, s.favor + 1);
      s.lastActions = appendAction(s.lastActions, 'wait');
      s.saOfferCount = (s.saOfferCount ?? 0) + 1;
      message = pickDialogue('saOfferDecline', s.npcMood);
      break;
    }

    default:
      message = 'Nothing happens.';
  }

  // Evaluate combos after action — accumulate rare bonus across the run
  const { rareBonus, favorBurst, suspicionDrop, comboFired } = checkCombos(s.lastActions);
  s.rareChanceBonus += rareBonus;

  if (favorBurst > 0)   s.favor     = Math.min(10, s.favor + favorBurst);
  if (suspicionDrop > 0) s.suspicion = Math.max(0, s.suspicion - suspicionDrop);

  // When a combo fires, the NPC hints — without explaining why
  if (comboFired && s.npcMood !== 'cold') {
    message = pickDialogue('comboHint', s.npcMood);
  }

  // itemSynergy: owning 2+ items + social action = occasional observation
  // Gated on suspicion <= 2 so it is not silently overridden by suspicionBuilding
  if (s.inventory.length >= 2 && isSocialAction && s.suspicion <= 2 && Math.random() < 0.4 && s.npcMood !== 'cold') {
    message = pickDialogue('itemSynergy', s.npcMood);
  }

  // suspicionBuilding: suspicion at 3–4, but not when player just made a purchase
  // (buy actions have their own dedicated dialogue pools that should not be overridden)
  if (s.suspicion >= 3 && s.suspicion <= 4 && !isBuyAction) {
    message = pickDialogue('suspicionBuilding', s.npcMood);
  }

  // High suspicion overrides the message with a pointed observation
  if (s.suspicion >= 6) {
    message = pickDialogue('highSuspicion', s.npcMood);
  }

  // Update NPC mood based on new favor/suspicion
  s.npcMood = updateMood(s.favor, s.suspicion);

  // Advance turn counter
  s.turn += 1;
  s.lastNPCMessage = message;

  // Build visible feedback summary
  const newItem = s.inventory.find(id => !inventoryBefore.includes(id)) ?? null;
  s.actionSummary = {
    moneyDelta: s.money - moneyBefore,
    newItem,
  };

  // Go to result phase — player must press Continue to see next cards
  if (s.turn > 10) {
    s.phase = 'end';
  } else {
    s.phase = 'result';
    const { cards: nextCards, offer: nextOffer } = generateCards(s);
    s.pendingCards = nextCards;
    s.pendingOffer = nextOffer;
  }

  return s;
}

// ─────────────────────────────────────────────
// SCORING
// ─────────────────────────────────────────────

export function calculateScore(state) {
  // Win = having the regular-size bag for the current chapter
  const chapterTarget    = ['constance24', 'kelly28', 'birkin30'][state.chapter] ?? 'constance24';
  const won              = state.inventory.includes(chapterTarget);
  const itemScore        = state.inventory.reduce((sum, id) => sum + (ITEMS[id]?.score ?? 0), 0);
  const favorScore       = state.favor * 20;
  const suspicionPenalty = state.suspicion * 10;
  const multiplier       = won ? 1.5 : 1;

  return Math.max(0, Math.round((itemScore + favorScore - suspicionPenalty) * multiplier));
}
