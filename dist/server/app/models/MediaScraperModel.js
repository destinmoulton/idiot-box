'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _thumbnails = require('../config/thumbnails.config');

var _thumbnails2 = _interopRequireDefault(_thumbnails);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MediaScraperModel = function () {
    function MediaScraperModel(traktInstance, settingsModel) {
        _classCallCheck(this, MediaScraperModel);

        this._trakt = traktInstance;
        this._settingsModel = settingsModel;
    }

    _createClass(MediaScraperModel, [{
        key: 'searchMovies',
        value: function searchMovies(movieQuery) {
            var options = {
                query: movieQuery,
                type: 'movie',
                extended: 'full'
            };
            return this._trakt.search.text(options).then(function (results) {
                return results.map(function (item) {
                    return item.movie;
                });
            });
        }
    }, {
        key: 'searchShows',
        value: function searchShows(tvQuery) {
            var options = {
                query: tvQuery,
                type: 'show',
                extended: 'full'
            };
            return this._trakt.search.text(options).then(function (results) {
                return results.map(function (item) {
                    return item.show;
                });
            });
        }
    }, {
        key: 'getShowByTraktID',
        value: function getShowByTraktID(traktID) {
            var options = {
                id: traktID,
                extended: 'full'
            };
            return this._trakt.shows.summary(options);
        }
    }, {
        key: 'getShowSeasonsList',
        value: function getShowSeasonsList(id) {
            return this._trakt.seasons.summary({
                id: id,
                extended: 'full'
            });
        }
    }, {
        key: 'getEpisodesForSeason',
        value: function getEpisodesForSeason(showID, seasonNumber) {
            return this._trakt.seasons.season({
                id: showID,
                season: seasonNumber,
                extended: 'full'
            });
        }
    }, {
        key: 'downloadThumbnail',
        value: function downloadThumbnail(typeOfMedia, fileURL, destFilenameMinusExt) {
            var origFilename = fileURL.split("/").pop();
            var origFileExt = origFilename.split(".").pop();
            var destFilename = destFilenameMinusExt + "." + origFileExt;

            var camelCaseType = typeOfMedia[0].toUpperCase() + typeOfMedia.slice(1);

            return (0, _nodeFetch2.default)(fileURL).then(function (res) {
                var finalPath = _path2.default.join(_thumbnails2.default[typeOfMedia], destFilename);
                var dest = _fs2.default.createWriteStream(finalPath);
                res.body.pipe(dest);
                return destFilename;
            });
        }
    }]);

    return MediaScraperModel;
}();

exports.default = MediaScraperModel;