import { emitAPIRequest } from './api.actions';

import {
    SETTINGS_ALL_RECEIVED,
    SETTING_DELETE_START,
    SETTING_DELETE_COMPLETE,
    SETTING_SAVE_START,
    SETTING_SAVE_COMPLETE
} from './actionTypes';


export function getAllSettings(){
    return (dispatch)=>{
        const endpoint = 'settings.all.get';
        
        dispatch(emitAPIRequest(endpoint, {}, settingsAllReceived));
    }
}

function settingsAllReceived(settings){
    return {
        type: SETTINGS_ALL_RECEIVED,
        settings
    }
}

export function saveSetting(settingID, category, key, value){
    return (dispatch)=>{
        let endpoint = '';
        let params = {};
        if(settingID === 0){
            endpoint = 'settings.editor.add';
            params = {
                category,
                key,
                value
            };
        } else {
            endpoint = 'settings.editor.update';
            params = {
                id: settingID,
                category,
                key,
                value
            };
        }
        dispatch(settingSaveInProgress(settingID));
        dispatch(emitAPIRequest(endpoint, params, settingSaveComplete));
    }
}

function settingSaveInProgress(settingID){
    return {
        type:SETTING_SAVE_START,
        settingID
    }
}

function settingSaveComplete(data, recd){
    return {
        type:SETTING_SAVE_COMPLETE,
        data
    }
}

export function deleteSetting(settingID, category){
    return (dispatch)=>{
        const endpoint = 'settings.editor.delete';
        const params = {
            id: settingID
        };
        dispatch(settingDeleteStart(settingID, category));
        dispatch(emitAPIRequest(endpoint, params, settingDeleteComplete));
    }
}

function settingDeleteStart(settingID, category){
    return {
        type: SETTING_DELETE_START,
        settingID,
        category
    }
}

function settingDeleteComplete(){
    return {
        type: SETTING_DELETE_COMPLETE
    }
}