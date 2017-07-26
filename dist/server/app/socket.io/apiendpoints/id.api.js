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

var _FilesystemModel = require('../../models/FilesystemModel');

var _FilesystemModel2 = _interopRequireDefault(_FilesystemModel);

var _FilesModel = require('../../models/db/FilesModel');

var _FilesModel2 = _interopRequireDefault(_FilesModel);

var _FileToEpisodeModel = require('../../models/db/FileToEpisodeModel');

var _FileToEpisodeModel2 = _interopRequireDefault(_FileToEpisodeModel);

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

var _ShowsModel = require('../../models/db/ShowsModel');

var _ShowsModel2 = _interopRequireDefault(_ShowsModel);

var _ShowSeasonsModel = require('../../models/db/ShowSeasonsModel');

var _ShowSeasonsModel2 = _interopRequireDefault(_ShowSeasonsModel);

var _ShowSeasonEpisodesModel = require('../../models/db/ShowSeasonEpisodesModel');

var _ShowSeasonEpisodesModel2 = _interopRequireDefault(_ShowSeasonEpisodesModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var settingsModel = new _SettingsModel2.default(_IBDB2.default);
var filesModel = new _FilesModel2.default(_IBDB2.default);
var fileToEpisodeModel = new _FileToEpisodeModel2.default(_IBDB2.default);
var fileToMovieModel = new _FileToMovieModel2.default(_IBDB2.default);
var genresModel = new _GenresModel2.default(_IBDB2.default);
var mediaScraperModel = new _MediaScraperModel2.default(new _trakt2.default(_trakt4.default), settingsModel);
var movieToGenreModel = new _MovieToGenreModel2.default(_IBDB2.default, genresModel);
var moviesModel = new _MoviesModel2.default(_IBDB2.default, movieToGenreModel);
var showsModel = new _ShowsModel2.default(_IBDB2.default);
var showSeasonsModel = new _ShowSeasonsModel2.default(_IBDB2.default);
var showSeasonEpisodesModel = new _ShowSeasonEpisodesModel2.default(_IBDB2.default);

var filesystemConstructionModels = {
    filesModel: filesModel,
    fileToEpisodeModel: fileToEpisodeModel,
    fileToMovieModel: fileToMovieModel,
    moviesModel: moviesModel,
    settingsModel: settingsModel,
    showSeasonEpisodesModel: showSeasonEpisodesModel
};
var filesystemModel = new _FilesystemModel2.default(filesystemConstructionModels);

var idConstructionModels = {
    filesystemModel: filesystemModel,
    filesModel: filesModel,
    fileToEpisodeModel: fileToEpisodeModel,
    fileToMovieModel: fileToMovieModel,
    mediaScraperModel: mediaScraperModel,
    moviesModel: moviesModel,
    settingsModel: settingsModel,
    showsModel: showsModel,
    showSeasonsModel: showSeasonsModel,
    showSeasonEpisodesModel: showSeasonEpisodesModel
};
var idModel = new _IDModel2.default(idConstructionModels);

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
        id_and_archive: {
            params: ['movie_info', 'image_url', 'source_info', 'dest_info'],
            func: function func(movieInfo, imageURL, sourceInfo, destInfo) {
                return idModel.idAndArchiveMovie(movieInfo, imageURL, sourceInfo, destInfo);
            }
        }
    },
    show: {
        add: {
            params: ['show_info', 'image_info'],
            func: function func(showInfo, imageInfo) {
                return idModel.addShow(showInfo, imageInfo);
            }
        }
    },
    episode: {
        id_and_archive: {
            params: ['episode_info', 'source_info', 'dest_info'],
            func: function func(epInfo, sourceInfo, destInfo) {
                return idModel.idAndArchiveEpisode(epInfo, sourceInfo, destInfo);
            }
        }
    }
};

exports.default = id;