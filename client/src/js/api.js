import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:6789',
  withCredentials: true,
});

export async function getProfileFromToken() {
  const { data } = await api.get('/user/profile');
  return data.user_data;
}

export async function register(params) {
  const { data } = await api.post('/user/register', params);
  return data.registered_user;
}

export async function login(params) {
  const { data } = await api.post('/user/login', params);
  return data.found_user;
}

export async function logout() {
  await api.post('/user/logout');
}

export async function addContact(userId, contactId) {
  const { data } = await api.patch('/user/contacts', {
    user_id: userId,
    contact_id: contactId,
  });
  return data;
}

export async function filterUsers(term) {
  const { data } = await api.get(`/users/filter/${term}`);
  return data;
}
