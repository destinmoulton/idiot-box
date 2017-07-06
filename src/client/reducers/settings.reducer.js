import {
    SETTING_LIST_RECEIVED,
    SETTING_SAVE_START,
    SETTING_SAVE_COMPLETE
} from '../actions/actionTypes';


const INITIAL_STATE = {
    settings:{
        directories: []
    },
    savesInProgress:[]
}

export default function settingsReducer(state = INITIAL_STATE, action){
    switch(action.type){
        case SETTINGS_LIST_RECEIVED:
            const settings = {...state.settings};
            settings[action.category] = action.settings;
            return {
                ...state,
                settings
            }
        case SETTING_SAVE_START:
            let savesInProgressStart = [...state.savesInProgress];
            savesInProgressStart.push(action.settingID);
            return {
                ...state,
                savesInProgress: savesInProgressStart
            }
        case SETTING_SAVE_COMPLETE:
            let savesInProgressComplete = [...state.savesInProgress];
            savesInProgressComplete.splice(savesInProgressComplete.indexOf(action.settingID), 1);
            return {
                ...state,
                savesInProgress: savesInProgressComplete
            }
        default:
            return state;
    }

}