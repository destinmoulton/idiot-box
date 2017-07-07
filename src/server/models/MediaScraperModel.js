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
            type: 'show'
        });
    }

    getShowSeasonsList(id){
        return this._trakt.seasons.summary({
            id
        });
    }

    getEpisodesForSeason(showID, seasonNumber){
        return this._trakt.seasons.season({
            id: showID,
            season: seasonNumber
        });
    }
}