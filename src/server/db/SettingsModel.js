
export default class SettingsModel {
    
    constructor(db){
        this._db = db;
        this._tableName = "settings";
    }

    addSetting(category, key, value){
        const data = {
            category, key, value
        };

        this._db.insert(data, this._tableName);
    }
}