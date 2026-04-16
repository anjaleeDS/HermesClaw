// src/components/IntroScreen.jsx
export default function IntroScreen({ onStart }) {
  return (
    <div className="intro-screen">
      <div className="intro-inner">
        <div className="intro-eyebrow">A Game About Wanting Things</div>
        <h1 className="intro-title">Hermès Claw</h1>
        <p className="intro-premise">
          You want a Birkin bag.<br />
          She decides who gets one.
        </p>
        <div className="intro-rules">
          <div className="intro-rule">
            <span className="intro-rule-label">Each turn</span>
            Choose one of three cards. Each choice has consequences — most of them invisible.
          </div>
          <div className="intro-rule">
            <span className="intro-rule-label">The goal</span>
            Build enough goodwill over 10 turns that she offers you the bag. Or discover what happens when you don't.
          </div>
          <div className="intro-rule">
            <span className="intro-rule-label">The secret</span>
            There is a pattern. You'll feel it before you understand it.
          </div>
        </div>
        <button className="intro-start" onClick={onStart}>
          Enter the Boutique
        </button>
      </div>
    </div>
  );
}
