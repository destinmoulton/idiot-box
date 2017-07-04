import { emitAPIRequest } from './api.actions';

import {
    SETTING_LIST_RECEIVED
} from './actionTypes';

export function getSettingsForCategory(category){
    return (dispatch)=>{
        const endpoint = 'settings.category.get';
        const params = {
            category
        };
        dispatch(emitAPIRequest(endpoint, params, settingsReceived));
    }
}

function settingsReceived(category, settings){
    console.log("settingsReceived", category, settings);
    return {
        type: SETTINGS_LIST_RECEIVED,
        category,
        settings
    }
}