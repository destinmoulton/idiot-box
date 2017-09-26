import { createStore, combineReducers, applyMiddleware } from 'redux'
import { routerReducer } from 'react-router-redux'
import thunk from 'redux-thunk';

import socketMiddleware from './socketMiddleware';
import SocketAPI from './SocketAPI';

import errorReducer from './reducers/error.reducer';
import serverReducer from './reducers/server.reducer';
import settingsReducer from './reducers/settings.reducer';
import videoplayerReducer from './reducers/videoplayer.reducer';

const socketClient = new SocketAPI();
const socketMiddle = socketMiddleware(socketClient);

const store = createStore(
  combineReducers({
    error: errorReducer,
    server: serverReducer,
    settings: settingsReducer,
    router: routerReducer,
    videoplayer: videoplayerReducer
  }),
  applyMiddleware(
    socketMiddle,
    thunk
  )
);

export default store;
export { socketClient };