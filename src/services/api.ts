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
        const response = await api.patch(`/trips/${id}/status`, { status, ...data });
        return response.data;
    },
};

export default api;
