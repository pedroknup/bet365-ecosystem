import { todo } from '../../../../../api/src/entities/todo';


export interface ITodoState {
  isLoading: boolean;
  todos?: todo[]
}

