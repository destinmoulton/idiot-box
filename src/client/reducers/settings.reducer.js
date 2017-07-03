import {
    SETTING_LIST_RECEIVED
} from '../actions/actionTypes';


const INITIAL_STATE = {
    settings:{}
}

export default function settingsReducer(state = INITIAL_STATE, action){
    switch(action.type){
        case SETTING_LIST_RECEIVED:
            const settings = {...state.settings};
            settings[action.category] = action.settings;
            return {
                ...state,
                settings
            }
        default:
            return state;
    }

}