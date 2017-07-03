import {
    IO_EMIT_SETUP,
    IO_EMIT_SUCCESS,
    IO_EMIT_FAILURE,

    SETTING_LIST_RECEIVED
} from './actionTypes';

export function getSettingsForCategory(category){
    return (dispatch)=>{
        emitGetSettingsRequest(category);
        waitforSettingsReception(dispatch, category);
    }
}

function emitGetSettingsRequest(category){
    const options = {
        category
    };
    return {
        type: 'socket',
        types: [IO_EMIT_SETUP, IO_EMIT_SUCCESS, IO_EMIT_FAILURE],
        promise: (socket) => {
            return socket.emit('settings.get.category', options);
        }
    }
}

function waitforSettingsReception(dispatch, category){
    return {
        type: 'socket',
        types: [IO_EMIT_SETUP, IO_EMIT_SUCCESS, IO_EMIT_FAILURE],
        promise: (socket) => {
            return socket.on('settings.data.category', (settings)=>{
                dispatch(settingsReceived(category, settings));
            });
        }
    }
}

function settingsReceived(category, settings){
    return {
        type: SETTINGS_LIST_RECEIVED,
        category,
        settings
    }
}