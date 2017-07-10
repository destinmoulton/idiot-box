'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ShowSeasonEpisodesModel = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShowSeasonEpisodesModel = exports.ShowSeasonEpisodesModel = function () {
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
                tvrage_id: apiData.ids.tvrage
            };
        }
    }, {
        key: 'addEpisode',
        value: function addEpisode(showID, seasonID, apiData) {
            var _this = this;

            var data = this._prepareData(showID, seasonID, apiData);

            return this._ibdb.insert(data, this._tableName).then(function () {
                return _this.getSingleByShowSeasonTrakt(showID, seasonID, data.episode_number, data.trakt_id);
            });
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
    }]);

    return ShowSeasonEpisodesModel;
}();