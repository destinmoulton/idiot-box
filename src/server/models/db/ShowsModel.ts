import moment from "moment";

import { IBDB } from "../../db/IBDB";
export default class ShowsModel {
    _ibdb: IBDB;
    _tableName: string;
    constructor(ibdb) {
        this._ibdb = ibdb;

        this._tableName = "shows";
    }

    _prepareData(apiData, imageFilename) {
        return {
            title: apiData.title,
            year: apiData.year,
            overview: apiData.overview,
            first_aired: moment(apiData.first_aired).format("X"),
            runtime: apiData.runtime,
            network: apiData.network,
            status: apiData.status,
            rating: apiData.rating,
            updated_at: moment(apiData.updated_at).format("X"),
            slug: apiData.ids.slug,
            trakt_id: apiData.ids.trakt,
            tvdb_id: apiData.ids.tvdb,
            imdb_id: apiData.ids.imdb,
            tmdb_id: apiData.ids.tmdb,
            tvrage_id: apiData.ids.tvrage,
            image_filename: imageFilename,
        };
    }

    async addShow(apiData, imageFilename) {
        const data = this._prepareData(apiData, imageFilename);

        const show = await this.getSingleByTraktID(data.trakt_id);
        if ("id" in show) {
            return show;
        }
        await this._ibdb.insert(data, this._tableName);
        return await this.getSingleByTraktID(data.trakt_id);
    }

    async getSingle(showID) {
        const where = {
            id: showID,
        };

        return await this._ibdb.getRow(where, this._tableName);
    }

    async getSingleBySlug(slug) {
        const where = {
            slug,
        };

        return await this._ibdb.getRow(where, this._tableName);
    }

    async getSingleByTraktID(traktID) {
        const where = {
            trakt_id: traktID,
        };

        return await this._ibdb.getRow(where, this._tableName);
    }

    async getAll() {
        return await this._ibdb.getAll({}, this._tableName, "title ASC");
    }

    async deleteSingle(showID) {
        const where = {
            id: showID,
        };
        return await this._ibdb.delete(where, this._tableName);
    }
}
