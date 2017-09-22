'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _IBDB = require('../../db/IBDB');

var _IBDB2 = _interopRequireDefault(_IBDB);

var _ShowsModel = require('./ShowsModel');

var _ShowsModel2 = _interopRequireDefault(_ShowsModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("ShowsModel", function () {
    var showsModel = {};

    beforeEach(function () {
        var dbConfig = {
            inMemory: true
        };

        var migConfig = {
            migrationsPath: path.resolve(__dirname, '../../../migrations')
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

    it("adds a show", function () {
        var _getTestData = getTestData(),
            _getTestData2 = _slicedToArray(_getTestData, 3),
            API_DATA = _getTestData2[0],
            EXPECTED_DATA = _getTestData2[1],
            IMAGE_FILENAME = _getTestData2[2];

        return showsModel.addShow(API_DATA);
    });
});

function getTestData() {
    // Data taken directly from an API call
    var API_DATA = {
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

    var IMAGE_FILENAME = "TEST_FILENAME.jpg";

    var EXPECTED_DATA = {
        title: API_DATA.title,
        year: API_DATA.year,
        overview: API_DATA.overview,
        first_aired: (0, _moment2.default)(API_DATA.first_aired).format('X'),
        runtime: API_DATA.runtime,
        network: API_DATA.network,
        status: API_DATA.status,
        rating: API_DATA.rating,
        updated_at: (0, _moment2.default)(API_DATA.updated_at).format('X'),
        slug: API_DATA.ids.slug,
        trakt_id: API_DATA.ids.trakt,
        tvdb_id: API_DATA.ids.tvdb,
        imdb_id: API_DATA.ids.imdb,
        tmdb_id: API_DATA.ids.tmdb,
        tvrage_id: API_DATA.ids.tvrage,
        image_filename: IMAGE_FILENAME
    };

    return [API_DATA, EXPECTED_DATA, IMAGE_FILENAME];
}