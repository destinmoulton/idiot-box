import { emitAPIRequest } from './api.actions';

import {
    VP_CHANGE_STATE
} from './actionTypes';

export function isVideoRunning(){
    return (dispatch)=>{
        setTimeout(()=>{
            const endpoint = 'videoplayer.cmd.isRunning';
            dispatch(emitAPIRequest(endpoint, {}, videoRunningChangeState));
            isVideoRunning();
        }, 200);
    }
}

function videoRunningChangeState(playerState){
    return {
        type: VP_CHANGE_STATE,
        playerState
    }
}