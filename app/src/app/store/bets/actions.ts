import { createAction, createAsyncAction, action, getType } from 'typesafe-actions';
import { bet } from '../../../../../api/src/entities/bet';

export const fetchBet = createAsyncAction(
  'bet/FETCH_REQUEST',
  'bet/FETCH_SUCCESS',
  'bet/FETCH_FAILURE'
)<void, { bets: bet[] }, string>();

export const fetchBetAction = (token: string) => action(getType(fetchBet.request), token);
