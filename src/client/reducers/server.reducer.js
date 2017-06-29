import {
    SRV_CONNECT_RECEIVED,
    SRV_DISCONNECT_RECEIVED,
    SRV_INFO_RECEIVED
} from '../actions/actionTypes';


const INITIAL_STATE = {
    isServerConnected: false,
    hasServerInfo: false,
    serverInfo: {}
};

export default function serverReducer(state = INITIAL_STATE, action){
    switch(action.type){
        case SRV_CONNECT_RECEIVED:
            return {
                ...state,
                isServerConnected: true
            }
        case SRV_DISCONNECT_RECEIVED:
            return {
                ...state,
                isServerConnected: false
            }
        case SRV_INFO_RECEIVED:
            return {
                ...state,
                hasServerInfo: true,
                serverInfo: action.serverInfo
            }
        default: 
            return state;
    }
}
