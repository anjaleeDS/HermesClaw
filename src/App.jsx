// src/App.jsx
import { useState } from 'react';
import {
  createInitialState,
  startGame,
  resolveAction,
  advanceTurn,
  calculateScore,
} from './gameLogic.js';
import IntroScreen   from './components/IntroScreen.jsx';
import GameHeader    from './components/GameHeader.jsx';
import NPCDialogue   from './components/NPCDialogue.jsx';
import CardRow       from './components/CardRow.jsx';
import ResultMoment  from './components/ResultMoment.jsx';
import ShelfInventory from './components/ShelfInventory.jsx';
import EndScreen     from './components/EndScreen.jsx';
import './index.css';

export default function App() {
  const [game, setGame] = useState(createInitialState);

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
    setGame(createInitialState);
  }

  // ── Intro ──
  if (game.phase === 'intro') {
    return <IntroScreen onStart={handleStart} />;
  }

  // ── End ──
  if (game.phase === 'end') {
    return (
      <EndScreen
        game={game}
        score={calculateScore(game)}
        onRestart={handleRestart}
      />
    );
  }

  // ── Playing + Result share the same shell ──
  return (
    <div className="game-shell">
      <GameHeader money={game.money} turn={game.turn} />

      {game.phase === 'result' ? (
        <ResultMoment
          message={game.lastNPCMessage}
          mood={game.npcMood}
          summary={game.actionSummary}
          onContinue={handleContinue}
          turn={game.turn}
          chapter={game.chapter ?? 0}
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
