"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../config"));
class MovieAPI {
    _filesModel;
    _fileToMovieModel;
    _moviesModel;
    _movieToGenreModel;
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
            const fileToMovie = await this._fileToMovieModel.getSingleForMovie(movie.id);
            res.push(await this._collateMovieFileInfo(fileToMovie, data));
        }
        return res;
    }
    async getMoviesStartingWith(startingLetter) {
        const movies = await this._moviesModel.getAllStartingWith(startingLetter);
        let res = [];
        for (const movie of movies) {
            let data = Object.assign({}, movie);
            data["file_info"] = {};
            const fileToMovie = await this._fileToMovieModel.getSingleForMovie(movie.id);
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
            return Promise.reject("MovieAPI :: deleteSingle() :: Unable to find movie ${movieID}");
        }
        await this._removeMovieThumbnail(movie);
        await this._movieToGenreModel.deleteForMovie(movieID);
        await this._removeFileAssociationForMovie(movieID);
        return await this._moviesModel.deleteSingle(movieID);
    }
    async _removeFileAssociationForMovie(movieID) {
        const fileToMovie = await this._fileToMovieModel.getSingleForMovie(movieID);
        if (!fileToMovie.hasOwnProperty("file_id")) {
            // No file to remove
            return true;
        }
        await this._filesModel.deleteSingle(fileToMovie.file_id);
        return await this._fileToMovieModel.deleteSingle(fileToMovie.file_id, movieID);
    }
    _removeMovieThumbnail(movie) {
        if (movie.image_filename === "") {
            return true;
        }
        const imagepaths = config_1.default.paths.images;
        const fullPath = path_1.default.join(imagepaths.base, imagepaths.movies, movie.image_filename);
        if (!fs_1.default.existsSync(fullPath)) {
            return true;
        }
        const info = fs_1.default.statSync(fullPath);
        if (info.isDirectory) {
            return true;
        }
        return fs_1.default.unlinkSync(fullPath);
    }
    async updateStatusTags(movieID, statusTags) {
        return await this._moviesModel.updateStatusTags(movieID, statusTags);
    }
}
exports.default = MovieAPI;
//# sourceMappingURL=MovieAPI.js.map