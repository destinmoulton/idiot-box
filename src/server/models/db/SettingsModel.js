import logger from '../../logger';
export default class SettingsModel {
    
    constructor(db){
        this._ibdb = db;
        this._tableName = "settings";
    }

    getAllForCategory(category){
        const where = {
            category
        }
        return this._ibdb.getAll(where, this._tableName);
    }

    getSingleByID(settingID){
        const where = {
            id: settingID
        };
        return this._ibdb.getRow(where, this._tableName);
    }

    getSingle(category, key, value = ""){
        const where = {
            category, key
        };

        if(value){
            where['value'] = value;
        }

        return this._ibdb.getRow(where, this._tableName);
    }

    getSingleByCatAndVal(category, value){
        const where = {
            category, value
        };
        return this._ibdb.getRow(where, this._tableName);
    }

    addSetting(category, key, value){
        const data = {
            category, key, value
        };

        return this._ibdb.insert(data, this._tableName)
            .then(()=>{
                return this.getSingle(category, key, value);
            });
    }

    updateSetting(id, category, key, value){
        const where = {
            id,
            category
        };

        const data = {
            key, 
            value
        };

        return this._ibdb.update(data, where, this._tableName)
            .then(() => {
                return this.getSingle(category, key, data.value);
            });
    }

    deleteSetting(id){
        const where = {
            id
        };

        return this._ibdb.delete(where, this._tableName);
    }
}