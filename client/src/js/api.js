import axios from 'axios';

const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://be-mern-chat-app.onrender.com/'
    : 'http://localhost:6789';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export async function pingServer() {
  const response = await api.get('/status');
  return response;
}

export async function getProfileFromCookie() {
  const { data } = await api.get('/user');
  return data.user_data;
}

export async function register(username, password) {
  const { data } = await api.post('/user', { username, password });
  return data.registered_user;
}

export async function login(username, password) {
  const { data } = await api.post('/login', { username, password });
  return data.found_user;
}

export async function logout() {
  await api.post('/logout');
}

export async function deleteUser() {
  await api.delete('/user');
}

// used in search bar
export async function findUsers(term, limit) {
  const { data } = await api.get(`/find/${term}`, {
    params: { limit },
  });
  return data;
}

export async function addContact(contactId) {
  const { data } = await api.post(`/contacts/${contactId}`);
  return data;
}

export async function removeContact(contactId) {
  const { data } = await api.delete(`/contacts/${contactId}`);
  return data;
}

export async function getMessages(contactId) {
  const { data } = await api.get(`/messages/${contactId}`);
  return data;
}

export async function addMessage(contactId, body) {
  const { data } = await api.post(`/messages/${contactId}`, { body });
  return data;
}
