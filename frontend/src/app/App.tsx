import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from '../routes';
import Sidebar from '../components/Sidebar';

export default function App() {
  return (
    <Router>
      <div style={{ display: 'flex', fontFamily: 'Roboto, sans-serif' }}>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '1rem' }}>
          <AppRoutes />
        </main>
      </div>
    </Router>
  );
}