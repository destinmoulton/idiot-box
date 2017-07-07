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

    searchTV(tvQuery){
        return this._trakt.search.text({

        });
    }
}