"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _IBDB = _interopRequireDefault(require("../../db/IBDB"));

var _logger = _interopRequireDefault(require("../../logger"));

var _EpisodeAPI = _interopRequireDefault(require("../../models/EpisodeAPI"));

var _FilesModel = _interopRequireDefault(require("../../models/db/FilesModel"));

var _FileToEpisodeModel = _interopRequireDefault(require("../../models/db/FileToEpisodeModel"));

var _ShowsAPI = _interopRequireDefault(require("../../models/ShowsAPI"));

var _ShowsModel = _interopRequireDefault(require("../../models/db/ShowsModel"));

var _ShowSeasonsModel = _interopRequireDefault(require("../../models/db/ShowSeasonsModel"));

var _ShowSeasonEpisodesModel = _interopRequireDefault(require("../../models/db/ShowSeasonEpisodesModel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var filesModel = new _FilesModel["default"](_IBDB["default"]);
var fileToEpisodeModel = new _FileToEpisodeModel["default"](_IBDB["default"]);
var showsModel = new _ShowsModel["default"](_IBDB["default"]);
var showSeasonsModel = new _ShowSeasonsModel["default"](_IBDB["default"]);
var showSeasonEpisodesModel = new _ShowSeasonEpisodesModel["default"](_IBDB["default"]);
var episodeAPIConfig = {
  filesModel: filesModel,
  fileToEpisodeModel: fileToEpisodeModel,
  showSeasonEpisodesModel: showSeasonEpisodesModel
};
var episodeAPI = new _EpisodeAPI["default"](episodeAPIConfig);
var showsAPIConfig = {
  filesModel: filesModel,
  fileToEpisodeModel: fileToEpisodeModel,
  showsModel: showsModel,
  showSeasonEpisodesModel: showSeasonEpisodesModel,
  showSeasonsModel: showSeasonsModel
};
var showsAPI = new _ShowsAPI["default"](showsAPIConfig);
var shows = {
  show: {
    get_for_slug: {
      params: ['slug'],
      func: function func(slug) {
        return showsModel.getSingleBySlug(slug);
      }
    },
    "delete": {
      params: ['show_id'],
      func: function func(showID) {
        return showsAPI.deleteSingleShow(showID);
      }
    }
  },
  shows: {
    get: {
      params: [],
      func: function func() {
        return showsModel.getAll();
      }
    },
    get_all_with_locked_info: {
      params: [],
      func: function func() {
        return showsAPI.getAllShowsWithSeasonLockedInfo();
      }
    }
  },
  season: {
    toggle_lock: {
      params: ['season_id', 'lock_status'],
      func: function func(seasonID, lockStatus) {
        return showSeasonsModel.updateLock(seasonID, lockStatus);
      }
    }
  },
  seasons: {
    get: {
      params: ['show_id'],
      func: function func(showID) {
        return showSeasonsModel.getSeasonsForShow(showID);
      }
    }
  },
  episodes: {
    get: {
      params: ['show_id', 'season_id'],
      func: function func(showID, seasonID) {
        return showSeasonEpisodesModel.getEpisodesForSeason(showID, seasonID);
      }
    },
    get_all_with_file_info: {
      params: ['show_id', 'season_number'],
      func: function func(showID, seasonNum) {
        return episodeAPI.getAllEpisodesWithFileInfo(showID, seasonNum);
      }
    },
    toggle_watched: {
      params: ['episode_ids', 'watched_status'],
      func: function func(episodeIDs, watchedStatus) {
        return showSeasonEpisodesModel.updateMultipleEpisodesWatchedStatus(episodeIDs, watchedStatus);
      }
    },
    get_between_unix_timestamps: {
      params: ['start_unix_timestamp', 'end_unix_timestamp'],
      func: function func(startUnixTimestamp, endUnixTimestamp) {
        return showsAPI.getEpisodesBetweenTimestamps(startUnixTimestamp, endUnixTimestamp);
      }
    }
  },
  episode: {
    collate: {
      params: ['episode_info'],
      func: function func(episodeInfo) {
        return showSeasonEpisodesModel.collateEpisodeInfo(episodeInfo, showsModel, showSeasonsModel);
      }
    }
  }
};
var _default = shows;
exports["default"] = _default;