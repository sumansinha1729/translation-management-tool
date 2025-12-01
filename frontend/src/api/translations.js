import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const createTranslation = (payload) => API.post('/translations', payload);
export const autogenTranslation = (payload) => API.post('/translations/autogen', payload);
export const fetchTranslations = (q) => API.get('/translations', { params: { q } });
export const updateTranslation = (id, payload) => API.put(`/translations/${id}`, payload);
export const deleteTranslation = (id) => API.delete(`/translations/${id}`);
