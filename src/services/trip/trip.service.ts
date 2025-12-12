import api from "../api";
import type { Trip } from "../../types/trip.types";

const tripService = {
    getMyTrips: async (driverId: string) => {
        const response = await api.get<Trip[]>("/trips", {
            params: { driver: driverId },
        });
        return response.data;
    },
};

export default tripService;
