import { createStore, applyMiddleware, Middleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import * as storage from 'localforage';
import { rootReducer, AppState } from './reducers';
import { historyChangedMiddleware } from './history';
import { rootSaga } from './sagas';

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const configureStore = (preloadedState?: AppState) => {
  const environment = process.env.NODE_ENV;
  const sagaMiddleware = createSagaMiddleware();
  const middlewares: Middleware[] = [historyChangedMiddleware, sagaMiddleware];

  if (environment === 'development') {
    const reduxLogger = require('redux-logger');

    middlewares.push(reduxLogger.logger as Middleware);
  }

  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [middlewareEnhancer];
  const composedEnhancers = composeWithDevTools(...enhancers);

  const store = createStore(
    persistedReducer,
    preloadedState,
    composedEnhancers
  );
  const persistor = persistStore(store);

  if (environment !== 'production' && module.hot) {
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').rootReducer;
      store.replaceReducer(persistReducer(persistConfig, nextRootReducer));
    });
  }

  sagaMiddleware.run(rootSaga);

  return { store, persistor };
};