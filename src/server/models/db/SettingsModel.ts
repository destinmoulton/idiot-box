import { IBDB } from "../../db/IBDB";
import logger from "../../logger";
export default class SettingsModel {
    _ibdb: IBDB;
    _tableName: string;
    constructor(db) {
        this._ibdb = db;
        this._tableName = "settings";
    }

    async getAll() {
        return await this._ibdb.getAll({}, this._tableName);
    }

    async getAllForCategory(category) {
        const where = {
            category,
        };
        return await this._ibdb.getAll(where, this._tableName);
    }

    async getSingleByID(settingID) {
        const where = {
            id: settingID,
        };
        return await this._ibdb.getRow(where, this._tableName);
    }

    async getSingle(category, key, value = "") {
        const where = {
            category,
            key,
        };

        if (value) {
            where["value"] = value;
        }

        return await this._ibdb.getRow(where, this._tableName);
    }

    async getSingleByCatAndVal(category, value) {
        const where = {
            category,
            value,
        };
        return await this._ibdb.getRow(where, this._tableName);
    }

    async addSetting(category, key, value) {
        const data = {
            category,
            key,
            value,
        };

        await this._ibdb.insert(data, this._tableName);
        return await this.getSingle(category, key, value);
    }

    async updateSetting(id, category, key, value) {
        const where = {
            id,
            category,
        };

        const data = {
            key,
            value,
        };

        await this._ibdb.update(data, where, this._tableName);
        return await this.getSingle(category, key, data.value);
    }

    async deleteSetting(id) {
        const where = {
            id,
        };

        return await this._ibdb.delete(where, this._tableName);
    }
}
