import axios from "axios";
import { User } from "../types/User";

const API_BASE = process.env.REACT_APP_API_BASE_URL;
// OR for CRA: process.env.REACT_APP_API_BASE_URL


export async function registerUser(username: string, email: string, password: string) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });

  return res.json();
}

export async function loginUser(email: string, password: string) {
  const res = await axios.post(`${API_BASE}/login`, { email, password });
  return res.data;
}

export async function fetchUserProfile(token: string): Promise<User> {
  if (!token) throw new Error('No auth token found');

  const res = await axios.get<User>(`${API_BASE}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}
