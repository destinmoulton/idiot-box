import { emitAPIRequest } from './api.actions';

import {
    VP_CHANGE_STATE
} from './actionTypes';

export function isVideoPlaying(category){
    return (dispatch)=>{
        setTimeout(()=>{
            const endpoint = 'videoplayer.cmd.isRunning';
            dispatch(emitAPIRequest(endpoint, {}, videoPlayerChangeState));
        }, 200);
    }
}

function videoPlayerChangeState(playerState){
    return {
        type: VP_CHANGE_STATE,
        playerState
    }
}