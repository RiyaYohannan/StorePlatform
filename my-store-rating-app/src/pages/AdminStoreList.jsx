import { useEffect, useState } from 'react';
import './AdminStoreList.css';

function AdminStoreList() {
  const [stores, setStores] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/stores', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        setStores(data);
      } catch (err) {
        console.error('Error fetching stores:', err);
      }
    };

    fetchStores();
  }, [token]);

  return (
    <div className="admin-stores">
      <h2>All Registered Stores</h2>
      {stores.length === 0 ? (
        <p className="no-stores">No stores available.</p>
      ) : (
        <table className="store-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Store Name</th>
              <th>Owner</th>
              <th>Address</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {stores.map(store => (
              <tr key={store.id}>
                <td>{store.id}</td>
                <td>{store.name}</td>
                <td>{store.ownerEmail}</td>
                <td>{store.address}</td>
                <td>{store.averageRating?.toFixed(1) || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminStoreList;
