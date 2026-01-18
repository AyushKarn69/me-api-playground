import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const profileApi = {
  getProfile: () => api.get('/profile'),
  getFullProfile: (id) => api.get(`/profile/${id}/full`),
  updateProfile: (id, data) => api.put(`/profile/${id}`, data),
};

export const projectsApi = {
  getProjects: (skill) => api.get('/projects', { params: { skill } }),
  getProject: (id) => api.get(`/projects/${id}`),
  createProject: (data) => api.post('/projects', data),
};

export const skillsApi = {
  getSkills: () => api.get('/skills'),
  getTopSkills: (limit) => api.get('/skills/top', { params: { limit } }),
};

export const searchApi = {
  search: (q) => api.get('/search', { params: { q } }),
};

export default api;
