export interface User {
  id: number;
  email: string;
  fullName: string;
  timezone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
  timezone: string;
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  fullName: string;
}

export interface MessageResponse {
  message: string;
}