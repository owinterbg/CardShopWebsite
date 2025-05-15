import Sidebar from '../components/Sidebar';
import { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', fontFamily: 'Roboto, sans-serif' }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: '1rem' }}>
        {children}
      </main>
    </div>
  );
}
