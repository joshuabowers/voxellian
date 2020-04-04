import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { configureStore } from './store';
import { Provider } from 'react-redux';
import { history } from 'store/history';
import { Router } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

const { store, persistor } = configureStore();

const renderApp = () =>
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router history={history}>
          <App />
        </Router>
      </PersistGate>
    </Provider>,
    document.getElementById('root')
  );

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('./components/App', renderApp);
}

renderApp();

// Adding this in to see if it at all positively affects mobile touch
// interactions. See, e.g.:
// https://www.beacontechnologies.com/blog/2015/05/simple-little-tricks-for-web-transition-touch-events-on-mobile-devices/
document.body.addEventListener('touchstart', function() {}, false);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();