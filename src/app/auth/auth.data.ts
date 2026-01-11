export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}
