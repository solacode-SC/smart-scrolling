import { UserProfile } from "./user.js";

export interface AuthSession {
  token: string;
  expiresAt: Date;
  user: UserProfile;
}

export interface RegisterResponse {
  user: UserProfile;
  sessionToken?: string;
  message?: string;
}

export interface LoginResponse {
  user: UserProfile;
  sessionToken: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errors?: Record<string, string[]> | string[];
}
