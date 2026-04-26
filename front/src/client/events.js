import api from './index';

export const eventsClient = {
  list: (params = {}) => api.get('/events/', { params }),
  detail: (id) => api.get(`/events/${id}/`),
  create: (data) => api.post('/events/', data),
  update: (id, data) => api.put(`/events/${id}/`, data),
  remove: (id) => api.delete(`/events/${id}/`),
  register: (id, depositorName) =>
    api.post(`/events/${id}/register/`, { depositor_name: depositorName }),
  cancelRegister: (id) => api.delete(`/events/${id}/register/`),
  registrations: (id) => api.get(`/events/${id}/registrations/`),
};
