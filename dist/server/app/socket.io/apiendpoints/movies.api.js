'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _IBDB = require('../../db/IBDB');

var _IBDB2 = _interopRequireDefault(_IBDB);

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

var _GenresModel = require('../../models/db/GenresModel');

var _GenresModel2 = _interopRequireDefault(_GenresModel);

var _MovieToGenreModel = require('../../models/db/MovieToGenreModel');

var _MovieToGenreModel2 = _interopRequireDefault(_MovieToGenreModel);

var _MoviesModel = require('../../models/db/MoviesModel');

var _MoviesModel2 = _interopRequireDefault(_MoviesModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var genresModel = new _GenresModel2.default(_IBDB2.default);
var movieToGenreModel = new _MovieToGenreModel2.default(_IBDB2.default, genresModel);
var moviesModel = new _MoviesModel2.default(_IBDB2.default, movieToGenreModel);

var movies = {
    movies: {
        get_all: {
            params: [],
            func: function func() {
                return moviesModel.getAll();
            }
        }
    }
};

exports.default = movies;