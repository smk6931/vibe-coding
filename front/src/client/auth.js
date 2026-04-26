import api from './index';

export const authClient = {
  register: (email, nickname, password) =>
    api.post('/auth/register/', { email, nickname, password }),

  login: async (email, password) => {
    const res = await api.post('/auth/login/', { email, password });
    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);
    return res.data;
  },

  me: () => api.get('/auth/me/'),

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  updateMe: (data) => api.put('/auth/me/', data),
};
