import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:6789',
  withCredentials: true,
});

export async function getProfileFromToken() {
  const { data } = await api.get('/user/profile');
  return data.user_data;
}

export async function register(username, password) {
  const { data } = await api.post('/user/register', { username, password });
  return data.registered_user;
}

export async function login(username, password) {
  const { data } = await api.post('/user/login', { username, password });
  return data.found_user;
}

export async function logout() {
  await api.post('/user/logout');
}

// used in search bar
export async function filterUsers(term, limit) {
  const { data } = await api.get('/users/filter', { params: { term, limit } });
  return data;
}

export async function addContact(userId, contactId) {
  const { data } = await api.post('/user/contacts', {
    user_id: userId,
    contact_id: contactId,
  });
  return data;
}

export async function removeContact(userId, contactId) {
  const { data } = await api.patch('/user/contacts', {
    user_id: userId,
    contact_id: contactId,
  });
  return data;
}

export async function getMessages(userId, contactId) {
  const { data } = await api.get('/messages', {
    params: { user_id: userId, contact_id: contactId },
  });
  return data;
}

export async function addMessage(userId, contactId, body) {
  const { data } = await api.post('/messages', {
    user_id: userId,
    contact_id: contactId,
    body,
  });
  return data;
}
