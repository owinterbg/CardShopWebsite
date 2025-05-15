import { useEffect, useState } from 'react';
import { fetchUserProfile } from '../../api/auth';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return setError('No token found');

    fetchUserProfile(token).then(res => {
      if (res.username) {
        setProfile(res);
      } else {
        setError(res.error || 'Failed to fetch profile');
      }
    });
  }, []);

  if (error) return <p>{error}</p>;
  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h2>Welcome, {profile.username}</h2>
      <p>Email: {profile.email}</p>
      <p>Bio: {profile.bio}</p>
      {profile.avatar_url && <img src={profile.avatar_url} alt="avatar" />}
    </div>
  );
}
