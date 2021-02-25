import { callAPI } from "./api.actions";

import {
    SETTINGS_ALL_RECEIVED,
    SETTINGS_GET_ALL_START,
    SETTING_DELETE_START,
    SETTING_DELETE_COMPLETE,
    SETTING_SAVE_START,
    SETTING_SAVE_COMPLETE,
} from "./actionTypes";
import { getAll } from "random-useragent";

export function getAllSettings() {
    return (dispatch) => {
        const endpoint = "settings.all.get";

        dispatch(settingsGetAllStarted());
        dispatch(callAPI(endpoint, {}, settingsAllReceived));
    };
}

function settingsGetAllStarted() {
    return {
        type: SETTINGS_GET_ALL_START,
    };
}

function settingsAllReceived(settings) {
    return {
        type: SETTINGS_ALL_RECEIVED,
        settings,
    };
}

export function saveSetting(settingID, category, key, value) {
    return (dispatch) => {
        let endpoint = "";
        let params = {};
        if (settingID === 0) {
            endpoint = "settings.editor.add";
            params = {
                category,
                key,
                value,
            };
        } else {
            endpoint = "settings.editor.update";
            params = {
                id: settingID,
                category,
                key,
                value,
            };
        }
        dispatch(settingSaveInProgress(settingID));
        dispatch(callAPI(endpoint, params, settingSaveNearCompletion, true));
    };
}

function settingSaveInProgress(settingID) {
    return {
        type: SETTING_SAVE_START,
        settingID,
    };
}

// Dispatch to get all settings
function settingSaveNearCompletion(data, recd) {
    return (dispatch) => {
        // Get all the settings
        dispatch(getAllSettings());

        // Complete the save
        dispatch(settingSaveComplete(data, recd));
    };
}

function settingSaveComplete(data, recd) {
    return {
        type: SETTING_SAVE_COMPLETE,
        data,
    };
}

export function deleteSetting(settingID, category) {
    return (dispatch) => {
        const endpoint = "settings.editor.delete";
        const params = {
            id: settingID,
        };
        dispatch(settingDeleteStart(settingID, category));
        dispatch(callAPI(endpoint, params, settingDeleteComplete));
    };
}

function settingDeleteStart(settingID, category) {
    return {
        type: SETTING_DELETE_START,
        settingID,
        category,
    };
}

function settingDeleteComplete() {
    return {
        type: SETTING_DELETE_COMPLETE,
    };
}
