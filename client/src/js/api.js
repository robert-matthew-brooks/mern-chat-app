import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:6789',
  withCredentials: true,
});

export async function register(params) {
  const { data } = await api.post('/register', params);
  return data.registered_user;
}

export async function login(params) {
  const { data } = await api.post('/login', params);
  return data.found_user;
}

export async function getProfileFromToken() {
  const { data } = await api.get('/profile');
  return data.user_data;
}
