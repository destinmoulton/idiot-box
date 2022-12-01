"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IBDB = void 0;
const fs_1 = __importDefault(require("fs"));
const lodash_1 = __importDefault(require("lodash"));
const sqlite_1 = require("sqlite");
const sqlite3_1 = __importDefault(require("sqlite3"));
const error_1 = __importDefault(require("../error"));
class IBDB {
    _db;
    _isConnected;
    _paramCount;
    constructor() {
        this._db = null;
        this._isConnected = false;
        this._paramCount = 0;
    }
    async connect(config) {
        let filename = "";
        if (lodash_1.default.has(config, "paths.db.sqlite")) {
            if (!fs_1.default.existsSync(config.paths.db.sqlite)) {
                (0, error_1.default)("IBDB :: connect :: File does not exist.");
                throw new Error(`IBDB :: connect :: File does not exist. ${config.paths.db.sqlite}`);
            }
            filename = config.paths.db.sqlite;
        }
        else {
            throw new Error("IBDB :: connect :: No filename config is set.");
        }
        try {
            this._db = await (0, sqlite_1.open)({
                filename: filename,
                driver: sqlite3_1.default.Database,
            });
            this._isConnected = true;
        }
        catch (err) {
            throw new Error(`IBDB :: connect :: sqlite error ${err}`);
        }
    }
    isConnected() {
        return this._isConnected;
    }
    async close() {
        if (this._isConnected) {
            this._isConnected = false;
            return await this._db.close();
        }
    }
    async insert(columnsAndValues, tablename) {
        this._resetParamCount();
        const [columns, params] = this._getColumnsAndParams(columnsAndValues);
        const insertColumns = columns.join(", ");
        const insertValueVariables = Object.keys(params).join(",");
        const query = "INSERT INTO " +
            tablename +
            " (" +
            insertColumns +
            ") VALUES (" +
            insertValueVariables +
            ")";
        const res = await this._db.run(query, params);
        return res.lastID;
    }
    async update(dataColumnsAndValues, whereColumnsAndValues, tablename) {
        this._resetParamCount();
        const [dataDelim, dataParams] = this._buildCommaDelimetedStatement(dataColumnsAndValues);
        const [whereDelim, whereParams] = this._buildCommaDelimetedStatement(whereColumnsAndValues, " AND ");
        const update = "UPDATE " +
            tablename +
            " SET " +
            dataDelim +
            " WHERE " +
            whereDelim;
        const params = Object.assign({}, dataParams, whereParams);
        const res = await this._db.run(update, params);
        return res.changes;
    }
    async delete(whereColumnsAndValues, tablename) {
        this._resetParamCount();
        const [whereDelim, whereParams] = this._buildCommaDelimetedStatement(whereColumnsAndValues, " AND ");
        const update = "DELETE FROM " + tablename + " WHERE " + whereDelim;
        return await this._db.run(update, whereParams);
    }
    async getRow(whereColumnsAndValues, tablename) {
        this._resetParamCount();
        const [query, params] = this._buildSelectQuery(whereColumnsAndValues, tablename);
        const row = await this._db.get(query, params);
        return row === undefined ? {} : row;
    }
    async getAll(whereColumnsAndValues, tablename, orderBy = "") {
        this._resetParamCount();
        let [query, params] = this._buildSelectQuery(whereColumnsAndValues, tablename);
        if (orderBy !== "") {
            query = query + " ORDER BY " + orderBy;
        }
        const rows = await this._db.all(query, params);
        return rows === undefined ? [] : rows;
    }
    async queryAll(sql, params) {
        const rows = await this._db.all(sql, params);
        return rows === undefined ? [] : rows;
    }
    _buildSelectQuery(whereColumnsAndValues, tablename) {
        const [where, params] = this._buildCommaDelimetedStatement(whereColumnsAndValues, " AND ");
        let query = "SELECT * FROM " + tablename;
        if (where !== "") {
            query = query + " WHERE " + where;
        }
        return [query, params];
    }
    // Build a comma delimited equals string (ie for where: "key = $var AND key1 = $var")
    _buildCommaDelimetedStatement(whereColumnsAndValues, separator = ", ") {
        const [columns, params, paramKeys] = this._getColumnsAndParams(whereColumnsAndValues);
        let whereParts = [];
        columns.forEach((columnName, index) => {
            whereParts.push(columnName + " = " + paramKeys[index]);
        });
        const where = whereParts.join(separator);
        return [where, params];
    }
    _getColumnsAndParams(columnsAndValues) {
        const columns = Object.keys(columnsAndValues);
        let params = {};
        let paramKeys = [];
        columns.forEach((columnName) => {
            this._paramCount++;
            const key = "$" + columnName + this._paramCount;
            paramKeys.push(key);
            params[key] = columnsAndValues[columnName];
        });
        return [columns, params, paramKeys];
    }
    _resetParamCount() {
        this._paramCount = 0;
    }
}
exports.IBDB = IBDB;
let ibdb = new IBDB();
exports.default = ibdb;
//# sourceMappingURL=IBDB.js.map