import moment from "moment";
import { IBDB } from "../../db/IBDB";

export default class ShowSeasonsModel {
    _ibdb: IBDB;
    _tableName: string;
    constructor(ibdb) {
        this._ibdb = ibdb;

        this._tableName = "show_seasons";
    }

    _prepareData(showID, apiData) {
        return {
            show_id: showID,
            season_number: apiData.number,
            rating: apiData.rating,
            episode_count: apiData.episode_count,
            aired_episodes: apiData.aired_episodes,
            title: apiData.title,
            overview: apiData.overview,
            first_aired: moment(apiData.first_aired).format("X"),
            trakt_id: apiData.ids.trakt,
            tvdb_id: apiData.ids.tvdb,
            tmdb_id: apiData.ids.tmdb,
            tvrage_id: apiData.ids.tvrage,
            locked: 0,
        };
    }

    async addArrayOfSeasons(arrSeasons, showID) {
        const res = [];
        for (const season of arrSeasons) {
            res.push(await this.addShowSeason(showID, season));
        }
        return res;
    }

    async addShowSeason(showID, apiData) {
        const data = this._prepareData(showID, apiData);
        const season = await this.getSingleByShowSeasonTrakt(
            showID,
            apiData.number,
            apiData.ids.trakt
        );
        if ("id" in season) {
            return season;
        }

        await this._ibdb.insert(data, this._tableName);
        return await this.getSingleByShowSeasonTrakt(
            showID,
            data.season_number,
            data.trakt_id
        );
    }

    async getSingle(seasonID) {
        const where = {
            id: seasonID,
        };

        return await this._ibdb.getRow(where, this._tableName);
    }

    async getSingleByShowSeasonTrakt(showID, seasonNumber, traktID) {
        const where = {
            show_id: showID,
            season_number: seasonNumber,
            trakt_id: traktID,
        };

        return await this._ibdb.getRow(where, this._tableName);
    }

    async getSingleByTraktID(traktID) {
        const where = {
            trakt_id: traktID,
        };

        return await this._ibdb.getRow(where, this._tableName);
    }

    async getSeasonsForShow(showID) {
        const where = {
            show_id: showID,
        };
        return await this._ibdb.getAll(
            where,
            this._tableName,
            "season_number ASC"
        );
    }

    async getSeasonsByTraktID(traktID) {
        const where = {
            trakt_id: traktID,
        };
        return await this._ibdb.getAll(
            where,
            this._tableName,
            "season_number ASC"
        );
    }

    async deleteAllForShow(showID) {
        const where = {
            show_id: showID,
        };
        return await this._ibdb.delete(where, this._tableName);
    }

    async updateLock(seasonID, lockStatus) {
        const data = {
            locked: lockStatus,
        };

        const where = {
            id: seasonID,
        };

        return await this._ibdb.update(data, where, this._tableName);
    }

    async updateLockAllSeasons(showID, lockStatus) {
        const seasons = await this.getSeasonsForShow(showID);
        for (const season of seasons) {
            await this.updateLock(season.id, lockStatus);
        }
    }
}
