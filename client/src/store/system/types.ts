// import { Action } from 'redux';

export interface Login {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  displayAs: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SystemState {
  error?: string;
  loggedIn: boolean;
  login?: Login;
  user?: User;
  logInFormVisible: boolean;
}