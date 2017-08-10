'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _IBDB = require('../../db/IBDB');

var _IBDB2 = _interopRequireDefault(_IBDB);

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

var _EpisodeAPIModel = require('../../models/EpisodeAPIModel');

var _EpisodeAPIModel2 = _interopRequireDefault(_EpisodeAPIModel);

var _FilesModel = require('../../models/db/FilesModel');

var _FilesModel2 = _interopRequireDefault(_FilesModel);

var _FileToEpisodeModel = require('../../models/db/FileToEpisodeModel');

var _FileToEpisodeModel2 = _interopRequireDefault(_FileToEpisodeModel);

var _ShowsAPI = require('../../models/ShowsAPI');

var _ShowsAPI2 = _interopRequireDefault(_ShowsAPI);

var _ShowsModel = require('../../models/db/ShowsModel');

var _ShowsModel2 = _interopRequireDefault(_ShowsModel);

var _ShowSeasonsModel = require('../../models/db/ShowSeasonsModel');

var _ShowSeasonsModel2 = _interopRequireDefault(_ShowSeasonsModel);

var _ShowSeasonEpisodesModel = require('../../models/db/ShowSeasonEpisodesModel');

var _ShowSeasonEpisodesModel2 = _interopRequireDefault(_ShowSeasonEpisodesModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var filesModel = new _FilesModel2.default(_IBDB2.default);
var fileToEpisodeModel = new _FileToEpisodeModel2.default(_IBDB2.default);
var showsModel = new _ShowsModel2.default(_IBDB2.default);
var showSeasonsModel = new _ShowSeasonsModel2.default(_IBDB2.default);
var showSeasonEpisodesModel = new _ShowSeasonEpisodesModel2.default(_IBDB2.default);

var episodeAPIConfig = {
    filesModel: filesModel,
    fileToEpisodeModel: fileToEpisodeModel,
    showSeasonEpisodesModel: showSeasonEpisodesModel
};

var episodeAPIModel = new _EpisodeAPIModel2.default(episodeAPIConfig);

var showsAPIConfig = {
    filesModel: filesModel,
    fileToEpisodeModel: fileToEpisodeModel,
    showsModel: showsModel,
    showSeasonEpisodesModel: showSeasonEpisodesModel,
    showSeasonsModel: showSeasonsModel
};

var showsAPI = new _ShowsAPI2.default(showsAPIConfig);

var shows = {
    show: {
        get_for_slug: {
            params: ['slug'],
            func: function func(slug) {
                return showsModel.getSingleBySlug(slug);
            }
        },
        delete: {
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
                return episodeAPIModel.getAllEpisodesWithFileInfo(showID, seasonNum);
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

exports.default = shows;