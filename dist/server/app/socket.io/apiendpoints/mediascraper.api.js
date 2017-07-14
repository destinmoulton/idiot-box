'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _trakt = require('trakt.tv');

var _trakt2 = _interopRequireDefault(_trakt);

var _trakt3 = require('../../config/trakt.config');

var _trakt4 = _interopRequireDefault(_trakt3);

var _MediaScraperModel = require('../../models/MediaScraperModel');

var _MediaScraperModel2 = _interopRequireDefault(_MediaScraperModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mediaScraperModel = new _MediaScraperModel2.default(new _trakt2.default(_trakt4.default));

var mediascraper = {
    movies: {
        search: {
            params: ['search_string'],
            func: function func(searchString) {
                return mediaScraperModel.searchMovies(searchString);
            }
        }
    }
};

exports.default = mediascraper;