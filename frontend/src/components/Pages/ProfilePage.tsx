import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../../api/auth';
import { setUser, clearUser } from '../../redux/authSlice';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetchUserProfile(token)
      .then(user => {
        dispatch(setUser(user));
      })
      .catch(err => {
        console.error("Failed to fetch profile:", err);
        localStorage.removeItem("token");
        dispatch(clearUser());
        navigate('/login');
      });
  }, [dispatch, navigate, token]);

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
