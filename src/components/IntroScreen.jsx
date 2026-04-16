// src/components/IntroScreen.jsx
import { CHAPTER_NAMES } from '../persistence.js';

export default function IntroScreen({ onStart, profile }) {
  const { runCount, chapter } = profile;
  const isReturning = runCount > 0;
  const chapterName = CHAPTER_NAMES[chapter];

  function getOpeningLine() {
    if (!isReturning) return null;
    if (runCount >= 5) return chapter >= 1 ? 'I\'ve been expecting you.' : 'You\'re back. Again.';
    if (runCount >= 2) return chapter >= 1 ? 'I heard the bag found a good home.' : 'Oh. You\'re back.';
    return 'I wasn\'t sure you\'d return.';
  }

  const openingLine = getOpeningLine();
  const targetNames = { 0: 'the Constance', 1: 'the Kelly 28', 2: 'the Birkin 30' };
  const targetName  = targetNames[chapter] ?? 'the Constance';

  return (
    <div className="intro-screen">
      <div className="intro-inner">
        <div className="intro-eyebrow">
          {isReturning ? `Visit ${runCount + 1}` : 'A Game About Wanting Things'}
        </div>
        <h1 className="intro-title">Hermès Claw</h1>

        {openingLine && (
          <div className="intro-returning">
            <span className="intro-returning-label">The Associate</span>
            <p className="intro-returning-line">"{openingLine}"</p>
          </div>
        )}

        <p className="intro-premise">
          {chapter === 0 && !isReturning && <>You want a Constance bag.<br />She decides who gets one.</>}
          {chapter === 0 && isReturning  && <>You still want that Constance.<br />She still decides.</>}
          {chapter === 1 && <>You have the Constance.<br />Now she wants to see if you're serious.</>}
          {chapter === 2 && <>You know what you're doing.<br />So does she.</>}
        </p>

        {!isReturning && (
          <div className="intro-rules">
            <div className="intro-rule">
              <span className="intro-rule-label">Each turn</span>
              Choose one of three cards. Each choice has consequences — most invisible.
            </div>
            <div className="intro-rule">
              <span className="intro-rule-label">The goal</span>
              Build enough goodwill over 10 turns that she offers you {targetName}.
            </div>
            <div className="intro-rule">
              <span className="intro-rule-label">The secret</span>
              There is a pattern. You'll feel it before you understand it.
            </div>
          </div>
        )}

        {isReturning && profile.bestScore > 0 && (
          <div className="intro-stats">
            <div className="intro-stat">
              <span className="intro-stat-label">Best score</span>
              <span className="intro-stat-value">{profile.bestScore.toLocaleString()}</span>
            </div>
            <div className="intro-stat">
              <span className="intro-stat-label">Target</span>
              <span className="intro-stat-value">{chapterName}</span>
            </div>
            {profile.totalWins > 0 && (
              <div className="intro-stat">
                <span className="intro-stat-label">Acquired</span>
                <span className="intro-stat-value">{profile.totalWins}×</span>
              </div>
            )}
          </div>
        )}

        <button className="intro-start" onClick={onStart}>
          {isReturning ? 'Return to the Boutique' : 'Enter the Boutique'}
        </button>
      </div>
    </div>
  );
}
