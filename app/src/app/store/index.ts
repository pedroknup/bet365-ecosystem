import { combineReducers, Dispatch, Reducer, Action, AnyAction } from 'redux';
import { ISessionState } from './sessions/types';
import { sessionReducer } from './sessions/reducer';
import { todoReducer } from './todos/reducer';
import { navigationReducer } from './navigation/reducer';
import { ITodoState } from './todos/types';
import { INavigationState } from './navigation/types';

// The top-level state object.
//
// `connected-react-router` already injects the router state typings for us,
// so we can ignore them here.
export interface IApplicationState {
  session: ISessionState;
  navigation: INavigationState;
  todo: ITodoState;
}

// Whenever an action is dispatched, Redux will update each top-level application state property
// using the reducer with the matching name. It's important that the names match exactly, and that
// the reducer acts on the corresponding IApplicatimport { IBetState } from './bets/types';

export const rootReducer = combineReducers<IApplicationState>({
  session: sessionReducer,
  navigation: navigationReducer,
  todo: todoReducer
});
