'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MediaScrapeModel = function () {
    function MediaScrapeModel(traktInstance) {
        _classCallCheck(this, MediaScrapeModel);

        this._trakt = traktInstance;
    }

    _createClass(MediaScrapeModel, [{
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
            return this._trakt.search.text({
                query: tvQuery,
                type: 'show',
                extended: 'full'
            });
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
    }]);

    return MediaScrapeModel;
}();

exports.default = MediaScrapeModel;