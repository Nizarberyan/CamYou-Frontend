export type VehicleType = "Truck" | "Trailer";

export interface MaintenanceVehicle {
    _id: string;
    licensePlate: string;
    status: "available" | "on_trip" | "maintenance";
    maintenanceFlags: string[];
    vehicleType: VehicleType;
    brand: string;
    vehicleModel: string; // Is 'vehicleModel' for trucks, 'type' for trailers
    year: number;

    // Truck Specific
    currentMileage?: number;
    nextMaintenanceMileage?: number;
}
