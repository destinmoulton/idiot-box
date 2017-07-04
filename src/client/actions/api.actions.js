import {
    IO_EMIT_SETUP,
    IO_EMIT_SUCCESS,
    IO_EMIT_FAILURE,
    IO_ON_SETUP,
    IO_ON_SUCCESS,
    IO_ON_FAILURE,
} from './actionTypes';

let apiID = 0;
let apiRequests = {};

export function setupAPI(){
    return (dispatch)=>{
        dispatch(listenForAPIErrors());
        dispatch(listenForAPIResponse());
    }
}

function listenForAPIErrors(){
    return {
        type: 'socket',
        types: [IO_ON_SETUP, IO_ON_SUCCESS, IO_ON_FAILURE],
        promise: (socket) => {
            return socket.on('api.error', (recd)=>{
                console.error(recd.message);
                console.error(recd.originalRequest);
            });
        }
    }
}

function listenForAPIResponse(){
    return {
        type: 'socket',
        types: [IO_ON_SETUP, IO_ON_SUCCESS, IO_ON_FAILURE],
        promise: (socket) => {
            return socket.on('api.response', (recd)=>{
                dispatchAPICallback(recd);
            });
        }
    }
}

export function emitAPIRequest(endpoint, params, dispatchCallback){
    apiID++;
    apiRequests[apiID] = {
        endpoint,
        params,
        dispatchCallback
    };
    const request = {
        id: apiID,
        endpoint,
        params
    };
    return {
        type: 'socket',
        types: [IO_EMIT_SETUP, IO_EMIT_SUCCESS, IO_EMIT_FAILURE],
        promise: (socket) => {
            return socket.emit('api.request', request);
        }
    }
}

function dispatchAPICallback(recd){
    return (dispatch)=>{
        dispatch(apiRequests[recd.id].dispatchCallback(recd.data, recd));
        delete apiRequests[recd.id];
    };
}