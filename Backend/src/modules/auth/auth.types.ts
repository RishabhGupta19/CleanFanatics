import { UserRole } from "../../config/roles";

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  serviceArea?: string; // only for PROVIDER
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}
