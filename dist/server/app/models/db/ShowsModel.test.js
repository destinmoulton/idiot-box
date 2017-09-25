'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _IBDB = require('../../db/IBDB');

var _IBDB2 = _interopRequireDefault(_IBDB);

var _ShowsModel = require('./ShowsModel');

var _ShowsModel2 = _interopRequireDefault(_ShowsModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Data taken directly from an API call
var DATASET_ONE = {
    title: 'Day Break',
    year: 2006,
    ids: {
        trakt: 4594,
        slug: 'day-break',
        tvdb: 79509,
        imdb: 'tt0801425',
        tmdb: 4618,
        tvrage: 8152
    },
    overview: 'Today Detective Brett Hopper will be accused of shooting state attorney Alberto Garza. He will offer his rock solid alibi. He will realize he\'s been framed. And he will run. Then, he will wake up and start the day over again.',
    first_aired: '2006-11-16T02:00:00.000Z',
    airs: { day: 'Wednesday', time: '21:00', timezone: 'America/New_York' },
    runtime: 42,
    certification: 'TV-14',
    network: 'ABC (US)',
    country: 'us',
    trailer: null,
    homepage: null,
    status: 'ended',
    rating: 7.76882,
    votes: 372,
    updated_at: '2017-07-06T09:28:20.000Z',
    language: 'en',
    available_translations: ['bg', 'bs', 'el', 'en', 'es', 'fr', 'ru', 'tr'],
    genres: ['drama', 'action', 'adventure', 'fantasy', 'science-fiction'],
    aired_episodes: 13
};

var DATASET_TWO = {
    title: 'Happy Days',
    year: 1974,
    ids: {
        trakt: 3822,
        slug: 'happy-days',
        tvdb: 74475,
        imdb: 'tt0070992',
        tmdb: 3845,
        tvrage: 3785
    },
    overview: 'A nostalgic comedy set in 1950s Milwaukee centered on the squeaky-clean Cunningham family and their relationship with Fonzie, a motorcycle-riding Casanova who became a pop-culture phenomenon during the show\'s heyday in the 1970s.',
    first_aired: '1974-01-15T00:00:00.000Z',
    airs: { day: 'Tuesday', time: '20:00', timezone: 'America/New_York' },
    runtime: 25,
    certification: 'TV-PG',
    network: 'ABC (US)',
    country: 'us',
    trailer: null,
    homepage: null,
    status: 'ended',
    rating: 7.54359,
    votes: 195,
    updated_at: '2017-09-19T11:00:28.000Z',
    language: 'en',
    available_translations: ['en', 'fr', 'it', 'ru'],
    genres: ['comedy'],
    aired_episodes: 255
};

describe("ShowsModel", function () {
    var showsModel = {};

    beforeEach(function () {
        var dbConfig = {
            inMemory: true
        };

        var migConfig = {
            migrationsPath: _path2.default.resolve(__dirname, '../../../migrations')
        };

        return _IBDB2.default.connect(dbConfig).then(function () {
            return _IBDB2.default._db.migrate(migConfig);
        }).then(function () {
            showsModel = new _ShowsModel2.default(_IBDB2.default);
        });
    });

    afterEach(function () {
        _IBDB2.default.close();
    });

    var IMAGE_FILENAME_ONE = "FILENEME_ONE.png";
    var IMAGE_FILENAME_TWO = "FILENAME_TWO.png";
    var EXPECTED_DATA_ONE = collateExpectation(DATASET_ONE, IMAGE_FILENAME_ONE);
    var EXPECTED_DATA_TWO = collateExpectation(DATASET_TWO, IMAGE_FILENAME_TWO);
    it("adds a single show", function () {
        expect.assertions(1);

        return showsModel.addShow(DATASET_ONE, IMAGE_FILENAME_ONE).then(function (res) {
            expect(res).toMatchObject(EXPECTED_DATA_ONE);
        });
    });

    describe("Adds Multiple and", function () {
        beforeEach(function () {
            return showsModel.addShow(DATASET_ONE, IMAGE_FILENAME_ONE).then(function (res) {
                return showsModel.addShow(DATASET_TWO, IMAGE_FILENAME_TWO);
            });
        });

        it("gets single by id [getSingle()]", function () {
            expect.assertions(1);
            return showsModel.getSingle(2).then(function (res) {
                expect(res).toMatchObject(EXPECTED_DATA_TWO);
            });
        });

        it("gets single by slug [getSingleBySlug()]", function () {
            expect.assertions(1);
            return showsModel.getSingleBySlug('day-break').then(function (res) {
                expect(res).toMatchObject(EXPECTED_DATA_ONE);
            });
        });
    });
});

function collateExpectation(apiData, imageFilename) {
    var EXPECTED_DATA = {
        title: apiData.title,
        year: apiData.year,
        overview: apiData.overview,
        first_aired: parseInt((0, _moment2.default)(apiData.first_aired).format('X')),
        runtime: apiData.runtime,
        network: apiData.network,
        status: apiData.status,
        rating: apiData.rating,
        updated_at: parseInt((0, _moment2.default)(apiData.updated_at).format('X')),
        slug: apiData.ids.slug,
        trakt_id: apiData.ids.trakt,
        tvdb_id: apiData.ids.tvdb,
        imdb_id: apiData.ids.imdb,
        tmdb_id: apiData.ids.tmdb,
        tvrage_id: apiData.ids.tvrage,
        image_filename: imageFilename
    };

    return EXPECTED_DATA;
}