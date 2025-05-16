import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { RootState } from '../redux/store';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const handleSignOut = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div style={{
      position: 'relative',
      width: collapsed ? '60px' : '200px',
      background: '#f1f3f4',
      transition: 'width 0.3s',
      height: '100vh',
      overflow: 'hidden',
      boxShadow: collapsed ? 'none' : '2px 0 5px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 2
      }}>
        <button
          style={{
            background: '#666',
            color: '#fff',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
          }}
          onClick={() => setCollapsed(!collapsed)}
        >
          ☰
        </button>
      </div>
      {!collapsed && (
        <nav style={{ marginTop: '50px', padding: '1rem' }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><Link to="/">Home</Link></li>
            {!isLoggedIn && <li><Link to="/login">Login</Link></li>}
            {!isLoggedIn && <li><Link to="/register">Register</Link></li>}
            <li><Link to="/profile">Profile</Link></li>
            {isLoggedIn && (
              <li>
                <button
                  onClick={handleSignOut}
                  style={{
                    marginTop: '1rem',
                    background: '#e74c3c',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Sign Out
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </div>
  );
}
