import { createReducer } from 'redux-act';
import { IHistoryState } from './types';
import { navigate } from './actions';
import { history } from './index';

// TODO: get current path location and set here.
const initialState: IHistoryState = {
  location: history.location,
  action: 'REPLACE'
};

const reducer = createReducer<IHistoryState>({}, initialState);

reducer.on(navigate, (state, payload) => ({ ...state, ...payload }));

export default reducer;