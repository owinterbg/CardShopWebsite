import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../api/auth';
import { loginSuccess, setUser } from '../../redux/authSlice';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // clear previous errors
    try {
      const res = await loginUser(form.email, form.password);

      if (res.access_token && res.user) {
        dispatch(loginSuccess({ token: res.access_token }));
        dispatch(setUser(res.user));
        navigate('/profile');
      } else if (res.error) {
        setError(res.error); // handle JSON error response
      } else {
        setError('Unexpected login error');
      }
    } catch (err) {
      // handle 401 or network failure
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />
      <button type="submit">Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
