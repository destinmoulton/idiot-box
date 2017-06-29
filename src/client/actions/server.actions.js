import { socketClient } from '../store';

import {
    IO_EMIT_SETUP,
    IO_EMIT_SUCCESS,
    IO_EMIT_FAILURE,
    IO_ON_SETUP,
    IO_ON_SUCCESS,
    IO_ON_FAILURE,

    SRV_CONNECT_RECEIVED,
    SRV_DISCONNECT_RECEIVED,
    SRV_INFO_RECEIVED,
} from './actionTypes';

export function srvConnect(){
    return (dispatch)=>{
        return socketClient.connect()
            .then(()=>{
                dispatch(waitforDisconnectReception(dispatch));
                dispatch(srvConnectionReceived());
                dispatch(srvGetServerInfo());
            });
    }
}

function waitforDisconnectReception(dispatch){
    return {
        type: 'socket',
        types: [IO_ON_SETUP, IO_ON_SUCCESS, IO_ON_FAILURE],
        promise: (socket) => {
            return socket.on('disconnect', ()=>{
                dispatch(srvDisconnectReceived());
            });
        }
    }
}

function srvConnectionReceived(){
    return {
        type: SRV_CONNECT_RECEIVED
    }
}

function srvDisconnectReceived(){
    return {
        type: SRV_DISCONNECT_RECEIVED
    }
}

export function srvGetServerInfo(){
    return (dispatch)=>{
        dispatch(waitforInfoReception(dispatch));
        dispatch(emitInfoRequest());
    }
}

function waitforInfoReception(dispatch){
    return {
        type: 'socket',
        types: [IO_ON_SETUP, IO_ON_SUCCESS, IO_ON_FAILURE],
        promise: (socket) => {
<<<<<<< HEAD
            socket.off('server.info.request');
            return socket.on('filesystem.info.ready', (recd)=>{
=======
            socket.off('server.info.ready');
            return socket.on('server.info.ready', (recd)=>{
>>>>>>> 3058bc242774c824f14886e0a60adbbb99a96106
                dispatch(srvInfoReceived(recd));
            });
        }
    }
}

function emitInfoRequest(){
    return {
        type: 'socket',
        types: [IO_EMIT_SETUP, IO_EMIT_SUCCESS, IO_EMIT_FAILURE],
        promise: (socket) => {
            return socket.emit('server.info.request');
        }
    }
}

function srvInfoReceived(serverInfo){
    return {
        type: SRV_INFO_RECEIVED,
        serverInfo
    }
}