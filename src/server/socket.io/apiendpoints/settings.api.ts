import ibdb from '../../db/IBDB';

import SettingsModel from '../../models/db/SettingsModel';

const settingsModel = new SettingsModel(ibdb);
    
const settings = {
    all: {
        get: {
            params: [],
            func: ()=>settingsModel.getAll()
        }
    },
    category: {
        get: {
            params: ['category'],
            func: (category)=>settingsModel.getAllForCategory(category)
        },
    },
    editor: {
        add: {
            params: ['category', 'key', 'value'],
            func: (category, key, value)=> settingsModel.addSetting(category, key, value)
        },
        update: {
            params: ['id', 'category', 'key', 'value'],
            func: (id, category, key, value)=> settingsModel.updateSetting(id, category, key, value)
        },
        delete: {
            params: ['id'],
            func: (id)=>settingsModel.deleteSetting(id)
        }
    }
};

export default settings;