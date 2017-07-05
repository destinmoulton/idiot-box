import { emitAPIRequest } from './api.actions';

import {
    SETTINGS_LIST_RECEIVED
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

function settingsReceived(settings, recd){
    console.log("settingsReceived", settings);
    return {
        type: SETTINGS_LIST_RECEIVED,
        category: recd.request.params.category,
        settings
    }
}