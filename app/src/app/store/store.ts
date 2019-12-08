import { createStore, applyMiddleware, compose, Middleware } from 'redux';

import rootReducer from './root-reducer';
import { loginMiddleware } from './sessions/middleware';

const composeEnhancers = compose;

const middlewares: Middleware[] = [loginMiddleware];

function configureStore(initialState?: {}) {
  return createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(...middlewares)));
}

// pass an optional param to rehydrate state on app start
const store = configureStore();

// export store singleton instance
export default store;
