// src/components/GameHeader.jsx
import { CHAPTER_NAMES } from '../persistence.js';

export default function GameHeader({ money, turn, chapter }) {
  return (
    <header className="game-header">
      <div className="header-money">${money.toLocaleString()}</div>
      <div className="header-center">
        <div className="header-title">HERMÈS CLAW</div>
        <div className="header-target">{CHAPTER_NAMES[chapter ?? 0]}</div>
      </div>
      <div className="header-turn">Turn {turn} / 10</div>
    </header>
  );
}
