// src/App.jsx
import { useState } from 'react';
import {
  createInitialState, startGame, resolveAction,
  advanceTurn, calculateScore,
} from './gameLogic.js';
import { loadProfile, saveProfile, updateProfileAfterRun } from './persistence.js';
import IntroScreen    from './components/IntroScreen.jsx';
import GameHeader     from './components/GameHeader.jsx';
import NPCDialogue    from './components/NPCDialogue.jsx';
import CardRow        from './components/CardRow.jsx';
import ResultMoment   from './components/ResultMoment.jsx';
import ShelfInventory from './components/ShelfInventory.jsx';
import EndScreen      from './components/EndScreen.jsx';
import './index.css';

export default function App() {
  const [profile, setProfile] = useState(() => loadProfile());
  const [game, setGame]       = useState(() => createInitialState(loadProfile()));

  function handleStart() {
    setGame(prev => startGame(prev));
  }

  function handleAction(cardId, action) {
    setGame(prev => resolveAction(prev, cardId, action));
  }

  function handleContinue() {
    setGame(prev => advanceTurn(prev));
  }

  function handleRestart() {
    const score   = calculateScore(game);
    const updated = updateProfileAfterRun(profile, game, score);
    saveProfile(updated);
    setProfile(updated);
    setGame(createInitialState(updated));
  }

  const endScore = game.phase === 'end' ? calculateScore(game) : 0;

  if (game.phase === 'intro') {
    return <IntroScreen onStart={handleStart} profile={profile} />;
  }

  if (game.phase === 'end') {
    return (
      <EndScreen
        game={game}
        score={endScore}
        profile={profile}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="game-shell">
      <GameHeader money={game.money} turn={game.turn} chapter={game.chapter ?? 0} />
      {game.phase === 'result' ? (
        <ResultMoment
          message={game.lastNPCMessage}
          mood={game.npcMood}
          summary={game.actionSummary}
          onContinue={handleContinue}
          turn={game.turn}
          chapter={game.chapter ?? 0}
          runCount={game.runCount ?? 0}
        />
      ) : (
        <>
          <NPCDialogue
            message={game.lastNPCMessage}
            mood={game.npcMood}
            chapter={game.chapter ?? 0}
          />
          <div className="your-move-section">
            <div className="your-move-label">Your move this turn</div>
            <CardRow cards={game.currentCards} onAction={handleAction} money={game.money} />
          </div>
        </>
      )}
      <ShelfInventory
        inventory={game.inventory}
        lastAcquired={game.actionSummary?.newItem ?? null}
      />
    </div>
  );
}
