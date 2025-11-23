export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
