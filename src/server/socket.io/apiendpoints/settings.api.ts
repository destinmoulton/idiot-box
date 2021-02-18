import ibdb from "../../db/IBDB";

import SettingsModel from "../../models/db/SettingsModel";

const settingsModel = new SettingsModel(ibdb);

const settings = {
    all: {
        get: {
            params: [],
            func: async () => await settingsModel.getAll(),
        },
    },
    category: {
        get: {
            params: ["category"],
            func: async (category) => {
                return await settingsModel.getAllForCategory(category);
            },
        },
    },
    editor: {
        add: {
            params: ["category", "key", "value"],
            func: async (category, key, value) => {
                return await settingsModel.addSetting(category, key, value);
            },
        },
        update: {
            params: ["id", "category", "key", "value"],
            func: async (id, category, key, value) => {
                return await settingsModel.updateSetting(
                    id,
                    category,
                    key,
                    value
                );
            },
        },
        delete: {
            params: ["id"],
            func: async (id) => await settingsModel.deleteSetting(id),
        },
    },
};

export default settings;
