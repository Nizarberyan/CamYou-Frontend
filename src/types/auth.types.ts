interface LoginResponse {
  message: string;
  token: string;
  user: {
    name: string;
    email: string;
    role?: "user" | "admin" | "driver";
    status: "active" | "inactive";
    profileImage?: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}
interface LoginRequest {
  email: string;
  password: string;
}
interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
interface RegisterResponse {
  message: string;
  token: string;
  user: {
    name: string;
    email: string;
    role?: "user" | "admin" | "driver";
    status: "active" | "inactive";
    profileImage?: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}
interface LogoutResponse {
  message: string;
}
interface User {
  _id: string;
  name: string;
  email: string;
  role?: "user" | "admin" | "driver";
  status: "active" | "inactive";
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export type {
  LoginResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  LogoutResponse,
  User,
};
