import React, { useEffect, useState } from 'react';
import './App.css';
import { fetchGreeting } from './services/api';

function App() {
  const [message, setMessage] = useState<string>('Loading...');

  useEffect(() => {
    fetchGreeting()
      .then(setMessage)
      .catch(() => setMessage('Failed to load message from backend.'));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>CardShop Project</h1>
        <p>Backend says: {message}</p>
      </header>
    </div>
  );
}

export default App;
