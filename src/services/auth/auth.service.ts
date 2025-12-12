import api from "../api";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  LogoutResponse,
  User,
} from "../../types/auth.types";


const authService = {
  login: async (loginRequest: LoginRequest) => {
    const response = await api.post<LoginResponse>("/auth/login", loginRequest);
    return response.data;
  },
  register: async (registerRequest: RegisterRequest) => {
    const response = await api.post<RegisterResponse>(
      "/auth/register",
      registerRequest,
    );
    return response.data;
  },
  logout: async () => {
    const response = await api.post<LogoutResponse>("/auth/logout");
    return response.data;
  },
  getMe: async () => {
    const response = await api.get<User>("/auth/me");
    return response.data;
  },
};

export default authService;
