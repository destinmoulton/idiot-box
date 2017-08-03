'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShowSeasonEpisodesModel = function () {
    function ShowSeasonEpisodesModel(ibdb) {
        _classCallCheck(this, ShowSeasonEpisodesModel);

        this._ibdb = ibdb;

        this._tableName = "show_season_episodes";
    }

    _createClass(ShowSeasonEpisodesModel, [{
        key: '_prepareData',
        value: function _prepareData(showID, seasonID, apiData) {
            return {
                show_id: showID,
                season_id: seasonID,
                season_number: apiData.season,
                episode_number: apiData.number,
                title: apiData.title,
                overview: apiData.overview,
                rating: apiData.rating,
                first_aired: (0, _moment2.default)(apiData.first_aired).format('X'),
                updated_at: (0, _moment2.default)(apiData.updated_at).format('X'),
                runtime: apiData.runtime,
                trakt_id: apiData.ids.trakt,
                tvdb_id: apiData.ids.tvdb,
                imdb_id: apiData.ids.imdb,
                tmdb_id: apiData.ids.tmdb,
                tvrage_id: apiData.ids.tvrage,
                watched: 0
            };
        }
    }, {
        key: 'addEpisode',
        value: function addEpisode(showID, seasonID, apiData) {
            var _this = this;

            var data = this._prepareData(showID, seasonID, apiData);

            return this.getSingleByShowSeasonTrakt(showID, seasonID, data.episode_number, data.trakt_id).then(function (episode) {
                if ('id' in episode) {
                    return episode;
                }
                return _this._ibdb.insert(data, _this._tableName);
            }).then(function () {
                return _this.getSingleByShowSeasonTrakt(showID, seasonID, data.episode_number, data.trakt_id);
            });
        }
    }, {
        key: 'addArrEpisodes',
        value: function addArrEpisodes(showID, seasonID, episodes) {
            var _this2 = this;

            var promisesToRun = [];

            episodes.forEach(function (episode) {
                promisesToRun.push(_this2.addEpisode(showID, seasonID, episode));
            });

            return Promise.all(promisesToRun);
        }
    }, {
        key: 'updateMultipleEpisodesWatchedStatus',
        value: function updateMultipleEpisodesWatchedStatus(episodeIDs, watchedStatus) {
            var _this3 = this;

            var promisesToRun = [];
            episodeIDs.forEach(function (episodeID) {
                promisesToRun.push(_this3.updateEpisodeWatchedStatus(episodeID, watchedStatus));
            });

            return Promise.all(promisesToRun);
        }
    }, {
        key: 'updateEpisodeWatchedStatus',
        value: function updateEpisodeWatchedStatus(episodeID, newWatchedStatus) {
            var data = {
                watched: newWatchedStatus
            };

            var where = {
                id: episodeID
            };
            return this._ibdb.update(data, where, this._tableName);
        }
    }, {
        key: 'getSingle',
        value: function getSingle(episodeID) {
            var where = {
                id: episodeID
            };

            return this._ibdb.getRow(where, this._tableName);
        }
    }, {
        key: 'getSingleByShowSeasonTrakt',
        value: function getSingleByShowSeasonTrakt(showID, seasonID, episodeNumber, traktID) {
            var where = {
                show_id: showID,
                season_id: seasonID,
                episode_number: episodeNumber,
                trakt_id: traktID
            };

            return this._ibdb.getRow(where, this._tableName);
        }
    }, {
        key: 'getEpisodesForSeason',
        value: function getEpisodesForSeason(showID, seasonID) {
            var where = {
                show_id: showID,
                season_id: seasonID
            };
            return this._ibdb.getAll(where, this._tableName, "episode_number ASC");
        }
    }, {
        key: 'getEpisodesForSeasonNum',
        value: function getEpisodesForSeasonNum(showID, seasonNum) {
            var where = {
                show_id: showID,
                season_number: seasonNum
            };
            return this._ibdb.getAll(where, this._tableName, "episode_number ASC");
        }
    }, {
        key: 'deleteSingle',
        value: function deleteSingle(episodeID) {
            var where = {
                id: episodeID
            };

            return this._ibdb.delete(where, this._tableName);
        }
    }, {
        key: 'collateEpisodeInfo',
        value: function collateEpisodeInfo(episodeInfo, showsModel, showSeasonsModel) {
            var _this4 = this;

            var show = {};
            var season = {};

            return showsModel.getSingle(episodeInfo.show_id).then(function (showInfo) {
                show = showInfo;
                return showSeasonsModel.getSingle(episodeInfo.season_id);
            }).then(function (seasonInfo) {
                season = seasonInfo;
                return _this4.getSingle(episodeInfo.episode_id);
            }).then(function (episode) {
                return {
                    show: show,
                    season: season,
                    episode: episode
                };
            });
        }
    }]);

    return ShowSeasonEpisodesModel;
}();

exports.default = ShowSeasonEpisodesModel;