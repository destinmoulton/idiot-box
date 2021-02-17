import moment from 'moment';

import logger from '../../logger';

export default class ShowSeasonEpisodesModel {
    constructor(ibdb){
        this._ibdb = ibdb;

        this._tableName = "show_season_episodes";
    }

    _prepareData(showID, seasonID, apiData){
        return {
            show_id: showID,
            season_id: seasonID,
            season_number: apiData.season,
            episode_number: apiData.number,
            title: apiData.title,
            overview: apiData.overview,
            rating: apiData.rating,
            first_aired: moment(apiData.first_aired).format('X'),
            updated_at: moment(apiData.updated_at).format('X'),
            runtime: apiData.runtime,
            trakt_id: apiData.ids.trakt,
            tvdb_id: apiData.ids.tvdb,
            imdb_id: apiData.ids.imdb,
            tmdb_id: apiData.ids.tmdb,
            tvrage_id: apiData.ids.tvrage,
            watched: 0
        };
    }

    addEpisode(showID, seasonID, apiData){
        const data = this._prepareData(showID, seasonID, apiData);

        return this.getSingleByShowSeasonTrakt(showID, seasonID, data.episode_number, data.trakt_id)
            .then((episode)=>{
                if('id' in episode){
                    return episode;
                }
                return this._ibdb.insert(data, this._tableName);
            })
            .then(()=>{
                return this.getSingleByShowSeasonTrakt(showID, seasonID, data.episode_number, data.trakt_id);
            });
    }

    addArrEpisodes(showID, seasonID, episodes){
        const promisesToRun = [];

        episodes.forEach((episode)=>{
            promisesToRun.push(this.addEpisode(showID, seasonID, episode));
        });

        return Promise.all(promisesToRun);
    }

    updateEpisode(showID, seasonID, episodeID, apiData){
        const data = this._prepareData(showID, seasonID, apiData);

        const where = {
            id: episodeID,
            show_id: showID,
            season_id: seasonID
        };
        return this._ibdb.update(data, where, this._tableName)
    }

    updateMultipleEpisodesWatchedStatus(episodeIDs, watchedStatus){
        let promisesToRun = [];
        episodeIDs.forEach((episodeID)=>{
            promisesToRun.push(this.updateEpisodeWatchedStatus(episodeID, watchedStatus));
        })

        return Promise.all(promisesToRun);
    }

    updateEpisodeWatchedStatus(episodeID, newWatchedStatus){
        const data = {
            watched: newWatchedStatus
        };

        const where = {
            id: episodeID
        };
        return this._ibdb.update(data, where, this._tableName)
    }

    getSingle(episodeID){
        const where = {
            id: episodeID
        };

        return this._ibdb.getRow(where, this._tableName);
    }

    getSingleByShowSeasonTrakt(showID, seasonID, episodeNumber, traktID){
        const where = {
            show_id: showID,
            season_id: seasonID,
            episode_number: episodeNumber,
            trakt_id: traktID
        };

        return this._ibdb.getRow(where, this._tableName);
    }

    getSingleByTraktID(traktID){
        const where = {
            trakt_id: traktID
        };

        return this._ibdb.getRow(where, this._tableName);
    }

    getEpisodesForSeason(showID, seasonID){
        const where = {
            show_id: showID,
            season_id: seasonID
        };
        return this._ibdb.getAll(where, this._tableName, "episode_number ASC");
    }

    getEpisodesForSeasonNum(showID, seasonNum){
        const where = {
            show_id: showID,
            season_number: seasonNum
        };
        return this._ibdb.getAll(where, this._tableName, "episode_number ASC");
    }

    getEpisodesForShow(showID){
        const where = {
            show_id: showID
        };
        return this._ibdb.getAll(where, this._tableName, "episode_number ASC");
    }

    getBetweenUnixTimestamps(startUnixTimestamp, endUnixTimestamp){
        const query = "SELECT * FROM " + this._tableName + " WHERE first_aired > ? AND first_aired < ? ORDER BY first_aired";

        const params = [
            startUnixTimestamp,
            endUnixTimestamp
        ];
        return this._ibdb.queryAll(query, params);
    }

    deleteSingle(episodeID){
        const where = {
            id: episodeID
        };

        return this._ibdb.delete(where, this._tableName);
    }

    deleteAllForShow(showID){
        const where = {
            show_id: showID
        };
        return this._ibdb.delete(where, this._tableName);
    }

    collateEpisodeInfo(episodeInfo, showsModel, showSeasonsModel){
        let show = {};
        let season = {};

        return showsModel.getSingle(episodeInfo.show_id)
                .then((showInfo)=>{
                    show = showInfo;
                    return showSeasonsModel.getSingle(episodeInfo.season_id);
                })
                .then((seasonInfo)=>{
                    season = seasonInfo;
                    return this.getSingle(episodeInfo.episode_id);
                })
                .then((episode)=>{
                    return {
                        show,
                        season,
                        episode
                    };
                });
    }

    
}