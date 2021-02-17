import { IBDB } from "../../db/IBDB";
export default class GenresModel {
    _ibdb: IBDB;
    _tableName: string;
    constructor(ibdb) {
        this._ibdb = ibdb;

        this._tableName = "genres";
    }

    async addGenre(slug) {
        const name = slug[0].toUpperCase() + slug.slice(1);
        const data = {
            slug,
            name,
        };

        const row = await this.getSingleBySlug(slug);
        if ("slug" in row) {
            // genre already exists
            return row;
        }
        await this._ibdb.insert(data, this._tableName);
        return await this.getSingleBySlug(slug);
    }

    async getAll() {
        return await this._ibdb.getAll({}, this._tableName, "slug ASC");
    }

    async getSingleBySlug(slug) {
        const where = {
            slug,
        };
        return await this._ibdb.getRow(where, this._tableName);
    }

    async getSingle(genreID) {
        const where = {
            id: genreID,
        };
        return await this._ibdb.getRow(where, this._tableName);
    }
}
