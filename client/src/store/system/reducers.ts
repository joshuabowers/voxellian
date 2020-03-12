import { SystemState } from './types';
import { createReducer } from 'redux-act';
import { logIn, logOut, toggleLogInForm } from './actions';

const initialState: SystemState = {
  error: undefined,
  loggedIn: false,
  user: undefined,
  login: undefined,
  logInFormVisible: false
};

const reducer = createReducer<SystemState>({}, initialState);

reducer.on(toggleLogInForm, (state, payload) => ({
  ...state,
  logInFormVisible: payload !== undefined ? payload : !state.logInFormVisible
}));

reducer.on(logIn.request, (state, payload) => ({ ...state }));
reducer.on(logIn.success, (state, payload) => ({
  ...payload
}));
reducer.on(logIn.failure, (state, payload) => ({
  ...state,
  error: payload
}));

reducer.on(logOut.request, (state, payload) => ({ ...state }));
reducer.on(logOut.success, (state, payload) => ({
  ...payload
}));
reducer.on(logOut.failure, (state, payload) => ({
  ...state,
  error: payload
}));

export default reducer;