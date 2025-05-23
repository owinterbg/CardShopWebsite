import { ReactNode, useEffect } from 'react';
import Sidebar from '../components/Utility/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../api/auth';
import { setUser, clearUser } from '../redux/authSlice';
import { RootState } from '../redux/store';

export default function MainLayout({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(clearUser());  // clears & sets isLoading to false
      return;
    }

    fetchUserProfile(token)
      .then((user) => dispatch(setUser(user)))
      .catch(() => {
        localStorage.removeItem('token');
        dispatch(clearUser());
      });
  }, [dispatch]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div style={{ display: 'flex', fontFamily: 'Roboto, sans-serif' }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: '1rem' }}>
        {children}
      </main>
    </div>
  );
}
