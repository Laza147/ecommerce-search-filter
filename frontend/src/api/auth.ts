import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

export async function login(email: string, password: string) {
  const res = await api.post('/api/auth/login', { email, password });
  return res.data.token;
}

export async function register(name: string, email: string, password: string) {
  const res = await api.post('/api/auth/register', {
    name,
    email,
    password,
  });
  return res.data.token;
}
