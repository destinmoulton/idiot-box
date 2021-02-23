import fs from "fs";
import path from "path";

import FilesModel from "./db/FilesModel";
import FileToMovieModel from "./db/FileToMovieModel";
import MoviesModel from "./db/MoviesModel";
import MovieToGenreModel from "./db/MovieToGenreModel";
import config from "../config";

class MovieAPI {
    _filesModel: FilesModel;
    _fileToMovieModel: FileToMovieModel;
    _moviesModel: MoviesModel;
    _movieToGenreModel: MovieToGenreModel;
    constructor(models) {
        this._filesModel = models.filesModel;
        this._fileToMovieModel = models.fileToMovieModel;
        this._moviesModel = models.moviesModel;
        this._movieToGenreModel = models.movieToGenreModel;
    }

    async getAllMoviesWithFileInfo() {
        const movies = await this._moviesModel.getAll();

        let res = [];
        for (const movie of movies) {
            let data = Object.assign({}, movie);
            data["file_info"] = {};

            const fileToMovie = await this._fileToMovieModel.getSingleForMovie(
                movie.id
            );
            res.push(await this._collateMovieFileInfo(fileToMovie, data));
        }
        return res;
    }

    async getMoviesStartingWith(startingLetter) {
        const movies = await this._moviesModel.getAllStartingWith(
            startingLetter
        );

        let res = [];
        for (const movie of movies) {
            let data = Object.assign({}, movie);
            data["file_info"] = {};

            const fileToMovie = await this._fileToMovieModel.getSingleForMovie(
                movie.id
            );
            res.push(await this._collateMovieFileInfo(fileToMovie, data));
        }
        return res;
    }

    /**
     * Add file-to-movie information to the info object.
     *
     * @param FileToMovie fileToMovie
     * @param object infoObj for collation
     */
    async _collateMovieFileInfo(fileToMovie, infoObj) {
        if (!fileToMovie.hasOwnProperty("file_id")) {
            return infoObj;
        }
        const file = await this._filesModel.getSingle(fileToMovie.file_id);
        if (!file.hasOwnProperty("id")) {
            return infoObj;
        }
        infoObj.file_info = file;
        return infoObj;
    }

    async deleteSingle(movieID) {
        const movie = await this._moviesModel.getSingle(movieID);
        if (!movie.hasOwnProperty("id")) {
            return Promise.reject(
                "MovieAPI :: deleteSingle() :: Unable to find movie ${movieID}"
            );
        }
        await this._removeMovieThumbnail(movie);
        await this._movieToGenreModel.deleteForMovie(movieID);
        await this._removeFileAssociationForMovie(movieID);
        return await this._moviesModel.deleteSingle(movieID);
    }

    async _removeFileAssociationForMovie(movieID) {
        const fileToMovie = await this._fileToMovieModel.getSingleForMovie(
            movieID
        );
        if (!fileToMovie.hasOwnProperty("file_id")) {
            // No file to remove

            return true;
        }

        await this._filesModel.deleteSingle(fileToMovie.file_id);
        return await this._fileToMovieModel.deleteSingle(
            fileToMovie.file_id,
            movieID
        );
    }

    _removeMovieThumbnail(movie) {
        if (movie.image_filename === "") {
            return true;
        }
        const imagepaths = config.paths.images;
        const fullPath = path.join(
            imagepaths.base,
            imagepaths.movies,
            movie.image_filename
        );

        const info = fs.statSync(fullPath);
        if (!fs.existsSync(fullPath) || info.isDirectory) {
            return true;
        }
        return fs.unlinkSync(fullPath);
    }

    async updateStatusTags(movieID, statusTags) {
        return await this._moviesModel.updateStatusTags(movieID, statusTags);
    }
}

export default MovieAPI;
