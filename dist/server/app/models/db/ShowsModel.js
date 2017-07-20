'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShowsModel = function () {
    function ShowsModel(ibdb) {
        _classCallCheck(this, ShowsModel);

        this._ibdb = ibdb;

        this._tableName = "shows";
    }

    _createClass(ShowsModel, [{
        key: '_prepareData',
        value: function _prepareData(apiData, imageFilename) {
            return {
                title: apiData.title,
                year: apiData.year,
                overview: apiData.overview,
                first_aired: (0, _moment2.default)(apiData.first_aired).format('X'),
                runtime: apiData.runtime,
                network: apiData.network,
                status: apiData.status,
                rating: apiData.rating,
                updated_at: (0, _moment2.default)(apiData.updated_at).format('X'),
                slug: apiData.slug,
                trakt_id: apiData.ids.trakt,
                tvdb_id: apiData.ids.tvdb,
                imdb_id: apiData.ids.imdb,
                tmdb_id: apiData.ids.tmdb,
                tvrage_id: apiData.ids.tvrage,
                image_filename: imageFilename
            };
        }
    }, {
        key: 'addShow',
        value: function addShow(apiData, imageFilename) {
            var _this = this;

            var data = this._prepareData(apiData, imageFilename);

            return this.getSingleByTraktID(data.trakt_id).then(function (show) {
                if ('id' in show) {
                    return show;
                }
                return _this._ibdb.insert(data, _this._tableName);
            }).then(function () {
                return _this.getSingleByTraktID(data.trakt_id);
            });
        }
    }, {
        key: 'getSingleByTraktID',
        value: function getSingleByTraktID(traktID) {
            var where = {
                trakt_id: traktID
            };

            return this._ibdb.getRow(where, this._tableName);
        }
    }, {
        key: 'getAll',
        value: function getAll() {
            return this._ibdb.getAll({}, this._tableName, "title ASC");
        }
    }]);

    return ShowsModel;
}();

exports.default = ShowsModel;