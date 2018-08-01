import {connectRouter, routerMiddleware} from 'connected-react-router';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import activityReducer from '@src/app/reducers/activity';
import messageReducer from '@src/app/reducers/message';
import securityReducer from '@src/app/reducers/security';
import tabReducer from '@src/app/reducers/tab';
import userReducer from '@src/app/reducers/user';
// import { loadState } from '@src/localStorage';

// const persistedState = loadState();

const reducer = combineReducers({
  tabLogic: tabReducer,
  userLogic: userReducer,
  activityLogic: activityReducer,
  securityLogic: securityReducer,
  message: messageReducer,
});

export default (history) => createStore(
  connectRouter(history)(reducer),
  // persistedState,
  composeWithDevTools(
    applyMiddleware(
      thunk,
      routerMiddleware(history)
    )
  )
);
