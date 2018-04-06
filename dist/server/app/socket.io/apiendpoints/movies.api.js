"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _IBDB = require("../../db/IBDB");

var _IBDB2 = _interopRequireDefault(_IBDB);

var _logger = require("../../logger");

var _logger2 = _interopRequireDefault(_logger);

var _FilesModel = require("../../models/db/FilesModel");

var _FilesModel2 = _interopRequireDefault(_FilesModel);

var _FileToMovieModel = require("../../models/db/FileToMovieModel");

var _FileToMovieModel2 = _interopRequireDefault(_FileToMovieModel);

var _GenresModel = require("../../models/db/GenresModel");

var _GenresModel2 = _interopRequireDefault(_GenresModel);

var _MovieAPI = require("../../models/MovieAPI");

var _MovieAPI2 = _interopRequireDefault(_MovieAPI);

var _MovieToGenreModel = require("../../models/db/MovieToGenreModel");

var _MovieToGenreModel2 = _interopRequireDefault(_MovieToGenreModel);

var _MoviesModel = require("../../models/db/MoviesModel");

var _MoviesModel2 = _interopRequireDefault(_MoviesModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var filesModel = new _FilesModel2.default(_IBDB2.default);
var fileToMovieModel = new _FileToMovieModel2.default(_IBDB2.default);
var genresModel = new _GenresModel2.default(_IBDB2.default);
var movieToGenreModel = new _MovieToGenreModel2.default(_IBDB2.default, genresModel);
var moviesModel = new _MoviesModel2.default(_IBDB2.default, movieToGenreModel);

var movieAPIModels = {
    filesModel: filesModel,
    fileToMovieModel: fileToMovieModel,
    movieToGenreModel: movieToGenreModel,
    moviesModel: moviesModel
};

var movieAPI = new _MovieAPI2.default(movieAPIModels);

var movies = {
    movie: {
        delete: {
            params: ["movie_id"],
            func: function func(movieID) {
                return movieAPI.deleteSingle(movieID);
            }
        },
        update_status_tags: {
            params: ["movie_id", "status_tags"],
            func: function func(movieID, statusTags) {
                return movieAPI.updateStatusTags(movieID, statusTags);
            }
        }
    },
    movies: {
        get_all: {
            params: [],
            func: function func() {
                return moviesModel.getAll();
            }
        },
        get_all_with_file_info: {
            params: [],
            func: function func() {
                return movieAPI.getAllMoviesWithFileInfo();
            }
        }
    }
};

exports.default = movies;