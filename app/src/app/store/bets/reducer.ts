import * as sessions from './actions';
import { ActionType, getType } from 'typesafe-actions';
import { IBetState } from './types';
import { Reducer } from 'redux';

const defaultState: IBetState = {
  isLoading: false,
  bets: []
};

const reducer: Reducer<IBetState> = (state = defaultState, action) => {
  let toSave;
  switch (action.type) {
    case getType(sessions.fetchBet.request):
      return { ...state, isLoading: true };

    case getType(sessions.fetchBet.failure):
      toSave = { ...state, isLoading: false };
      return { ...toSave };

    case getType(sessions.fetchBet.success):
      toSave = {
        ...state,
        bets: action.payload.bets,
        isLoading: false
      };
      return { ...toSave };

    default:
      return state;
  }
};

export { reducer as betsReducer };
