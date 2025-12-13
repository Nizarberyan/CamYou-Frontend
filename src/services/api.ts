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
  trucks: {
    getAll: async () => {
      const response = await api.get("/trucks");
      return response.data;
    },
    getById: async (id: string) => {
      const response = await api.get(`/trucks/${id}`);
      return response.data;
    },
    create: async (data: any) => {
      const response = await api.post("/trucks", data);
      return response.data;
    },
    update: async (id: string, data: any) => {
      const response = await api.put(`/trucks/${id}`, data);
      return response.data;
    },
    delete: async (id: string) => {
      const response = await api.delete(`/trucks/${id}`);
      return response.data;
    },
  },
  trailers: {
    getAll: async () => {
      const response = await api.get("/trailers");
      return response.data;
    },
    getById: async (id: string) => {
      const response = await api.get(`/trailers/${id}`);
      return response.data;
    },
    create: async (data: any) => {
      const response = await api.post("/trailers", data);
      return response.data;
    },
    update: async (id: string, data: any) => {
      const response = await api.put(`/trailers/${id}`, data);
      return response.data;
    },
    delete: async (id: string) => {
      const response = await api.delete(`/trailers/${id}`);
      return response.data;
    },
  },
  tires: {
    getAll: async () => {
      const response = await api.get("/tires");
      return response.data;
    },
    getById: async (id: string) => {
      const response = await api.get(`/tires/${id}`);
      return response.data;
    },
    create: async (data: any) => {
      const response = await api.post("/tires", data);
      return response.data;
    },
    update: async (id: string, data: any) => {
      const response = await api.put(`/tires/${id}`, data);
      return response.data;
    },
    delete: async (id: string) => {
      const response = await api.delete(`/tires/${id}`);
      return response.data;
    },
    getHistory: async (id: string) => {
      const response = await api.get(`/tires/${id}/history`);
      return response.data;
    },
    addHistory: async (id: string, data: any) => {
      const response = await api.post(`/tires/${id}/history`, data);
      return response.data;
    },
  },
  createTrip: async (data: any) => {
    const response = await api.post("/trips", data);
    return response.data;
  },
  getTripById: async (id: string) => {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },
  addTripExpense: async (id: string, expense: any) => {
    const response = await api.post(`/trips/${id}/expenses`, expense);
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
    logInspection: async (
      vehicleId: string,
      data: { vehicleModel: string; notes: string; status: string },
    ) => {
      const response = await api.post(
        `/maintenance/${vehicleId}/inspection`,
        data,
      );
      return response.data;
    },
    getStatus: async () => {
      const response = await api.get("/maintenance/status");
      return response.data;
    },
    getHistory: async () => {
      const response = await api.get("/maintenance/history");
      return response.data;
    },
    getConfig: async () => {
      const response = await api.get("/maintenance/config");
      return response.data;
    },
    updateConfig: async (config: any) => {
      const response = await api.put("/maintenance/config", config);
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
        responseType: "blob", // Important for handling binary data (PDF)
      });
      return response.data;
    },
  },
  users: {
    getAll: async () => api.get("/users"),
    getById: async (id: string) => api.get(`/users/${id}`),
    create: async (data: any) => api.post("/users", data),
    update: async (id: string, data: any) => api.put(`/users/${id}`, data),
    delete: async (id: string) => api.delete(`/users/${id}`),
    changePassword: async (id: string, data: any) =>
      api.put(`/users/${id}/password`, data),
    resetPassword: async (id: string, newPass: string) =>
      api.post(`/users/${id}/reset-password`, { newPassword: newPass }),
    uploadPhoto: async (id: string, file: File) => {
      const formData = new FormData();
      formData.append("photo", file);
      return api.post(`/users/${id}/photo`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
  },
};

export default api;
