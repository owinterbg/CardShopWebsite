import { useState } from 'react';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);

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
            <li><a href="/">Home</a></li>
          </ul>
        </nav>
      )}
    </div>
  );
}