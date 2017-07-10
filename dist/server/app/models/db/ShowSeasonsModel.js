'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ShowSeasonsModel = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShowSeasonsModel = exports.ShowSeasonsModel = function () {
    function ShowSeasonsModel(ibdb) {
        _classCallCheck(this, ShowSeasonsModel);

        this._ibdb = ibdb;

        this._tableName = "show_seasons";
    }

    _createClass(ShowSeasonsModel, [{
        key: '_prepareData',
        value: function _prepareData(showID, apiData) {
            return {
                show_id: showID,
                season_number: apiData.number,
                rating: apiData.rating,
                episode_count: apiData.episode_count,
                aired_episodes: apiData.aired_episodes,
                title: apiData.title,
                overview: apiData.overview,
                first_aired: (0, _moment2.default)(apiData.first_aired).format('X'),
                trakt_id: apiData.ids.trakt,
                tvdb_id: apiData.ids.tvdb,
                tmdb_id: apiData.ids.tmdb,
                tvrage_id: apiData.ids.tvrage
            };
        }
    }, {
        key: 'addShowSeason',
        value: function addShowSeason(showID, apiData) {
            var _this = this;

            var data = this._prepareData(showID, apiData);

            return this._ibdb.insert(data, this._tableName).then(function () {
                return _this.getSingleByShowSeasonTrakt(showID, data.season_number, data.trakt_id);
            });
        }
    }, {
        key: 'getSingleByShowSeasonTrakt',
        value: function getSingleByShowSeasonTrakt(showID, seasonNumber, traktID) {
            var where = {
                show_id: showID,
                season_number: seasonNumber,
                trakt_id: traktID
            };

            return this._ibdb.getRow(where, this._tableName);
        }
    }, {
        key: 'getSeasonsForShow',
        value: function getSeasonsForShow(showID) {
            var where = {
                show_id: showID
            };
            return this._ibdb.getAll(where, this._tableName, "season_number ASC");
        }
    }]);

    return ShowSeasonsModel;
}();