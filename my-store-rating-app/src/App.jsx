// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import StoreList from './pages/StoreList';
import AdminUsers from './pages/AdminUsers';
import AdminStoreList from './pages/AdminStoreList';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';

export default function App() {
  return (
    <>
      <NavBar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes: any authenticated user */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Normal user: browse and rate stores */}
        <Route
          path="/stores"
          element={
            <ProtectedRoute role="user">
              <StoreList />
            </ProtectedRoute>
          }
        />

        {/* Store owner dashboard */}
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute role="storeOwner">
              <StoreOwnerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin‑only management pages */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stores"
          element={
            <ProtectedRoute role="admin">
              <AdminStoreList />
            </ProtectedRoute>
          }
        />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<h2 style={{ textAlign: 'center', marginTop: '40px' }}>404 ‒ Page Not Found</h2>} />
      </Routes>
    </>
  );
}
