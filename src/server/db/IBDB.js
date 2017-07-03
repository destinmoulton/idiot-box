import fs from 'fs';

import Promise from 'bluebird';

import sqlite  from 'sqlite';

import logger from '../logger';

import error from '../error';

class IBDB {
    constructor(){
        this._db = {};
        this._isConnected = false;
        this._paramCount = 0;
    }

    connect(config){
        
        let filename = "";
        if(config.hasOwnProperty('filename')){
            if(!fs.existsSync(config.filename)){
                error("IBDB :: connect :: File does not exist.");
                return new Promise.reject("IBDB :: connect :: File does not exist.");
            }
            filename = config.filename;
        } else if(config.hasOwnProperty('inMemory')){
            filename = ":memory:";
        } else {
            return new Promise.reject("IBDB :: connect :: No filename config is set.");
        }

        return Promise.resolve()
            .then(() => {
                return sqlite.open(filename, { Promise });
            })
            .then((newDB) => {
                this._isConnected = true;
                this._db = newDB;
                return newDB;
            })
            .catch((err)=>{
                error(`IBDB :: connect :: sqlite error ${err}`);
            });
    }

    isConnected(){
        return this._isConnected;
    }

    close(){
        if(this._isConnected){
            this._isConnected = false;
            return this._db.close();
        }
    }

    insert(columnsAndValues, tablename){
        this._resetParamCount();
        const [columns, params] = this._getColumnsAndParams(columnsAndValues);

        const insertColumns = columns.join(', ');
        const insertValueVariables = Object.keys(params).join(',');

        const query = "INSERT INTO "+tablename+" ("+insertColumns+") VALUES ("+insertValueVariables+")";
        return this._db.run(query, params);
    }

    update(whereColumnsAndValues, dataColumnsAndValues, tablename){
        this._resetParamCount();
        const [dataDelim, dataParams] = this._buildCommaDelimetedStatement(dataColumnsAndValues);
        const [whereDelim, whereParams] = this._buildCommaDelimetedStatement(whereColumnsAndValues, " AND ");

        const update = "UPDATE "+tablename+" SET "+dataDelim+ " WHERE "+whereDelim;
        const params = Object.assign({}, dataParams, whereParams);
        return this._db.run(update, params);
    }

    delete(whereColumnsAndValues, tablename){
        this._resetParamCount();
        const [whereDelim, whereParams] = this._buildCommaDelimetedStatement(whereColumnsAndValues, " AND ");

        const update = "DELETE FROM "+tablename+" WHERE "+whereDelim;
        return this._db.run(update, whereParams);
    }

    getRow(whereColumnsAndValues, tablename){
        this._resetParamCount();
        const [query, params] = this._buildSelectQuery(whereColumnsAndValues, tablename);
        return this._db.get(query, params);
    }

    getAll(whereColumnsAndValues, tablename){
        this._resetParamCount();
        const [query, params] = this._buildSelectQuery(whereColumnsAndValues, tablename);
        return this._db.all(query, params);
    }

    _buildSelectQuery(whereColumnsAndValues, tablename){
        const [where, params] = this._buildCommaDelimetedStatement(whereColumnsAndValues, " AND ");
        const query = "SELECT * FROM "+tablename+" WHERE "+where;

        return [query, params];
    }

    // Build a comma delimited equals string (ie for where: "key = $var AND key1 = $var")
    _buildCommaDelimetedStatement(whereColumnsAndValues, separator = ', '){
        const [columns, params, paramKeys] = this._getColumnsAndParams(whereColumnsAndValues);
        let whereParts = [];
        columns.forEach((columnName, index)=>{
            whereParts.push(columnName+" = "+paramKeys[index]);
        });
        const where = whereParts.join(separator);
        return [where, params];
    }

    _getColumnsAndParams(columnsAndValues){
        const columns = Object.keys(columnsAndValues);
        let params = {};
        let paramKeys = [];
        columns.forEach((columnName)=>{
            this._paramCount++;
            const key = "$" + columnName + this._paramCount;
            paramKeys.push(key);
            params[key] = columnsAndValues[columnName];
        });
        return [columns, params, paramKeys];
    }

    _resetParamCount(){
        this._paramCount = 0;
    }
    
}

let ibdb = new IBDB();
export default ibdb ;