import { createAction } from 'redux-act';
import { createAsyncAction } from '../types';
import { SystemState, Login, User } from './types';

export const logIn = createAsyncAction<Login, SystemState>('Log In');
export const logOut = createAsyncAction<User | undefined, SystemState>(
  'Log Out'
);

export const toggleLogInForm = createAction<boolean | undefined>(
  'Toggle Login Form'
);