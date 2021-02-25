import { isJSON } from "../lib/json.lib";
import {
    SETTINGS_ALL_RECEIVED,
    SETTING_DELETE_START,
    SETTING_DELETE_COMPLETE,
    SETTING_SAVE_START,
    SETTING_SAVE_COMPLETE,
    SETTINGS_GET_ALL_START,
} from "../actions/actionTypes";

const INITIAL_STATE = {
    currentlyDeletingSettingID: -1,
    currentlyDeletingSettingCategory: "",
    currentlySavingSettingID: -1,
    deleteInProgress: false,
    hasAllSettings: false,
    lastAPIAction: "",
    lastSavedSettingID: -1,
    isSaveInProgress: false,
    isGetAllInProgress: false,
    settings: {
        directories: [],
        links: [],
    },
};

export default function settingsReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case SETTINGS_GET_ALL_START: {
            return {
                ...state,
                isGetAllInProgress: true,
            };
        }
        case SETTINGS_ALL_RECEIVED:
            const nextSettings = _.cloneDeep(INITIAL_STATE.settings);
            action.settings.forEach((setting) => {
                const category = setting.category;
                if (!nextSettings.hasOwnProperty(category)) {
                    throw new Error(
                        `settings.reducer :: SETTINGS_ALL_RECEIVED :: add setting ${category} to the INITIAL_STATE`
                    );
                }
                if (isJSON(setting.value)) {
                    // Some settings store the value as a json obj
                    setting.value = JSON.parse(setting.value);
                }
                nextSettings[category].push(setting);
            });

            return {
                ...state,
                settings: nextSettings,
                hasAllSettings: true,
                isGetAllInProgress: false,
            };
        case SETTING_SAVE_START:
            return {
                ...state,
                saveInProgress: true,
                currentlySavingSettingID: action.settingID,
                lastAPIAction: "",
            };
        case SETTING_SAVE_COMPLETE:
            return {
                ...state,
                saveInProgress: false,
                currentlySavingSettingID: -1,
                lastSavedSettingID: state.currentlySavingSettingID,
                lastAPIAction: "save",
            };
        case SETTING_DELETE_START:
            return {
                ...state,
                deleteInProgress: true,
                currentlyDeletingSettingID: action.settingID,
                currentlyDeletingSettingCategory: action.category,
                lastAPIAction: "",
            };
        case SETTING_DELETE_COMPLETE:
            const copySettings = { ...state.settings };
            const copyCategory = [
                ...copySettings[state.currentlyDeletingSettingCategory],
            ];

            for (let i = 0; i < copyCategory.length; i++) {
                if (copyCategory[i].id === state.currentlyDeletingSettingID) {
                    copyCategory.splice(i, 1);
                }
            }
            copySettings[state.currentlyDeletingSettingCategory] = copyCategory;
            return {
                ...state,
                settings: copySettings,
                deleteInProgress: false,
                currentlyDeletingSettingID: -1,
                currentlyDeletingSettingCategory: "",
                lastAPIAction: "delete",
            };
        default:
            return state;
    }
}
