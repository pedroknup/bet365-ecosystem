
import * as sessions from './actions';
import { Session, ISessionState } from './types';
import { ActionType, getType } from 'typesafe-actions';
import { Middleware } from 'redux';
// import { userPK } from '../../dummy-data/users';

export const loginMiddleware: Middleware<{}, ISessionState> = ({ getState }) => (next) => async (
  action: ActionType<typeof sessions>,
) => {
  next(action);

  // if (action.type === getType(sessions.loginFBAction)) {
  //   const state = getState();
  //   const newState = JSON.parse(JSON.stringify(state));
  //   const FBToken = newState.sessions.FBToken;
  //   console.log(newState.sessions.FBToken);
  //   next(sessions.loginFBSession.request());

  //   if (!FBToken) {
  //     next(sessions.loginFBSession.failure('Ocorreu algo errado'));
  //     return;
  //   }
  //   const fetchOption: RequestInit = {
  //     // signal,
  //     method: 'POST',
  //     headers: new Headers({
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     }),
  //     body: JSON.stringify({ fbtoken: FBToken }),
  //   };

  //   await fetch(`${ROOT_URL}/auth/login`, fetchOption)
  //     .then(async (response) => {
  //       if (response.ok) {
  //         const myJson = await response.json();
  //         const session = {
  //           token: myJson.token,
  //           deviceId: 'device-id',
  //         };
  //         console.log(session);
  //         next(sessions.loginFBSession.success(session));
  //       } else {
  //         const result = await response.text();
  //         next(sessions.loginFBSession.failure(result));
  //       }
  //     })
  //     .catch((err) => {
  //       console.log('Error' + err);

  //       setTimeout(() => {
  //         next(sessions.loginFBSession.failure(JSON.stringify(err)));
  //       }, 2000);
  //     });
  // } else if (action.type === getType(sessions.loginIGAction)) {
  //   const state = getState();
  //   const newState = JSON.parse(JSON.stringify(state));
  //   next(sessions.loginIGSession.request());
  //   const IGToken = newState.sessions.IGToken;
  //   const instagramId = newState.sessions.instagramId;

  //   if (!(IGToken && instagramId)) {
  //     next(sessions.loginFBSession.failure('Ocorreu algo errado'));
  //     return;
  //   }
  //   const fetchOption: RequestInit = {
  //     // signal,
  //     method: 'POST',
  //     headers: new Headers({
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     }),
  //     body: JSON.stringify({ IGToken, instagramId }),
  //   };

  //   await fetch(`${ROOT_URL}/auth/loginig`, fetchOption)
  //     .then(async (response) => {
  //       if (response.ok) {
  //         const myJson = await response.json();

  //         const session = {
  //           user: myJson.user,
  //           token: myJson.token,
  //           deviceId: 'device-id',
  //         };
  //         next(sessions.loginIGSession.success(session));
  //       } else {
  //         const result = await response.text();
  //         next(sessions.loginIGSession.failure(result));
  //       }
  //     })
  //     .catch((err) => {
  //       console.log('Error' + err);

  //       setTimeout(() => {
  //         next(sessions.loginIGSession.failure(JSON.stringify(err)));
  //       }, 2000);
  //     });
  // } 
  // else if (action.type === getType(sessions.logoutAction)) {
  //   next(sessions.logoutSession.request());
  //   const fetchOption: RequestInit = {
  //     // signal,
  //     method: 'POST',
  //     headers: new Headers({
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     }),
  //     body: JSON.stringify({ phone: '123123', password: '123123' }),
  //   };

  //   try {
  //     const response = await fetch(`${ROOT_URL}/auth/logout`, fetchOption);
  //     const myJson = await response.json();
  //     console.log(JSON.stringify(myJson));
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
};
