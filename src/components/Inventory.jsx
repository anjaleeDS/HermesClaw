// src/components/Inventory.jsx
import { ITEMS } from '../gameData.js';

export default function Inventory({ inventory, lastAcquired }) {
  return (
    <footer className="inventory">
      <span className="inventory-label">Your Acquisitions</span>
      <div className="inventory-items">
        {inventory.length === 0 ? (
          <span className="inventory-empty">Nothing yet.</span>
        ) : (
          inventory.map(id => (
            <div
              key={id}
              className={`inventory-item${id === lastAcquired ? ' inventory-item--new' : ''}`}
              title={ITEMS[id]?.description}
            >
              {ITEMS[id]?.name ?? id}
            </div>
          ))
        )}
      </div>
    </footer>
  );
}
