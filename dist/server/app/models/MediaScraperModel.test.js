'use strict';

var _trakt = require('trakt.tv');

var _trakt2 = _interopRequireDefault(_trakt);

var _trakt3 = require('../config/trakt.config');

var _trakt4 = _interopRequireDefault(_trakt3);

var _MediaScraperModel = require('./MediaScraperModel');

var _MediaScraperModel2 = _interopRequireDefault(_MediaScraperModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("MediaScrapeModel", function () {
    var traktInstance = {};
    var mediaScraper = {};
    beforeEach(function () {
        traktInstance = new _trakt2.default(_trakt4.default);
        mediaScraper = new _MediaScraperModel2.default(traktInstance);
    });
    test("finds movies", function () {
        expect.assertions(2);
        return mediaScraper.searchMovies('tron').then(function (res) {
            expect(res[1].type).toBe('movie');
            expect(res[1].movie.title).toBe('TRON: Legacy');
        });
    });
});