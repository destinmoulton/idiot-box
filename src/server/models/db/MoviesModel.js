export class MoviesModel {
    constructor(ibdb){
        this._ibdb = ibdb;

        this._tableName = "movies";
    }

    addMovie(apiData, imageFilename){
        const data = {
            title: apiData.title,
            year: apiData.year,
            tagline: apiData.tagline,
            overview: apiData.overview, 
            released: apiData.released,
            runtime: apiData.runtime,
            rating: apiData.rating,
            slug: apiData.slug,
            trakt_id: apiData.ids.trakt,
            imdb_id: apiData.ids.imdb,
            tmdb_id: apiData.ids.tmdb,
            image_filename: imageFilename
        };

        return this._ibdb.insert(data, this._tableName)
            .then(()=>{
                return this.getSingle(category, key, value);
            });
    }
}