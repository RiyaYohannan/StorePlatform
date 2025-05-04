import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', display: 'flex', alignItems: 'center' }}>
      <Link to="/" style={{ marginRight: '10px' }}>Home</Link>

      {!user && (
        <>
          <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
          <Link to="/signup" style={{ marginRight: '10px' }}>Signup</Link>
        </>
      )}

      {user && (
        <>
          <Link to="/dashboard" style={{ marginRight: '10px' }}>Dashboard</Link>

          {/* Normal User */}
          {user.role === 'user' && (
            <Link to="/stores" style={{ marginRight: '10px' }}>
              Stores
            </Link>
          )}

          {/* Store Owner */}
          {user.role === 'storeOwner' && (
            <Link to="/owner/dashboard" style={{ marginRight: '10px' }}>
              My Stores
            </Link>
          )}

          {/* Admin */}
          {user.role === 'admin' && (
            <>
              <Link to="/admin/users" style={{ marginRight: '10px' }}>Users</Link>
              <Link to="/admin/stores" style={{ marginRight: '10px' }}>Stores</Link>
            </>
          )}

          {/* Logout */}
          <button
            onClick={logout}
            style={{
              marginLeft: 'auto',
              background: 'transparent',
              border: 'none',
              color: '#007bff',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Logout
          </button>
        </>
      )}
    </nav>
  );
}
