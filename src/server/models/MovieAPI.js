class MovieAPI {
    constructor(models){
        this._filesModel = models.filesModel;
        this._fileToMovieModel = models.fileToMovieModel;
        this._moviesModel = models.moviesModel;
        this._movieToGenreModel = models.movieToGenreModel;
    }

    deleteSingle(movieID){
        return this._moviesModel.getSingle(movieID)
                .then((movie)=>{
                    if(!movie.hasOwnProperty('id')){
                        return Promise.reject("MovieAPI :: deleteSingle() :: Unable to find movie ${movieID}");
                    }

                    return this._removeGenresForMovie(movieID);
                })
                .then(()=>{
                    return this._removeFileAssociationForMovie(movieID);
                })
                .then(()=>{
                    return this._moviesModel.deleteSingle(movieID);
                })
                
    }

    _removeFileAssociationForMovie(movieID){
        return this._fileToMovieModel.getSingleForMovie(movieID)
                .then((fileToMovie)=>{
                    if(!fileToMovie.hasOwnProperty('file_id')){
                        return Promise.reject("MovieAPI :: _removeFileAssociationForMovie :: Unable to find file to movie association");
                    }

                    return this._filesModel.deleteSingle(fileToMovie.file_id)
                            .then(()=>{
                                return this._fileToMovieModel.deleteSingle(fileToMovie.file_id, movieID);
                            });
                });
                
    }

    _removeGenresForMovie(movieID){
        return this._movieToGenreModel.deleteForMovie(movieID);
    }
}

export default MovieAPI;