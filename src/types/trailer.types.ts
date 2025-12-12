import type { Truck } from "./truck.types";

import type { MessageResponse } from "./common.types";

export type CreateTrailerResponse = Trailer;
export type UpdateTrailerResponse = Trailer;
export type DeleteTrailerResponse = MessageResponse;

export interface Trailer {
    _id: string;
    licensePlate: string;
    type: "flatbed" | "refrigerated" | "box" | "tanker" | "other";
    capacityWeight: number;
    capacityVolume?: number;
    brand: string;
    year: number;
    vin?: string;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
    status: "available" | "on_trip" | "maintenance" | "inactive";
    assignedTruck?: string | Truck;
    lastMaintenanceDate?: string;
    nextMaintenanceDate?: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
