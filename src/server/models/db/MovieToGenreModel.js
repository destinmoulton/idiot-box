export class MovieToGenreModel {
    constructor(ibdb, genresModel){
        this._ibdb = ibdb;
        this._genresModel = genresModel;
        this._tableName = "movie_to_genre";
    }

    addMovieToGenres(movieID, genreArray){

        
        genreArray.forEach((genreSlug)=>{
            
        });
        const data = {

        }

        return this._ibdb.insert(data, this._tableName)
            .then(()=>{
                return this.getSingleByTraktID(data.trakt_id);
            });
    }

    getAllMoviesForGenre(genreID){
        const where = {
            genre_id: genreID
        };

        return this._ibdb.getAll(where, this._tableName);
    }

    getSingleByMovieAndGenre(movieID, genreID){
        const where = {
            movie_id: movieID,
            genre_id: genreID
        };

        return this._ibdb.getRow(where, this._tableName);
    }
}