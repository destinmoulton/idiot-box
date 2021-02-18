import moment from "moment";

import { IBDB } from "../../db/IBDB";
import logger from "../../logger";

export default class ShowSeasonEpisodesModel {
    _ibdb: IBDB;
    _tableName: string;
    constructor(ibdb) {
        this._ibdb = ibdb;

        this._tableName = "show_season_episodes";
    }

    _prepareData(showID, seasonID, apiData) {
        return {
            show_id: showID,
            season_id: seasonID,
            season_number: apiData.season,
            episode_number: apiData.number,
            title: apiData.title,
            overview: apiData.overview,
            rating: apiData.rating,
            first_aired: moment(apiData.first_aired).format("X"),
            updated_at: moment(apiData.updated_at).format("X"),
            runtime: apiData.runtime,
            trakt_id: apiData.ids.trakt,
            tvdb_id: apiData.ids.tvdb,
            imdb_id: apiData.ids.imdb,
            tmdb_id: apiData.ids.tmdb,
            tvrage_id: apiData.ids.tvrage,
            watched: 0,
        };
    }

    async addEpisode(showID, seasonID, apiData) {
        const data = this._prepareData(showID, seasonID, apiData);

        const episode = await this.getSingleByShowSeasonTrakt(
            showID,
            seasonID,
            data.episode_number,
            data.trakt_id
        );
        if ("id" in episode) {
            return episode;
        }
        await this._ibdb.insert(data, this._tableName);
        return await this.getSingleByShowSeasonTrakt(
            showID,
            seasonID,
            data.episode_number,
            data.trakt_id
        );
    }

    async addArrEpisodes(showID, seasonID, episodes) {
        episodes.forEach(async (episode) => {
            await this.addEpisode(showID, seasonID, episode);
        });
    }

    async updateEpisode(showID, seasonID, episodeID, apiData) {
        const data = this._prepareData(showID, seasonID, apiData);

        const where = {
            id: episodeID,
            show_id: showID,
            season_id: seasonID,
        };
        return await this._ibdb.update(data, where, this._tableName);
    }

    async updateMultipleEpisodesWatchedStatus(episodeIDs, watchedStatus) {
        episodeIDs.forEach(async (episodeID) => {
            await this.updateEpisodeWatchedStatus(episodeID, watchedStatus);
        });
    }

    async updateEpisodeWatchedStatus(episodeID, newWatchedStatus) {
        const data = {
            watched: newWatchedStatus,
        };

        const where = {
            id: episodeID,
        };
        return await this._ibdb.update(data, where, this._tableName);
    }

    async getSingle(episodeID) {
        const where = {
            id: episodeID,
        };

        return await this._ibdb.getRow(where, this._tableName);
    }

    async getSingleByShowSeasonTrakt(showID, seasonID, episodeNumber, traktID) {
        const where = {
            show_id: showID,
            season_id: seasonID,
            episode_number: episodeNumber,
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

    async getEpisodesForSeason(showID, seasonID) {
        const where = {
            show_id: showID,
            season_id: seasonID,
        };
        return await this._ibdb.getAll(
            where,
            this._tableName,
            "episode_number ASC"
        );
    }

    async getEpisodesForSeasonNum(showID, seasonNum) {
        const where = {
            show_id: showID,
            season_number: seasonNum,
        };
        return await this._ibdb.getAll(
            where,
            this._tableName,
            "episode_number ASC"
        );
    }

    async getEpisodesForShow(showID) {
        const where = {
            show_id: showID,
        };
        return await this._ibdb.getAll(
            where,
            this._tableName,
            "episode_number ASC"
        );
    }

    async getBetweenUnixTimestamps(startUnixTimestamp, endUnixTimestamp) {
        const query =
            "SELECT * FROM " +
            this._tableName +
            " WHERE first_aired > ? AND first_aired < ? ORDER BY first_aired";

        const params = [startUnixTimestamp, endUnixTimestamp];
        const data = await this._ibdb.queryAll(query, params);
        return data;
    }

    async deleteSingle(episodeID) {
        const where = {
            id: episodeID,
        };

        return await this._ibdb.delete(where, this._tableName);
    }

    async deleteAllForShow(showID) {
        const where = {
            show_id: showID,
        };
        return await this._ibdb.delete(where, this._tableName);
    }

    async collateEpisodeInfo(episodeInfo, showsModel, showSeasonsModel) {
        const show = await showsModel.getSingle(episodeInfo.show_id);
        const season = await showSeasonsModel.getSingle(episodeInfo.season_id);
        const episode = await this.getSingle(episodeInfo.episode_id);
        return {
            show,
            season,
            episode,
        };
    }
}
