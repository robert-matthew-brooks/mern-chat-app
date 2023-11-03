import axios from 'axios';
import { getBeUrl } from './urls';

const api = axios.create({
  baseURL: getBeUrl(),
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

export async function deleteUser(token) {
  await api.delete('/user', { params: { token } });
}

// used in search bar
export async function findUsers(term, limit) {
  const { data } = await api.get(`/find/${term}`, {
    params: { limit },
  });
  return data;
}

export async function addContact(contactId, token) {
  const { data } = await api.post(`/contacts/${contactId}`, {
    params: { token },
  });
  return data;
}

export async function removeContact(contactId, token) {
  const { data } = await api.delete(`/contacts/${contactId}`, {
    params: { token },
  });
  return data;
}

export async function getMessages(contactId, token) {
  const { data } = await api.get(`/messages/${contactId}`, {
    params: { token },
  });
  return data;
}

export async function addMessage(contactId, body, token) {
  const { data } = await api.post(
    `/messages/${contactId}`,
    { body },
    { params: { token } }
  );
  return data;
}
