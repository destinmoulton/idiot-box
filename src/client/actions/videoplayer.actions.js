import { callAPI } from './api.actions';

import {
    VP_CHANGE_STATE,
    VP_RECEIVED_INFO
} from './actionTypes';

export function isPlayerRunning(){
    return (dispatch)=>{
        setTimeout(()=>{
            const endpoint = 'videoplayer.cmd.isRunning';
            dispatch(callAPI(endpoint, {}, playerRunningChangeState));
            isPlayerRunning();
        }, 200);
    }
}

function playerRunningChangeState(playerState){
    return {
        type: VP_CHANGE_STATE,
        playerState
    }
}

export function getVideoInfo(){
    return (dispatch)=>{
        const endpoint = 'videoplayer.cmd.info';
        dispatch(callAPI(endpoint, {}, videoReceivedInfo));
    }
}

function videoReceivedInfo(videoInfo){
    return {
        type: VP_RECEIVED_INFO,
        videoInfo
    }
}