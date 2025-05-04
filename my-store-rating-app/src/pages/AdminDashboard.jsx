import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0
  });
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        }
      } catch (err) {
        console.error('Error loading stats:', err);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.totalUsers}</h3>
          <p>Total Users</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalStores}</h3>
          <p>Total Stores</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalRatings}</h3>
          <p>Total Ratings</p>
        </div>
      </div>

      <div className="admin-actions">
        <Link to="/admin/users" className="action-button">View All Users</Link>
        <Link to="/admin/stores" className="action-button">View All Stores</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
