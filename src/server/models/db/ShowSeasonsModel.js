import moment from 'moment';

export default class ShowSeasonsModel {
    constructor(ibdb){
        this._ibdb = ibdb;

        this._tableName = "show_seasons";
    }

    _prepareData(showID, apiData){
        return {
            show_id: showID,
            season_number: apiData.number,
            rating: apiData.rating,
            episode_count: apiData.episode_count,
            aired_episodes: apiData.aired_episodes,
            title: apiData.title,
            overview: apiData.overview,
            first_aired: moment(apiData.first_aired).format('X'),
            trakt_id: apiData.ids.trakt,
            tvdb_id: apiData.ids.tvdb,
            tmdb_id: apiData.ids.tmdb,
            tvrage_id: apiData.ids.tvrage,
            locked: 0
        };
    }

    addArrayOfSeasons(arrSeasons, showID){
        let promisesToRun = [];
        arrSeasons.forEach((season)=>{
            promisesToRun.push(this.addShowSeason(showID, season))
        })
        return Promise.all(promisesToRun);
    }

    addShowSeason(showID, apiData){
        const data = this._prepareData(showID, apiData);
        return this.getSingleByShowSeasonTrakt(showID, apiData.number, apiData.ids.trakt)
            .then((season)=>{
                if('id' in season){
                    return season;
                }
                
                return this._ibdb.insert(data, this._tableName);
            })        
            .then(()=>{
                return this.getSingleByShowSeasonTrakt(showID, data.season_number, data.trakt_id);
            });
    }

    getSingle(seasonID){
        const where = {
            id: seasonID
        };

        return this._ibdb.getRow(where, this._tableName);
    }

    getSingleByShowSeasonTrakt(showID, seasonNumber, traktID){
        const where = {
            show_id: showID,
            season_number: seasonNumber,
            trakt_id: traktID
        };

        return this._ibdb.getRow(where, this._tableName);
    }

    getSeasonsForShow(showID){
        const where = {
            show_id: showID
        };
        return this._ibdb.getAll(where, this._tableName, "season_number ASC");
    }

    deleteAllForShow(showID){
        const where = {
            show_id: showID
        };
        return this._ibdb.delete(where, this._tableName);
    }

    updateLock(seasonID, lockStatus){
        const data = {
            locked: lockStatus
        };

        const where = {
            id: seasonID            
        };

        return this._ibdb.update(data, where, this._tableName);
    }
}