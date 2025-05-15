const API_BASE = 'http://localhost:5000/api';

export async function registerUser(username: string, email: string, password: string) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });

  return res.json();
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  return res.json();
}

export async function fetchUserProfile(token: string) {
  const res = await fetch(`${API_BASE}/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return res.json();
}
