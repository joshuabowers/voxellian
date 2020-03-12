import { createBrowserHistory } from 'history';
import { Middleware } from 'redux';
import { navigate } from './actions';

export const history = createBrowserHistory();

export const historyChangedMiddleware: Middleware = store => {
  history.listen((location, action) => {
    store.dispatch(navigate({ location, action }));
  });
  return next => action => next(action);
};