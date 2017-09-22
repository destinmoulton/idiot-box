'use strict';

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

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
            expect(res[1].ids.trakt).toBe(12601);
            expect(res[1].title).toBe('TRON: Legacy');
        });
    });

    test("finds tv shows", function () {
        expect.assertions(3);
        return mediaScraper.searchShows('days').then(function (res) {
            expect(res[1].ids.trakt).toBe(4594);
            expect(res[1].title).toBe('Day Break');
            expect(res[1].status).toBe('ended');
        });
    });

    test("get a list of a show's seasons", function () {
        expect.assertions(2);
        return mediaScraper.getShowSeasonsList(107460).then(function (res) {
            expect(res[2].ids.trakt).toBe(137165);
            expect(res[2].episode_count).toBe(1);
        });
    });

    test("get the episodes for a season", function () {
        expect.assertions(4);
        return mediaScraper.getEpisodesForSeason(107460, 1).then(function (res) {
            expect(res.length).toBe(24);
            expect(res[9].number).toBe(10);
            expect(res[9].ids.trakt).toBe(2323304);
            expect(res[9].first_aired).toBe("2016-09-03T17:58:00.000Z");
        });
    });
});