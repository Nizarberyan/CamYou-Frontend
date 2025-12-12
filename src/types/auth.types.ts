interface LoginResponse {
    message: string;
    token: string;
    data: {
        name: string;
        email: string;
        role: 'user' | 'admin' | 'driver';
        status: 'active' | 'inactive';
        profileImage?: string;
        _id: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
    }
}
interface LoginRequest {
    email: string;
    password: string;
}
interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin' | 'driver';
    profileImage?: string;
}
interface RegisterResponse {
    message: string;
    token: string;
    data: {
        name: string;
        email: string;
        role: 'user' | 'admin' | 'driver';
        status: 'active' | 'inactive';
        profileImage?: string;
        _id: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
    }
}
interface LogoutResponse {
    message: string;
}
export type { LoginResponse, LoginRequest, RegisterRequest, RegisterResponse, LogoutResponse };
