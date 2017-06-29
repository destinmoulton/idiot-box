import {
    IO_EMIT_SETUP,
    IO_EMIT_SUCCESS,
    IO_EMIT_FAILURE,
    IO_ON_SETUP,
    IO_ON_SUCCESS,
    IO_ON_FAILURE,

    FS_DIR_RECEIVED,
} from './actionTypes';

export function getDirList(requestID, path){
    return (dispatch)=>{
        dispatch(waitforDirReception(dispatch));
        dispatch(emitDirRequest(requestID, path));
    }
}

function emitDirRequest(requestID, path){
    const options = {
        requestID,
        path
    };
    return {
        type: 'socket',
        types: [IO_EMIT_SETUP, IO_EMIT_SUCCESS, IO_EMIT_FAILURE],
        promise: (socket) => {
            return socket.emit('filesystem.dir.list', options);
        }
    }
}

function waitforDirReception(dispatch){
    return {
        type: 'socket',
        types: [IO_ON_SETUP, IO_ON_SUCCESS, IO_ON_FAILURE],
        promise: (socket) => {
            socket.off('filesystem.dir.ready');
            return socket.on('filesystem.dir.ready', (recd)=>{
                dispatch(fsDirAcquired(recd));
            });
        }
    }
}

function fsDirAcquired(dir){
    return {
        type: FS_DIR_RECEIVED,
        dir
    }
}
