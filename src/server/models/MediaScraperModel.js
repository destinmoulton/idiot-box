export default class MediaScrapeModel {
    
    constructor(traktInstance){
        this._trakt = traktInstance;
        
    }

    searchMovies(movieQuery){
        return this._trakt.search.text({
            query: movieQuery,
            type: 'movie'
        });
    }

    searchShows(tvQuery){
        return this._trakt.search.text({
            query: tvQuery,
            type: 'show',
            extended: 'full'
        });
    }

    getShowSeasonsList(id){
        return this._trakt.seasons.summary({
            id,
            extended: 'full'
        });
    }

    getEpisodesForSeason(showID, seasonNumber){
        return this._trakt.seasons.season({
            id: showID,
            season: seasonNumber,
            extended: 'full'
        });
    }
}