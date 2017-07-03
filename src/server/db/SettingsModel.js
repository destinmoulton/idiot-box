
export default class SettingsModel {
    
    constructor(db){
        this._ibdb = db;
        this._tableName = "settings";
    }

    addSetting(category, key, value){
        const data = {
            category, key, value
        };

        this._ibdb.insert(data, this._tableName);
    }

    updateSetting(id, category, key, value){
        const where = {
            id
        };

        const data = {
            category, key, value
        };

        this._ibdb.update(where, data, this._tableName);
    }

    deleteSetting(id){
        const where = {
            id
        };

        this._ibdb.delete(where, this._tableName);
    }
}