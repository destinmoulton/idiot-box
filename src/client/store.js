import { createStore, combineReducers, applyMiddleware } from 'redux'
import createBrowserHistory from 'history/createBrowserHistory'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk';

import socketMiddleware from './socketMiddleware';
import SocketAPI from './SocketAPI';

import errorReducer from './reducers/error.reducer';
import filesystemReducer from './reducers/filesystem.reducer';
import serverReducer from './reducers/server.reducer';
import settingsReducer from './reducers/settings.reducer';

const history = createBrowserHistory()
const middlewareHistory = routerMiddleware(history)
const socketClient = new SocketAPI();
const socketMiddle = socketMiddleware(socketClient);

const store = createStore(
  combineReducers({
    error: errorReducer,
    filesystem: filesystemReducer,
    server: serverReducer,
    settings: settingsReducer,
    router: routerReducer
  }),
  applyMiddleware(
    middlewareHistory,   
    thunk,
    socketMiddle
  )
);

export default store;
export { history, socketClient };