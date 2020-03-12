// Largely adapted from: https://redux-saga.js.org/docs/advanced/NonBlockingCalls.html

import { fork, call, take, put, select } from 'redux-saga/effects';
import { logIn, logOut } from './actions';
import { Api, Endpoints } from '../rest';
import { Login, User } from './types';

const sessionApi = new Api<User, Login>('/api/session', {
  allowed: Endpoints.Add | Endpoints.Destroy,
  singular: true
});

export function* authenticate(email: string, password: string) {
  try {
    console.log(
      `Attempting authentication with {email: ${email}, password: ${password}}`
    );
    const user = yield call([sessionApi, sessionApi.add], { email, password });
    yield put(
      logIn.success({
        user: user as User,
        loggedIn: true,
        logInFormVisible: false
      })
    );
  } catch (error) {
    yield put(logIn.failure(error));
  }
}

export function* loginFlow() {
  while (true) {
    const isLoggedIn = yield select(state => state.system.loggedIn);
    console.log('loginFlow: isLoggedIn:', isLoggedIn);
    if (!isLoggedIn) {
      const {
        payload: { email, password }
      } = yield take(logIn.request);
      yield fork(authenticate, email, password);
    }
    const action = yield take([logOut.request, logIn.failure]);
    if (action.type === logOut.request.toString()) {
      console.info('logOut.request made');
      const user = action.payload as User;
      try {
        yield call([sessionApi, sessionApi.destroy], user);
        yield put(
          logOut.success({
            user: undefined,
            loggedIn: false,
            logInFormVisible: false
          })
        );
      } catch (error) {
        yield put(logOut.failure(error));
      }
    }
  }
}