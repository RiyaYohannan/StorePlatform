import { useEffect, useState } from 'react';
import './StoreOwnerDashboard.css';

function StoreOwnerDashboard() {
  const [stores, setStores] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchOwnerStores = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/owner/stores', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        setStores(data);
      } catch (err) {
        console.error('Error loading owner stores:', err);
      }
    };

    fetchOwnerStores();
  }, [token]);

  return (
    <div className="owner-dashboard">
      <h2>Your Stores</h2>
      {stores.length === 0 ? (
        <p className="no-stores">You have not registered any stores yet.</p>
      ) : (
        <div className="store-grid">
          {stores.map((store) => (
            <div className="store-card" key={store.id}>
              <img
                src="https://via.placeholder.com/300x200"
                alt={store.name}
                className="store-image"
              />
              <h3>{store.name}</h3>
              <p><strong>Address:</strong> {store.address}</p>
              <p><strong>Average Rating:</strong> {store.averageRating?.toFixed(1) || 'N/A'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StoreOwnerDashboard;
