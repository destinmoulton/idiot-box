import {
    IO_ON_SETUP, 
    IO_ON_SUCCESS, 
    IO_ON_FAILURE,
    ERROR_RECEIVED
} from '../actions/actionTypes';

export function listenForErrors(){
    return {
        type: 'socket',
        types: [IO_ON_SETUP, IO_ON_SUCCESS, IO_ON_FAILURE],
        promise: (socket) => {
            return socket.on('error', (message)=>{
                dispatch(errorReceived(message));
            });
        }
    }
}

function errorReceived(message){
    return {
        action: ERROR_RECEIVED,
        message: message
    }
}