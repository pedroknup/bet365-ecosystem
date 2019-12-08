import * as sessions from './actions';
import { ActionType, getType } from 'typesafe-actions';
import { SessionState } from './types';
import { loginMiddleware } from './middleware';

const defaultState: SessionState = {
  token: '',
  isLoading: false,
  errorMsg: '',
  deviceId: '',
  FBToken: '',
  IGToken: ''
};

export default (state = defaultState, action: ActionType<typeof sessions>): SessionState => {
  let toSave;
  switch (action.type) {
    case getType(sessions.logoutSession.request):
      return { ...state, token: '' };

    case getType(sessions.loginFBSession.failure):
      toSave = {
        ...state,
        isLoading: false,
        user: undefined,
        token: '',
        errorMsg: action.payload
      };
      // localStorage.setItem('data', JSON.stringify(toSave));
      return { ...toSave };
    case getType(sessions.loginIGSession.failure):
      toSave = {
        ...state,
        isLoading: false,
        user: undefined,
        token: '',
        errorMsg: action.payload
      };
      // localStorage.setItem('data', JSON.stringify(toSave));
      return { ...toSave };

    case getType(sessions.loginFBSession.request):
      return { ...state, isLoading: true, errorMsg: '' };

    case getType(sessions.loginFBSession.success):
      toSave = {
        ...state,
        // phoneSession: '',
        // passwordSession: '',
        token: action.payload.token,
        deviceId: action.payload.deviceId,
        errorMsg: '',
        isLoading: false
      };
      //   localStorage.setItem('data', JSON.stringify(toSave));
      //  alert('saved');
      return { ...toSave };

    default:
      return state;
  }
};
