import {
    SETTINGS_LIST_RECEIVED,
    SETTING_DELETE_START,
    SETTING_DELETE_COMPLETE,
    SETTING_SAVE_START,
    SETTING_SAVE_COMPLETE
} from '../actions/actionTypes';


const INITIAL_STATE = {
    settings:{
        directories: []
    },
    saveInProgress: false,
    currentlySavingSettingID: -1,
    lastSavedSettingID: -1,
    deleteInProgress: false,
    currentlyDeletingSettingID: -1,
    currentlyDeletingSettingCategory: "",
    lastAPIAction: ""
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
            return {
                ...state,
                saveInProgress: true,
                currentlySavingSettingID: action.settingID,
                lastAPIAction: ""
            }
        case SETTING_SAVE_COMPLETE:
            const newSettings = {...state.settings};
            
            const category = newSettings[action.data.category];
            if(state.currentlySavingSettingID === 0){
                category.push(action.data);
            } else {
                for(let i=0; i<category.length; i++){
                    if(category[i].id === action.data.id){
                        category[i].key = action.data.key;
                        category[i].value = action.data.value;
                    }
                }
            }
            newSettings[action.data.category] = category;
            return {
                ...state,
                settings: newSettings,
                saveInProgress: false,
                currentlySavingSettingID: -1,
                lastSavedSettingID: state.currentlySavingSettingID,
                lastAPIAction: "save"
            }
        case SETTING_DELETE_START:
            return {
                ...state,
                deleteInProgress: true,
                currentlyDeletingSettingID: action.settingID,
                currentlyDeletingSettingCategory: action.category,
                lastAPIAction: ""
            }
        case SETTING_DELETE_COMPLETE:
            const copySettings = {...state.settings};
            const copyCategory = [...copySettings[state.currentlyDeletingSettingCategory]];

            for(let i = 0; i<copyCategory.length; i++){
                if(copyCategory[i].id === state.currentlyDeletingSettingID){
                    copyCategory.splice(i, 1);
                }
            }
            copySettings[state.currentlyDeletingSettingCategory] = copyCategory;
            return {
                ...state,
                settings:copySettings,
                deleteInProgress: false,
                currentlyDeletingSettingID: -1,
                currentlyDeletingSettingCategory: "",
                lastAPIAction: "delete"
            }
        default:
            return state;
    }

}