import {connectRouter, routerMiddleware} from 'connected-react-router';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import appDataReducer from '@src/app/reducers/appData';
import messageReducer from '@src/app/reducers/message';

// import { loadState } from '@src/localStorage';

// const persistedState = loadState();

const reducer = combineReducers({
  message: messageReducer,
  appData: appDataReducer,
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
