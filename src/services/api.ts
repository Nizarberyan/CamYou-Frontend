import axios from "axios";
const API_BASE_URL = process.env.BUN_PUBLIC_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const apiMethods = {
  getTrips: async (params?: any) => {
    const response = await api.get("/trips", { params });
    return response.data;
  },
  getDrivers: async () => {
    const response = await api.get("/drivers");
    return response.data;
  },
  getTrucks: async () => {
    const response = await api.get("/trucks");
    return response.data;
  },
  getTrailers: async () => {
    const response = await api.get("/trailers");
    return response.data;
  },
  getTripById: async (id: string) => {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },
  downloadWorkOrder: async (id: string) => {
    const response = await api.get(`/trips/${id}/work-order`, {
      responseType: "blob",
    });
    return response.data;
  },
  updateTripStatus: async (id: string, status: string, data?: any) => {
    const response = await api.patch(`/trips/${id}/status`, {
      status,
      ...data,
    });
    return response.data;
  },
  maintenance: {
    perform: async (truckId: string, notes: string) => {
      const response = await api.post(`/maintenance/${truckId}/perform`, {
        notes,
      });
      return response.data;
    },
    getStatus: async () => {
      const response = await api.get("/maintenance/status");
      return response.data;
    },
  },
  reports: {
    getDaily: async (limit: number = 7) => {
      const response = await api.get("/reports/daily", { params: { limit } });
      return response.data;
    },
    generate: async () => {
      const response = await api.post("/reports/generate");
      return response.data;
    },
    downloadPDF: async (id: string) => {
      const response = await api.get(`/reports/${id}/pdf`, {
        responseType: 'blob', // Important for handling binary data (PDF)
      });
      return response.data;
    },
  },
  users: {
    getAll: () => api.get("/users"),
    getById: (id: string) => api.get(`/users/${id}`),
    create: (data: any) => api.post("/users", data),
    update: (id: string, data: any) => api.put(`/users/${id}`, data),
    delete: (id: string) => api.delete(`/users/${id}`),
    changePassword: (id: string, data: any) => api.put(`/users/${id}/password`, data),
    resetPassword: (id: string, newPass: string) => api.post(`/users/${id}/reset-password`, { newPassword: newPass }),
  },
};

export default api;
