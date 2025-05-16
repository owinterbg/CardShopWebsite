import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../../api/auth';
import { setUser } from '../../redux/authSlice';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  useEffect(() => {
    // Redirect to login if no token
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch and sync profile
    if (!user) {
      fetchUserProfile(token).then(res => {
        if (res.username) {
          dispatch(setUser(res));
        }
      });
    }
  }, [token, user, dispatch, navigate]);

  if (!isLoggedIn || !token) return <p>Redirecting to login...</p>;
  if (!user) return <p>Loading profile...</p>;

  return (
    <div>
      <h2>Welcome, {user.username}</h2>
      <p>Email: {user.email}</p>
      <p>Bio: {user.bio}</p>
      {user.avatar_url && <img src={user.avatar_url} alt="avatar" />}
    </div>
  );
}
