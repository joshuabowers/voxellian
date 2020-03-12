import { createAction } from 'redux-act';
import { IHistoryState } from './types';

export const navigate = createAction<IHistoryState>(
  'Navigated to new location'
);