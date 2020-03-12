import { createAction, SimpleActionCreator } from 'redux-act';

export interface AsyncAction<TRequest, TSuccess, TFailure> {
  request: SimpleActionCreator<TRequest>;
  success: SimpleActionCreator<TSuccess>;
  failure: SimpleActionCreator<TFailure>;
}

// Creates an AsyncAction object, which contains actions for
// initiating an asynchronous action as well as that action's
// success and failure outcomes.
export function createAsyncAction<TRequest, TSuccess, TFailure = string>(
  baseActionName: string
): AsyncAction<TRequest, TSuccess, TFailure> {
  return {
    request: createAction<TRequest>(`${baseActionName} Request`),
    success: createAction<TSuccess>(`${baseActionName} Success`),
    failure: createAction<TFailure>(`${baseActionName} Failure`)
  };
}