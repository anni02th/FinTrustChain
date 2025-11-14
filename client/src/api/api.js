import axios from "axios";

const BACKEND = import.meta.env.VITE_API_BASE || "http://localhost:3000/api/v1";

const api = axios.create({
  baseURL: BACKEND,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
};

export const users = {
  get: (id) => api.get(`/users/${id}`),
  list: (params) => api.get(`/users`, { params }),
};

export const loanRequests = {
  create: (payload) => api.post(`/loan-requests`, payload),
  list: (params) => api.get(`/loan-requests`, { params }),
  get: (id) => api.get(`/loan-requests/${id}`),
  updateStatus: (id, body) => api.put(`/loan-requests/${id}/status`, body),
};

export const brochures = {
  list: () => api.get(`/loan-brochures`),
  create: (payload) => api.post(`/loan-brochures`, payload),
};

export const contracts = {
  create: (payload) => api.post(`/contracts`, payload),
  get: (id) => api.get(`/contracts/${id}`),
};

export const payments = {
  pay: (payload) => api.post(`/payments`, payload),
  list: (params) => api.get(`/transactions`, { params }),
};

export const notifications = {
  list: (params) => api.get(`/notifications`, { params }),
  create: (payload) => api.post(`/notifications`, payload),
};

export default api;
