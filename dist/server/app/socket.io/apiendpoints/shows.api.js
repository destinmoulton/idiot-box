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

var shows = {
    shows: {
        get: {
            params: [],
            func: function func() {
                return showsModel.getAll();
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
            params: ['show_id', 'season_id'],
            func: function func(showID, seasonID) {
                return episodeAPIModel.getAllEpisodesWithFileInfo(showID, seasonID);
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