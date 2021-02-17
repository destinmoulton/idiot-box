export default class MovieToGenreModel {
    constructor(ibdb, genresModel){
        this._ibdb = ibdb;
        this._genresModel = genresModel;
        this._tableName = "movie_to_genre";
    }

    addMovieToArrayGenres(movieID, genreArray){

        let toProcess = [];
        genreArray.forEach((genreSlug)=>{
            toProcess.push(
                this._genresModel.addGenre(genreSlug)
                    .then((genreInfo)=>{
                        return this.addMovieToGenre(movieID, genreInfo.id);
                    })
            );
        });

        return Promise.all(toProcess);
        
    }

    addMovieToGenre(movieID, genreID){
        const data = {
            movie_id: movieID,
            genre_id: genreID
        }

        return this._ibdb.insert(data, this._tableName)
            .then(()=>{
                return this.getSingleByMovieAndGenre(movieID, genreID);
            });
    }

    getAllGenresForMovie(movieID){
        const where = {
            movie_id: movieID
        };

        return this._ibdb.getAll(where, this._tableName)
                    .then((movieToGenres)=>{
                        let toProcess = [];
                        movieToGenres.forEach((link)=>{
                            toProcess.push(this._genresModel.getSingle(link.genre_id));
                        });

                        return Promise.all(toProcess);
                    })
                    .then((genres)=>{
                        return genres.sort(this._sortGenresByName);
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

    deleteForMovie(movieID){
        const where = {
            movie_id: movieID
        };
        return this._ibdb.delete(where, this._tableName);
    }

    // Sort the array of genres by the 'name' property
    _sortGenresByName(a, b){
        if(a.slug < b.slug){
            return -1;
        }
        if(a.slug > b.slug){
            return 1;
        }
        return 0;
    }
}