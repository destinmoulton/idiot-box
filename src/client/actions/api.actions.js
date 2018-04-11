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
        dispatch(listenForAPIResponse(dispatch));
    }
}

function listenForAPIErrors(){
    return {
        type: 'socket',
        types: [IO_ON_SETUP, IO_ON_SUCCESS, IO_ON_FAILURE],
        promise: (socket) => {
            return socket.on('api.error', (recd)=>{
                console.error(recd.message);
                console.error("Request contents: ", recd.request);
            });
        }
    }
}

function listenForAPIResponse(dispatch){
    return {
        type: 'socket',
        types: [IO_ON_SETUP, IO_ON_SUCCESS, IO_ON_FAILURE],
        promise: (socket) => {
            return socket.on('api.response', (recd)=>{
                console.log("api.response received", recd);
                if (apiRequests[recd.id].shouldDispatch) {
                    dispatch(apiRequests[recd.id].dispatchCallback(recd.data, recd));
                } else {
                    apiRequests[recd.id].dispatchCallback(recd.data, recd);
                }
                delete apiRequests[recd.id];
            });
        }
    }
}

export function callAPI(endpoint, params, dispatchCallback, shouldDispatch = true){
    apiID++;
    apiRequests[apiID] = {
        endpoint,
        params,
        dispatchCallback,
        shouldDispatch
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