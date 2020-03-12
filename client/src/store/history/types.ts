import * as History from 'history';

export interface IHistoryState {
  location: History.Location;
  action: History.Action;
}