import type { User } from "./auth.types";

import type { MessageResponse } from "./common.types";

export type CreateTruckResponse = Truck;
export type UpdateTruckResponse = Truck;
export type DeleteTruckResponse = MessageResponse;

export interface Truck {
  _id: string;
  licensePlate: string;
  brand: string;
  vehicleModel: string;
  year: number;
  vin?: string;
  currentMileage: number;
  fuelType: "diesel" | "petrol" | "electric" | "hybrid";
  fuelCapacity: number;
  assignedDriver?: string | User;
  status: "available" | "on_trip" | "maintenance" | "inactive";
  lastMaintenanceDate?: string;
  nextMaintenanceMileage?: number;
  insuranceExpiry?: string;
  registrationExpiry?: string;
  maintenanceFlags: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
