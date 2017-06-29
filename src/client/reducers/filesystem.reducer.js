import {
    FS_DIR_RECEIVED,
} from '../actions/actionTypes';

const INITIAL_STATE = {
    retrievalInProgress: false,
    dirs: {}
};

export default function filesystemReducer(state = INITIAL_STATE, action){
    switch(action.type){
        case FS_DIR_RECEIVED:
            const newDirs = {...state.dirs};
            newDirs[action.dir.requestID] = action.dir.list;
            return {
                ...state,
                dirs: newDirs
            }
        default:
            return state;
    }
}