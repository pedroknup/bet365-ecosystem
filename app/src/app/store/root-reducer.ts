import { combineReducers } from 'redux';

import sessions from './sessions/reducer';

const rootReducer = combineReducers({
  sessions
});

export default rootReducer;
