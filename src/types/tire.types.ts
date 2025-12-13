export interface Tire {
  _id: string;
  serialNumber: string;
  brand: string;
  size: string;
  status: "in_use" | "spare" | "maintenance" | "scrap";
  condition: "new" | "good" | "worn" | "damaged";
  treadDepth: number;
  purchaseDate?: string;
  assignedTo?: string;
  assignedToModel?: "Truck" | "Trailer";
  position?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
