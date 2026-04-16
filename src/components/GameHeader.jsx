// src/components/GameHeader.jsx
export default function GameHeader({ money, turn }) {
  return (
    <header className="game-header">
      <div className="header-money">${money.toLocaleString()}</div>
      <div className="header-title">HERMÈS CLAW</div>
      <div className="header-turn">Turn {turn} / 10</div>
    </header>
  );
}
