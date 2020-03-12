import { combineReducers } from 'redux';
import system from './system/reducers';
import history from './history/reducers';

export const rootReducer = combineReducers({
  system,
  history
});

export type AppState = ReturnType<typeof rootReducer>;