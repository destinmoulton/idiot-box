"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _trakt = _interopRequireDefault(require("trakt.tv"));

var _trakt2 = _interopRequireDefault(require("../../config/trakt.config"));

var _IBDB = _interopRequireDefault(require("../../db/IBDB"));

var _logger = _interopRequireDefault(require("../../logger"));

var _IDModel = _interopRequireDefault(require("../../models/IDModel"));

var _FilesystemModel = _interopRequireDefault(require("../../models/FilesystemModel"));

var _FilesModel = _interopRequireDefault(require("../../models/db/FilesModel"));

var _FileToEpisodeModel = _interopRequireDefault(require("../../models/db/FileToEpisodeModel"));

var _FileToMovieModel = _interopRequireDefault(require("../../models/db/FileToMovieModel"));

var _GenresModel = _interopRequireDefault(require("../../models/db/GenresModel"));

var _MediaScraperModel = _interopRequireDefault(require("../../models/MediaScraperModel"));

var _MoviesModel = _interopRequireDefault(require("../../models/db/MoviesModel"));

var _MovieToGenreModel = _interopRequireDefault(require("../../models/db/MovieToGenreModel"));

var _SettingsModel = _interopRequireDefault(require("../../models/db/SettingsModel"));

var _ShowsModel = _interopRequireDefault(require("../../models/db/ShowsModel"));

var _ShowSeasonsModel = _interopRequireDefault(require("../../models/db/ShowSeasonsModel"));

var _ShowSeasonEpisodesModel = _interopRequireDefault(require("../../models/db/ShowSeasonEpisodesModel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var settingsModel = new _SettingsModel["default"](_IBDB["default"]);
var filesModel = new _FilesModel["default"](_IBDB["default"]);
var fileToEpisodeModel = new _FileToEpisodeModel["default"](_IBDB["default"]);
var fileToMovieModel = new _FileToMovieModel["default"](_IBDB["default"]);
var genresModel = new _GenresModel["default"](_IBDB["default"]);
var mediaScraperModel = new _MediaScraperModel["default"](new _trakt["default"](_trakt2["default"]), settingsModel);
var movieToGenreModel = new _MovieToGenreModel["default"](_IBDB["default"], genresModel);
var moviesModel = new _MoviesModel["default"](_IBDB["default"], movieToGenreModel);
var showsModel = new _ShowsModel["default"](_IBDB["default"]);
var showSeasonsModel = new _ShowSeasonsModel["default"](_IBDB["default"]);
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
var idModel = new _IDModel["default"](idConstructionModels);
var id = {
  file: {
    search: {
      params: ['file_info'],
      func: function func(fileInfo) {
        return idModel.findID(fileInfo);
      }
    }
  },
  movie_or_episode: {
    remove_ids: {
      params: ['items_to_remove'],
      func: function func(itemsToRemove) {
        return idModel.removeMultipleIDs(itemsToRemove);
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
  },
  multiple_episodes: {
    id_and_archive: {
      params: ['source_path_info', 'dest_subpath', 'id_info'],
      func: function func(sourcePathInfo, destSubpath, idInfo) {
        return idModel.idAndArchiveMultipleEpisodes(sourcePathInfo, destSubpath, idInfo);
      }
    }
  }
};
var _default = id;
exports["default"] = _default;