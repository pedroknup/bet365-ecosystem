import { StateType } from 'typesafe-actions';
import { Middleware } from 'redux';

import rootReducer from './root-reducer';

import * as sessionsActions from './sessions/actions';
import { loginMiddleware } from './sessions/middleware';

export { default } from './store';
export { default as rootReducer } from './root-reducer';

export const selectors = {};

export const actions = {
  sessions: sessionsActions
};

export const middlewares: Middleware[] = [loginMiddleware];

export type RootState = StateType<typeof rootReducer>;
