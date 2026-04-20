// src/components/EndScreen.jsx
import { ITEMS } from '../gameData.js';
import { CHAPTER_NAMES, CHAPTER_WIN_BAGS } from '../persistence.js';

function didWin(inventory, chapter) {
  return (CHAPTER_WIN_BAGS[chapter] ?? []).some(id => inventory.includes(id));
}

function getNudge(game) {
  const { inventory, lastActions, suspicion, favor, rareChanceBonus, chapter } = game;
  const won           = didWin(inventory, chapter);
  const neverBought   = !lastActions.includes('buy');
  const flipped       = lastActions.includes('flip');
  const highSuspicion = suspicion >= 5;
  const hadCombo      = rareChanceBonus > 0;
  const goodFavor     = favor >= 4;
  const askedEarly    = lastActions.slice(0, 2).includes('ask');

  if (won) return null;

  if (chapter === 1 && favor < 4) return 'She requires more than goodwill this time. A deeper familiarity.';
  if (chapter === 2 && flipped)   return 'She\'d heard you\'d been selling. That changes things considerably.';
  if (chapter === 2 && favor < 7) return 'For the Birkin, she needs to be certain. Trust takes time.';

  if (highSuspicion)  return 'She seemed unsettled by something. Urgency, perhaps. Or familiarity.';
  if (neverBought)    return 'You were present. But she had no sense of your commitment.';
  if (flipped)        return 'She mentioned to a colleague that she\'d seen you before. Somewhere else.';
  if (hadCombo && goodFavor) return 'There was a moment — after a particular sequence — when something shifted. You were very close.';
  if (hadCombo)       return 'Something in your pattern caught her attention. The timing wasn\'t quite right.';
  if (goodFavor)      return 'She liked you. But liking isn\'t the same as offering.';
  if (askedEarly)     return 'She values patience above almost everything else.';
  return              'She noticed you. That\'s more than most clients can say. Come back.';
}

export default function EndScreen({ game, score, profile, onRestart }) {
  const won         = didWin(game.inventory, game.chapter ?? 0);
  const nudge       = getNudge(game);
  const nextChapter = won && (game.chapter ?? 0) < 2 ? (game.chapter ?? 0) + 1 : null;

  function getVerdict() {
    if (won && game.chapter === 0) return '"A very good choice. We look forward to seeing you again."';
    if (won && game.chapter === 1) return '"I knew you\'d find your way back to something worthy of you."';
    if (won && game.chapter === 2) return '"You understand us completely. That is very rare."';
    if (score > 400) return '"A credible effort. One develops these things over time."';
    if (score > 150) return '"Interesting. We\'ll see."';
    return '"We prefer to build relationships slowly."';
  }

  return (
    <div className="end-screen">
      <div className="end-inner">
        <div className="end-eyebrow">End of Season</div>
        <h1 className="end-score">{score.toLocaleString()} pts</h1>
        {profile.bestScore > 0 && score >= profile.bestScore && (
          <div className="end-best-score">Personal best</div>
        )}
        <p className="end-verdict">{getVerdict()}</p>

        {nextChapter !== null && (
          <div className="end-chapter-unlock">
            <span className="end-chapter-unlock-label">New chapter unlocked</span>
            <span className="end-chapter-unlock-name">{CHAPTER_NAMES[nextChapter]}</span>
            <p className="end-chapter-unlock-desc">
              {nextChapter === 1 && 'She knows you now. The rules have changed.'}
              {nextChapter === 2 && 'You\'re a serious client. She will treat you accordingly.'}
            </p>
          </div>
        )}

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
                <strong>{ITEMS[id]?.name}</strong>{' — '}
                {ITEMS[id]?.description}
                <span className="end-item-score"> +{ITEMS[id]?.score}pts</span>
              </div>
            ))
          )}
        </div>

        <button className="end-restart" onClick={onRestart}>
          {won && nextChapter !== null ? `Begin Chapter ${nextChapter + 1} →` : 'Try Again'}
        </button>
      </div>
    </div>
  );
}
