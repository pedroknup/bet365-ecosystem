import { createAction, createAsyncAction, action, getType } from 'typesafe-actions';
import { todo } from '../../../../../api/src/entities/todo';

export const fetchTodo = createAsyncAction(
  'todo/FETCH_REQUEST',
  'todo/FETCH_SUCCESS',
  'todo/FETCH_FAILURE'
)<void, { todos: todo[] }, string>();

export const fetchTodoAction = (token: string) => action(getType(fetchTodo.request), token);
