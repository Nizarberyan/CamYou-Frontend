import type { User } from "./auth.types";
import type { Truck } from "./truck.types";
import type { Trailer } from "./trailer.types";

interface Trip {
  _id: string;
  tripNumber: string;
  driver: string | User;
  truck: string | Truck;
  trailer?: string | Trailer;
  startLocation: string;
  endLocation: string;
  scheduledDate: string;
  startDate?: string;
  endDate?: string;
  startMileage?: number;
  endMileage?: number;
  fuelAdded?: number;
  status: "planned" | "in_progress" | "completed" | "cancelled";
  estimatedDistance?: number;
  actualDistance?: number;
  notes?: string;
  expenses?: {
    _id?: string;
    type: string;
    amount: number;
    description: string;
    date: string;
    receiptUrl?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface TripResponse {
  trip: Trip[];
}

import type { MessageResponse } from "./common.types";

export type CreateTripResponse = Trip;
export type UpdateTripResponse = Trip;
export type DeleteTripResponse = MessageResponse;

export type { Trip, TripResponse };
