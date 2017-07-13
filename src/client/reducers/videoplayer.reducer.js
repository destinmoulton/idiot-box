
import {
    VP_CHANGE_STATE
} from '../actions/actionTypes';

const INITIAL_STATE = {
    videoPlayerIsActive: false
};

export default function videoplayerReducer(state = INITIAL_STATE, action){
    switch(action.type){
        case VP_CHANGE_STATE:
            return {
                ...state,
                videoPlayerIsActive: action.playerState
            }
        default:
            return state;
    }
}