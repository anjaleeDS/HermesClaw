// src/components/EventCard.jsx
import CardIllustration from './CardIllustration.jsx';

export default function EventCard({ card, onAction, money }) {
  return (
    <div className="event-card">
      {/* Illustration — top face of the card */}
      <CardIllustration cardType={card.type} />

      {/* Context — what this scenario is */}
      <div className="card-context">
        <div className="card-title">{card.title}</div>
        <div className="card-subtitle">{card.subtitle}</div>
      </div>

      <div className="card-divider" />

      {/* Actions — what you can do */}
      <div className="card-actions-label">Your options</div>
      <div className="card-options">
        {card.options.map(opt => {
          const tooExpensive = opt.cost > 0 && money < opt.cost;
          return (
            <button
              key={opt.action}
              className={`card-option${tooExpensive ? ' card-option-disabled' : ''}`}
              onClick={() => !tooExpensive && onAction(card.id, opt.action)}
              disabled={tooExpensive}
            >
              <span className="card-option-text">{opt.label}</span>
              {tooExpensive && (
                <span className="card-option-hint">insufficient funds</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
