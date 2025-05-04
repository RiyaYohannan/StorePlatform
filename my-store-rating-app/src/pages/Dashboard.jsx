import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>Welcome, {user?.name || 'User'} 👋</h2>
        <p>
          This is your dashboard. Here you can access different sections of the store rating platform based on your role.
        </p>

        <div className="dashboard-role">
          <strong>Your Role:</strong> {user?.role}
        </div>

        <div className="dashboard-links">
          {user?.role === 'user' && (
            <a href="/stores" className="dashboard-button">
              Browse Stores
            </a>
          )}

          {user?.role === 'admin' && (
            <>
              <a href="/admin/users" className="dashboard-button">
                Manage Users
              </a>
              <a href="/admin/stores" className="dashboard-button">
                Manage Stores
              </a>
            </>
          )}

          {user?.role === 'storeOwner' && (
            <a href="/owner/dashboard" className="dashboard-button">
              Store Owner Dashboard
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
