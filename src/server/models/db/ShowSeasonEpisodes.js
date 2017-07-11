import moment from 'moment';

export class ShowSeasonEpisodesModel {
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
            tvrage_id: apiData.ids.tvrage
        };
    }

    addEpisode(showID, seasonID, apiData){
        const data = this._prepareData(showID, seasonID, apiData);

        return this._ibdb.insert(data, this._tableName)
            .then(()=>{
                return this.getSingleByShowSeasonTrakt(showID, seasonID, data.episode_number, data.trakt_id);
            });
    }

    toggleHasWatched(episodeID){
        return this.getSingle(episodeID)
            .then((episode) => {
                const where = {
                    id: episodeID
                };
                let data = {
                    has_watched: 1
                };
                if (episode.has_watched === 1) {
                    data.has_watched = 0;
                }

                return this._ibdb.update(data, where, this._tableName)

            })
            .then(() => {
                return this.getSingle(episodeID);
            });
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

    getEpisodesForSeason(showID, seasonID){
        const where = {
            show_id: showID,
            season_id: seasonID
        };
        return this._ibdb.getAll(where, this._tableName, "episode_number ASC");
    }
}