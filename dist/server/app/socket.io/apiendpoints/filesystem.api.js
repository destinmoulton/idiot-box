'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _IBDB = require('../../db/IBDB');

var _IBDB2 = _interopRequireDefault(_IBDB);

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

var _MoviesModel = require('../../models/db/MoviesModel');

var _MoviesModel2 = _interopRequireDefault(_MoviesModel);

var _MovieToGenreModel = require('../../models/db/MovieToGenreModel');

var _MovieToGenreModel2 = _interopRequireDefault(_MovieToGenreModel);

var _SettingsModel = require('../../models/db/SettingsModel');

var _SettingsModel2 = _interopRequireDefault(_SettingsModel);

var _ShowSeasonEpisodesModel = require('../../models/db/ShowSeasonEpisodesModel');

var _ShowSeasonEpisodesModel2 = _interopRequireDefault(_ShowSeasonEpisodesModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var settingsModel = new _SettingsModel2.default(_IBDB2.default);
var filesModel = new _FilesModel2.default(_IBDB2.default);
var fileToEpisodeModel = new _FileToEpisodeModel2.default(_IBDB2.default);
var fileToMovieModel = new _FileToMovieModel2.default(_IBDB2.default);
var genresModel = new _GenresModel2.default(_IBDB2.default);
var movieToGenreModel = new _MovieToGenreModel2.default(_IBDB2.default, genresModel);
var moviesModel = new _MoviesModel2.default(_IBDB2.default, movieToGenreModel);
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

var filesystem = {
    dir: {
        get: {
            params: ['base_path', 'full_path'],
            func: function func(basePath, fullPath) {
                return filesystemModel.getDirList(basePath, fullPath);
            }
        }
    },
    trash: {
        execute: {
            params: ['source_path', 'filenames'],
            func: function func(sourcePath, filenames) {
                return filesystemModel.trash(sourcePath, filenames);
            }
        }
    },
    rename: {
        multiple: {
            params: ['source_path', 'dest_path', 'items_to_rename'],
            func: function func(sourcePath, destPath, itemsToRename) {
                return filesystemModel.directMoveMultiple(sourcePath, destPath, itemsToRename);
            }
        }
    }
};

exports.default = filesystem;