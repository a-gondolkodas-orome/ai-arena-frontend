import { User } from "./user";

export type UserData = {
  username: string;
  email: string;
  password: string;
};

export type RegistrationResponse = {
  token: string;
  user: User;
};

export type Credentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};
