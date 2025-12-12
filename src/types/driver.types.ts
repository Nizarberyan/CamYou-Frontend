import type { User } from "./auth.types";
import type { MessageResponse } from "./common.types";

export type Driver = User;

export interface DriverResponse {
    driver: Driver;
}

export type CreateDriverResponse = Driver;
export type UpdateDriverResponse = Driver;
export type DeleteDriverResponse = MessageResponse;
