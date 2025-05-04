import { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the context
const AuthContext = createContext();

// Dummy user database
const fakeUsers = [
  { email: 'admin@example.com', password: 'Admin@123', role: 'admin' },
  { email: 'user@example.com', password: 'User@123', role: 'user' },
  { email: 'owner@example.com', password: 'Owner@123', role: 'storeOwner' }
];

// Context provider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = (email, password) => {
    const found = fakeUsers.find(u => u.email === email && u.password === password);
    if (found) {
      setUser({ email: found.email, role: found.role });
      navigate('/dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth
export function useAuth() {
  return useContext(AuthContext);
}
