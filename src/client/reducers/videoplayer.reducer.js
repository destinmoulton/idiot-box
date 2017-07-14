
import {
    VP_CHANGE_STATE,
    VP_RECEIVED_INFO
} from '../actions/actionTypes';

const INITIAL_STATE = {
    playerIsActive: false,
    videoInfo: {}
};

export default function videoplayerReducer(state = INITIAL_STATE, action){
    switch(action.type){
        case VP_CHANGE_STATE:
            return {
                ...state,
                playerIsActive: action.playerState
            }
        case VP_RECEIVED_INFO:
            return {
                ...state,
                videoInfo: action.videoInfo
            }
        default:
            return state;
    }
}