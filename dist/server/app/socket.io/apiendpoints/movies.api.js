"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _IBDB = _interopRequireDefault(require("../../db/IBDB"));

var _logger = _interopRequireDefault(require("../../logger"));

var _FilesModel = _interopRequireDefault(require("../../models/db/FilesModel"));

var _FileToMovieModel = _interopRequireDefault(require("../../models/db/FileToMovieModel"));

var _GenresModel = _interopRequireDefault(require("../../models/db/GenresModel"));

var _MovieAPI = _interopRequireDefault(require("../../models/MovieAPI"));

var _MovieToGenreModel = _interopRequireDefault(require("../../models/db/MovieToGenreModel"));

var _MoviesModel = _interopRequireDefault(require("../../models/db/MoviesModel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var filesModel = new _FilesModel["default"](_IBDB["default"]);
var fileToMovieModel = new _FileToMovieModel["default"](_IBDB["default"]);
var genresModel = new _GenresModel["default"](_IBDB["default"]);
var movieToGenreModel = new _MovieToGenreModel["default"](_IBDB["default"], genresModel);
var moviesModel = new _MoviesModel["default"](_IBDB["default"], movieToGenreModel);
var movieAPIModels = {
  filesModel: filesModel,
  fileToMovieModel: fileToMovieModel,
  movieToGenreModel: movieToGenreModel,
  moviesModel: moviesModel
};
var movieAPI = new _MovieAPI["default"](movieAPIModels);
var movies = {
  movie: {
    "delete": {
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
var _default = movies;
exports["default"] = _default;