// src/components/ResultMoment.jsx
import { ITEMS } from '../gameData.js';
import AssociatePortrait from './AssociatePortrait.jsx';

const NPC_NAMES = { 0: 'The Associate', 1: 'The Associate', 2: 'The Senior Associate' };

export default function ResultMoment({ message, mood, summary, onContinue, turn, chapter = 0 }) {
  const { moneyDelta, newItem } = summary ?? {};

  return (
    <div className="result-moment">
      <div className={`result-dialogue npc-mood-${mood}`}>
        <div className="npc-portrait-col result-portrait-col">
          <AssociatePortrait mood={mood} chapter={chapter} />
        </div>
        <div className="npc-speech-col">
          <div className="npc-header">
            <span className="npc-name">{NPC_NAMES[chapter] ?? 'The Associate'}</span>
            <span className={`npc-mood-tag npc-mood-tag--${mood}`}>
              {mood === 'warm'    && 'receptive'}
              {mood === 'neutral' && 'composed'}
              {mood === 'cold'    && 'displeased'}
            </span>
          </div>
          <p className="result-message">"{message || '…'}"</p>
        </div>
      </div>

      <div className="result-feedback">
        {moneyDelta !== 0 && moneyDelta != null && (
          <div className={`result-delta ${moneyDelta < 0 ? 'delta-negative' : 'delta-positive'}`}>
            {moneyDelta > 0 ? '+' : ''}${Math.abs(moneyDelta).toLocaleString()}
          </div>
        )}
        {newItem && (
          <div className="result-item-gained">
            <span className="result-item-label">Acquired</span>
            <span className="result-item-name">{ITEMS[newItem]?.name}</span>
            <span className="result-item-desc">{ITEMS[newItem]?.description}</span>
          </div>
        )}
      </div>

      <button className="result-continue" onClick={onContinue}>
        {turn > 10 ? 'See Results →' : `Continue — Turn ${turn} of 10 →`}
      </button>
    </div>
  );
}
