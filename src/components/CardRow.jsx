// src/components/CardRow.jsx
import EventCard from './EventCard.jsx';

export default function CardRow({ cards, onAction, money }) {
  return (
    <div className="card-row">
      {cards.map(card => (
        <EventCard
          key={card.id}
          card={card}
          onAction={onAction}
          money={money}
        />
      ))}
    </div>
  );
}
