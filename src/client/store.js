import { createStore, combineReducers, applyMiddleware } from 'redux'
import createBrowserHistory from 'history/createBrowserHistory'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk';

import socketMiddleware from './socketMiddleware';
import SocketAPI from './SocketAPI';

import filesystemReducer from './reducers/filesystem.reducer';
import serverReducer from './reducers/server.reducer';

const history = createBrowserHistory()
const middlewareHistory = routerMiddleware(history)
const socketClient = new SocketAPI();
const socketMiddle = socketMiddleware(socketClient);

const store = createStore(
  combineReducers({
    filesystem: filesystemReducer,
    server: serverReducer,
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