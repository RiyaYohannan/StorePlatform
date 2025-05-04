import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import StoreCard from '../components/StoreCard';
import './StoreList.css';

function StoreList() {
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/stores');
        const stores = await res.json();

        const enhancedStores = await Promise.all(
          stores.map(async (store) => {
            try {
              const ratingRes = await fetch(`http://localhost:5000/api/stores/${store.id}/ratings`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              const { average, userRating } = await ratingRes.json();
              return { ...store, rating: average, userRating };
            } catch (err) {
              return { ...store, rating: 0, userRating: null };
            }
          })
        );

        setStores(enhancedStores);
      } catch (err) {
        console.error('Failed to load stores:', err);
      }
    };

    fetchStores();
  }, [token]);

  const handleRatingChange = async (id, value) => {
    try {
      await fetch(`http://localhost:5000/api/stores/${id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rating: value })
      });

      setStores(prev =>
        prev.map(store =>
          store.id === id ? { ...store, userRating: value } : store
        )
      );
    } catch (err) {
      alert('Failed to submit rating.');
      console.error(err);
    }
  };

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="storelist-container">
      <h2>Browse Stores</h2>

      <input
        type="text"
        placeholder="Search by name or address"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {filteredStores.length === 0 ? (
        <p className="no-results">No stores match your search.</p>
      ) : (
        <div className="store-grid">
          {filteredStores.map(store => (
            <StoreCard
              key={store.id}
              store={store}
              onRate={handleRatingChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default StoreList;
