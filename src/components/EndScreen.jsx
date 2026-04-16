// src/components/EndScreen.jsx
import { ITEMS } from '../gameData.js';

function getNudge(game) {
  const { inventory, lastActions, suspicion, favor, rareChanceBonus } = game;
  const hasBirkin    = inventory.includes('birkin');
  const neverBought  = !lastActions.includes('buy');
  const flipped      = lastActions.includes('flip');
  const highSuspicion = suspicion >= 5;
  const hadCombo     = rareChanceBonus > 0;
  const goodFavor    = favor >= 4;
  const askedEarly   = lastActions.slice(0, 2).includes('ask');

  if (hasBirkin)       return null; // won — no nudge needed

  if (highSuspicion)   return 'She seemed unsettled by something. Urgency, perhaps. Or familiarity.';
  if (neverBought)     return 'You were present. But she had no sense of your commitment.';
  if (flipped)         return 'She mentioned to a colleague that she\'d seen you before. Somewhere else.';
  if (hadCombo && goodFavor) return 'There was a moment — after a particular sequence — when something shifted. You were very close.';
  if (hadCombo)        return 'Something in your pattern caught her attention. The timing wasn\'t quite right.';
  if (goodFavor)       return 'She liked you. But liking isn\'t the same as offering.';
  if (askedEarly)      return 'She values patience above almost everything else.';
  return               'She noticed you. That\'s more than most clients can say. Come back.';
}

export default function EndScreen({ game, score, onRestart }) {
  const hasBirkin = game.inventory.includes('birkin');
  const nudge     = getNudge(game);

  function getVerdict() {
    if (hasBirkin)   return '"You have a certain… quality. We look forward to next season."';
    if (score > 400) return '"A credible effort. One develops these things over time."';
    if (score > 150) return '"Interesting. We\'ll see."';
    return           '"We prefer to build relationships slowly."';
  }

  return (
    <div className="end-screen">
      <div className="end-inner">
        <div className="end-eyebrow">End of Season</div>
        <h1 className="end-score">{score.toLocaleString()} pts</h1>
        <p className="end-verdict">{getVerdict()}</p>

        {nudge && (
          <div className="end-nudge">
            <span className="end-nudge-label">A thought</span>
            {nudge}
          </div>
        )}

        <div className="end-items">
          <div className="end-items-label">Acquired</div>
          {game.inventory.length === 0 ? (
            <div className="end-items-empty">Nothing.</div>
          ) : (
            game.inventory.map(id => (
              <div key={id} className="end-item">
                <strong>{ITEMS[id]?.name}</strong>
                {' — '}
                {ITEMS[id]?.description}
                <span className="end-item-score"> +{ITEMS[id]?.score}pts</span>
              </div>
            ))
          )}
        </div>

        <button className="end-restart" onClick={onRestart}>
          Try Again
        </button>
      </div>
    </div>
  );
}
