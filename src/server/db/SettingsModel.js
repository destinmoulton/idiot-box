import DatabaseModel from 'DatabaseModel';

export default class Settings extends DatabaseModel{
    
    constructor(db){
        super(db);

        this._tableName = "settings";
    }

    addSetting(category, key, value){
        const data = {
            category, key, value
        };

        this._db.insert(addSetting);
    }
}