import { createAction, createAsyncAction } from 'typesafe-actions';
import { Session } from './types';

export const loginFBSession = createAsyncAction(
  'sessions/FETCH_FB_REQUEST',
  'sessions/FETCH_FB_SUCCESS',
  'sessions/FETCH_FB_FAILURE',
)<void, Session, string>();

export const loginIGSession = createAsyncAction(
  'sessions/FETCH_IG_REQUEST',
  'sessions/FETCH_IG_SUCCESS',
  'sessions/FETCH_IG_FAILURE',
)<void, Session, string>();

export const logoutSession = createAsyncAction(
  'sessions/LOGOUT_REQUEST',
  'sessions/LOGOUT_SUCCESS',
  'sessions/LOGOUT_FAILURE',
)<void, Session, string>();

export const loginFBAction = createAction('sessions/FETCH_FB_REQUEST', (resolve) => () => resolve());
export const loginIGAction = createAction('sessions/FETCH_IG_REQUEST', (resolve) => () => resolve());
export const logoutAction = createAction('sessions/LOGOUT_REQUEST', (resolve) => () => resolve());
// export const storeAuthData = createAction('sessions/STORE_AUTH', (resolve) => (payload: IStoreAuth) =>
//   resolve(payload),
// );

export const verify = createAction('sessions/VERIFY', (resolve) => () => resolve());
