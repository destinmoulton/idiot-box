'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _trakt = require('trakt.tv');

var _trakt2 = _interopRequireDefault(_trakt);

var _trakt3 = require('../../config/trakt.config');

var _trakt4 = _interopRequireDefault(_trakt3);

var _IBDB = require('../../db/IBDB');

var _IBDB2 = _interopRequireDefault(_IBDB);

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

var _IDModel = require('../../models/IDModel');

var _IDModel2 = _interopRequireDefault(_IDModel);

var _FilesModel = require('../../models/db/FilesModel');

var _FilesModel2 = _interopRequireDefault(_FilesModel);

var _FileToMovieModel = require('../../models/db/FileToMovieModel');

var _FileToMovieModel2 = _interopRequireDefault(_FileToMovieModel);

var _GenresModel = require('../../models/db/GenresModel');

var _GenresModel2 = _interopRequireDefault(_GenresModel);

var _MediaScraperModel = require('../../models/MediaScraperModel');

var _MediaScraperModel2 = _interopRequireDefault(_MediaScraperModel);

var _MoviesModel = require('../../models/db/MoviesModel');

var _MoviesModel2 = _interopRequireDefault(_MoviesModel);

var _MovieToGenreModel = require('../../models/db/MovieToGenreModel');

var _MovieToGenreModel2 = _interopRequireDefault(_MovieToGenreModel);

var _SettingsModel = require('../../models/db/SettingsModel');

var _SettingsModel2 = _interopRequireDefault(_SettingsModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var filesModel = new _FilesModel2.default(_IBDB2.default);
var fileToMovieModel = new _FileToMovieModel2.default(_IBDB2.default);
var settingsModel = new _SettingsModel2.default(_IBDB2.default);
var genresModel = new _GenresModel2.default(_IBDB2.default);
var mediaScraperModel = new _MediaScraperModel2.default(new _trakt2.default(_trakt4.default), settingsModel);
var movieToGenreModel = new _MovieToGenreModel2.default(_IBDB2.default, genresModel);
var moviesModel = new _MoviesModel2.default(_IBDB2.default, movieToGenreModel);

var models = {
    filesModel: filesModel,
    fileToMovieModel: fileToMovieModel,
    mediaScraperModel: mediaScraperModel,
    moviesModel: moviesModel,
    settingsModel: settingsModel
};
var idModel = new _IDModel2.default(models);

var id = {
    file: {
        search: {
            params: ['file_info'],
            func: function func(fileInfo) {
                return idModel.findID(fileInfo);
            }
        }
    },
    movie: {
        run: {
            params: ['movie_info', 'file_info', 'image_info'],
            func: function func(movieInfo, fileInfo, imageInfo) {
                return idModel.idMovie(movieInfo, fileInfo, imageInfo);
            }
        }
    }
};

exports.default = id;