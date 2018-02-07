import fs from "fs";
import path from "path";

import thumbConfig from "../config/thumbnails.config";

class MovieAPI {
    constructor(models) {
        this._filesModel = models.filesModel;
        this._fileToMovieModel = models.fileToMovieModel;
        this._moviesModel = models.moviesModel;
        this._movieToGenreModel = models.movieToGenreModel;
    }

    getAllMoviesWithFileInfo() {
        return this._moviesModel.getAll().then(movies => {
            let promisesToRun = [];

            movies.forEach(movie => {
                let data = Object.assign({}, movie);
                data["file_info"] = {};

                const cmd = this._fileToMovieModel
                    .getSingleForMovie(movie.id)
                    .then(fileMovie => {
                        if (!fileMovie.hasOwnProperty("file_id")) {
                            return Promise.resolve(data);
                        }
                        return this._filesModel
                            .getSingle(fileMovie.file_id)
                            .then(file => {
                                if (!file.hasOwnProperty("id")) {
                                    return Promise.resolve(data);
                                }
                                data.file_info = file;
                                return Promise.resolve(data);
                            });
                    });
                promisesToRun.push(cmd);
            });

            return Promise.all(promisesToRun);
        });
    }

    deleteSingle(movieID) {
        return this._moviesModel
            .getSingle(movieID)
            .then(movie => {
                if (!movie.hasOwnProperty("id")) {
                    return Promise.reject(
                        "MovieAPI :: deleteSingle() :: Unable to find movie ${movieID}"
                    );
                }
                return this._removeMovieThumbnail(movie);
            })
            .then(() => {
                return this._movieToGenreModel.deleteForMovie(movieID);
            })
            .then(() => {
                return this._removeFileAssociationForMovie(movieID);
            })
            .then(() => {
                return this._moviesModel.deleteSingle(movieID);
            });
    }

    _removeShowThumbnail(showID) {
        return this._showsModel.getSingle(showID).then(show => {
            const fullPath = path.join(thumbConfig.shows, show.image_filename);
            if (!fs.existsSync(fullPath)) {
                return Promise.resolve(true);
            }
            return Promise.resolve(fs.unlinkSync(fullPath));
        });
    }

    _removeFileAssociationForMovie(movieID) {
        return this._fileToMovieModel
            .getSingleForMovie(movieID)
            .then(fileToMovie => {
                if (!fileToMovie.hasOwnProperty("file_id")) {
                    // No file to remove
                    return Promise.resolve();
                }

                return this._filesModel
                    .deleteSingle(fileToMovie.file_id)
                    .then(() => {
                        return this._fileToMovieModel.deleteSingle(
                            fileToMovie.file_id,
                            movieID
                        );
                    });
            });
    }

    _removeMovieThumbnail(movie) {
        const fullPath = path.join(thumbConfig.movies, movie.image_filename);
        if (!fs.existsSync(fullPath)) {
            return Promise.resolve(true);
        }
        return Promise.resolve(fs.unlinkSync(fullPath));
    }
}

export default MovieAPI;
