
export default class SettingsModel {
    
    constructor(db){
        this._ibdb = db;
        this._tableName = "settings";
    }

    getAllForCategory(category){
        const where = {
            category
        }

        return this._ibdb.getAll(where);
    }

    addSetting(category, key, value){
        const data = {
            category, key, value
        };

        return this._ibdb.insert(data, this._tableName);
    }

    updateSetting(id, category, key, value){
        const where = {
            id
        };

        const data = {
            category, key, value
        };

        return this._ibdb.update(where, data, this._tableName);
    }

    deleteSetting(id){
        const where = {
            id
        };

        return this._ibdb.delete(where, this._tableName);
    }
}