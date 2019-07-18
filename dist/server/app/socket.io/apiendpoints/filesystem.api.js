"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _IBDB = _interopRequireDefault(require("../../db/IBDB"));

var _FilesystemModel = _interopRequireDefault(require("../../models/FilesystemModel"));

var _FilesModel = _interopRequireDefault(require("../../models/db/FilesModel"));

var _FileToEpisodeModel = _interopRequireDefault(require("../../models/db/FileToEpisodeModel"));

var _FileToMovieModel = _interopRequireDefault(require("../../models/db/FileToMovieModel"));

var _GenresModel = _interopRequireDefault(require("../../models/db/GenresModel"));

var _MoviesModel = _interopRequireDefault(require("../../models/db/MoviesModel"));

var _MovieToGenreModel = _interopRequireDefault(require("../../models/db/MovieToGenreModel"));

var _SettingsModel = _interopRequireDefault(require("../../models/db/SettingsModel"));

var _ShowSeasonEpisodesModel = _interopRequireDefault(require("../../models/db/ShowSeasonEpisodesModel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var settingsModel = new _SettingsModel["default"](_IBDB["default"]);
var filesModel = new _FilesModel["default"](_IBDB["default"]);
var fileToEpisodeModel = new _FileToEpisodeModel["default"](_IBDB["default"]);
var fileToMovieModel = new _FileToMovieModel["default"](_IBDB["default"]);
var genresModel = new _GenresModel["default"](_IBDB["default"]);
var movieToGenreModel = new _MovieToGenreModel["default"](_IBDB["default"], genresModel);
var moviesModel = new _MoviesModel["default"](_IBDB["default"], movieToGenreModel);
var showSeasonEpisodesModel = new _ShowSeasonEpisodesModel["default"](_IBDB["default"]);
var filesystemConstructionModels = {
  filesModel: filesModel,
  fileToEpisodeModel: fileToEpisodeModel,
  fileToMovieModel: fileToMovieModel,
  moviesModel: moviesModel,
  settingsModel: settingsModel,
  showSeasonEpisodesModel: showSeasonEpisodesModel
};
var filesystemModel = new _FilesystemModel["default"](filesystemConstructionModels);
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
var _default = filesystem;
exports["default"] = _default;