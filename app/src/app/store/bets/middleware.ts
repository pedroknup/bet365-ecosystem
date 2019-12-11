import * as betActions from './actions';
import { ActionType, getType } from 'typesafe-actions';
import { Middleware, MiddlewareAPI, Dispatch, Action } from 'redux';
// import { userPK } from '../../dummy-data/users';
import { IApplicationState } from '../index';
import { AuthApi, BetApi } from '../../../api/api';
import { user } from '../../../../../api/src/entities/user';
import browserHistory from 'react-router';
import { history } from '../../../main';
import { bet } from '../../../../../api/src/entities/bet';

const betMiddleware: Middleware = (store: any) => (next) => (action: any) => {
  if (action.type === getType(betActions.fetchBet.request)) {
    console.log('hit');
    const { session } = store.getState();
    if (process.env.NODE_ENV !== 'production') {
      console.log(action.payload);
    }

    const token = action.payload;
    console.log('token', token);
    const betApi = new BetApi();
    betApi
      .betGet({ headers: { auth: token } })
      .then((response) => {
        console.log(response.body);
        const bets: bet[] = response.body;

        return next(betActions.fetchBet.success({ bets: bets }));
      })
      .catch((error: any) => {
        console.log(error.response.body.error);
        return next(betActions.fetchBet.failure(error.response.body.error));
      });
    // return next(action);
  } else return next(action);
};

export { betMiddleware };
