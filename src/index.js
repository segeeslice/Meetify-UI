/*
 * App entry-point
 * Sets up any styles & preferences then displays entry UI component
 */

// React dependencies & boilerplate
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

// App entrypoint
import App from './components/App';

// Redux store
import store from './store';
import { Provider } from 'react-redux';

// Style imports
import './style/index.css';
import './style/transitions.css';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles'
import theme from './theme'

// Global alert handler
import AlertProvider from './components/global/AlertProvider';
import AlertNotification from './components/global/AlertNotification';

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline/>
    <ThemeProvider theme={theme}>
      <AlertProvider>
        <Provider store={store}>
          <App/>
        </Provider>
        <AlertNotification/>
      </AlertProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
