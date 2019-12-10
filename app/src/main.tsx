import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
// import { configureStore } from 'app/store';
import { Router, Switch, Route } from 'react-router';

import configureStore from 'app/store/configure-store';
import { ConnectedRouter } from 'connected-react-router';
import { PublicRoutes } from './app/routes/public';
import { PrivateRoutes } from './app/routes/private';
import { LoginContainer } from './app/components/pages/login/containers/login.container';

// prepare store
export const history = createBrowserHistory();
const store2 = configureStore(history, {
  session: {
    token: '',
    isLoading: false,
    errorMsg: '',
    instagramId: '',
    facebookId: '',
    FBToken: '',
    IGToken: '',
    email: '',
    password: ''
  }
});

// const initialState = window.INITIAL_REDUX_STATE;
// const store = configureStore(history, initialState);

const state = store2.getState();

ReactDOM.render(
  <div>
    <Provider store={store2 as any}>
      <Router history={history}>
        <Switch>
          <Route exact path="/login" component={LoginContainer} />
          <Route path="/" component={PrivateRoutes} />
        </Switch>
      </Router>

      {/* <ConnectedRouter history={history}> */}

      {/* </ConnectedRouter> */}
    </Provider>
  </div>,
  //  <Router history={history}>
  //     <App />
  //   </Router>
  document.getElementById('root')
);
