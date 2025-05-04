// src/components/StoreCard.jsx
import React from 'react';
import './StoreCard.css'; // make sure you also have this CSS file

export default function StoreCard({ store, onRate }) {
  return (
    <div className="store-card">
      <img src="https://via.placeholder.com/300x200" alt={store.name} />
      <h3>{store.name}</h3>
      <p>{store.address}</p>
      <p><strong>Avg Rating:</strong> {store.rating || 'N/A'}</p>
      <label>
        Your Rating:
        <select
          value={store.userRating || ''}
          onChange={e => onRate(store.id, parseInt(e.target.value))}
        >
          <option value="">Select</option>
          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </label>
    </div>
  );
}
