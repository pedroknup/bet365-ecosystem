import * as sessions from './actions';
import { ActionType, getType } from 'typesafe-actions';
import { ITodoState } from './types';
import { Reducer } from 'redux';

const defaultState: ITodoState = {
  isLoading: false,
  todos: []
};

const reducer: Reducer<ITodoState> = (state = defaultState, action) => {
  let toSave;
  switch (action.type) {
    case getType(sessions.fetchTodo.request):
      return { ...state, isLoading: true };

    case getType(sessions.fetchTodo.failure):
      toSave = { ...state, isLoading: false };
      return { ...toSave };

    case getType(sessions.fetchTodo.success):
      toSave = {
        ...state,
        todos: action.payload.todos,
        isLoading: false
      };
      return { ...toSave };

    default:
      return state;
  }
};

export { reducer as todoReducer };
