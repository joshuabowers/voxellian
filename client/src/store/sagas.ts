import { take, all, cancelled } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist/lib/constants';
import { loginFlow } from './system/sagas';

export function* sanity() {
  console.log('Running sagas');
  if (yield cancelled()) {
    console.log('Sagas no longer running');
  }
}

export function* rootSaga() {
  console.log('Waiting for rehydration');
  yield take(REHYDRATE);
  console.log('Rehydrated');
  yield all([sanity(), loginFlow()]);
}