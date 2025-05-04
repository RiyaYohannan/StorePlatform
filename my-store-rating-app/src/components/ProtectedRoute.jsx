// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  // If the user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If a role is required, check if the user has that role
  if (role && user.role !== role) {
    // Redirect non-authorized users to their dashboard or home
    return <Navigate to="/dashboard" replace />;
  }

  // If everything checks out, render the protected component
  return children;
};

export default ProtectedRoute;
