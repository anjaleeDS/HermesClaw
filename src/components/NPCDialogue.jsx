// src/components/NPCDialogue.jsx
import AssociatePortrait from './AssociatePortrait.jsx';

const NPC_NAMES = {
  0: 'The Associate',
  1: 'The Associate',
  2: 'The Senior Associate',
};

export default function NPCDialogue({ message, mood, chapter = 0 }) {
  return (
    <div className={`npc-dialogue npc-mood-${mood}`}>
      <div className="npc-portrait-col">
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
        <p className="npc-message">"{message || '…'}"</p>
      </div>
    </div>
  );
}
