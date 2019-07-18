"use strict";

var _path = _interopRequireDefault(require("path"));

var _IBDB = _interopRequireDefault(require("../../db/IBDB"));

var _logger = _interopRequireDefault(require("../../logger"));

var _GenresModel = _interopRequireDefault(require("./GenresModel"));

var _MoviesModel = _interopRequireDefault(require("./MoviesModel"));

var _MovieToGenreModel = _interopRequireDefault(require("./MovieToGenreModel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

describe("MoviesModel", function () {
  var genresModel = {};
  var moviesModel = {};
  var movieToGenreModel = {};
  beforeEach(function () {
    var dbConfig = {
      inMemory: true
    };
    var migConfig = {
      migrationsPath: _path["default"].resolve(__dirname, '../../../migrations')
    };
    return _IBDB["default"].connect(dbConfig).then(function () {
      return _IBDB["default"]._db.migrate(migConfig);
    }).then(function () {
      genresModel = new _GenresModel["default"](_IBDB["default"]);
      movieToGenreModel = new _MovieToGenreModel["default"](_IBDB["default"], genresModel);
      moviesModel = new _MoviesModel["default"](_IBDB["default"], movieToGenreModel);
    });
  });
  afterEach(function () {
    _IBDB["default"].close();
  });
  it("adds a movie", function () {
    var _getFirstTestData2 = _getFirstTestData(),
        _getFirstTestData3 = _slicedToArray(_getFirstTestData2, 2),
        data = _getFirstTestData3[0],
        expected = _getFirstTestData3[1];

    var imagefilename = "independenceday.jpg";
    expect.assertions(2);
    return moviesModel.addMovie(data, imagefilename).then(function (movie) {
      expect(movie).toMatchObject(expected);
      expect(movie.image_filename).toBe(imagefilename);
    });
  });
  it("toggles a movie to watched and unwatched", function () {
    var _getFirstTestData4 = _getFirstTestData(),
        _getFirstTestData5 = _slicedToArray(_getFirstTestData4, 2),
        data = _getFirstTestData5[0],
        expected = _getFirstTestData5[1];

    var imagefilename = "independenceday.jpg";
    expect.assertions(4);
    return moviesModel.addMovie(data, imagefilename).then(function (movie) {
      expect(movie).toMatchObject(expected);
      expect(movie.has_watched).toBe(0);
      return moviesModel.updateHasWatched(movie.id, 1);
    }).then(function (movie) {
      expect(movie.has_watched).toBe(1);
      return moviesModel.updateHasWatched(movie.id, 0);
    }).then(function (movie) {
      expect(movie.has_watched).toBe(0);
    });
  });
  it("adds multiple movies; verifies random fields and genres", function () {
    var _getFirstTestData6 = _getFirstTestData(),
        _getFirstTestData7 = _slicedToArray(_getFirstTestData6, 2),
        dataOne = _getFirstTestData7[0],
        expectedDataOne = _getFirstTestData7[1];

    var _getSecondTestData2 = _getSecondTestData(),
        _getSecondTestData3 = _slicedToArray(_getSecondTestData2, 2),
        dataTwo = _getSecondTestData3[0],
        expectedDataTwo = _getSecondTestData3[1];

    var imagefilenameOne = "independenceday.jpg";
    var imagefilenameSecond = "armageddon.jpg";
    expect.assertions(9);
    return moviesModel.addMovie(dataOne, imagefilenameOne).then(function (movie) {
      expect(movie).toMatchObject(expectedDataOne);
      expect(movie.image_filename).toBe(imagefilenameOne);
      return moviesModel.addMovie(dataTwo, imagefilenameSecond);
    }).then(function (movieTwo) {
      expect(movieTwo).toMatchObject(expectedDataTwo);
      expect(movieTwo.image_filename).toBe(imagefilenameSecond);
      return moviesModel.getAll();
    }).then(function (movies) {
      expect(movies.length).toBe(2); // Check a random field

      expect(movies[1].image_filename).toBe(imagefilenameOne); // Get the genres for the first movie

      return movieToGenreModel.getAllGenresForMovie(movies[0].id);
    }).then(function (genres) {
      expect(genres.length).toBe(3);
      expect(genres[2].slug).toBe('scifi'); // Get all the genres

      return genresModel.getAll();
    }).then(function (genres) {
      expect(genres.length).toBe(4);
    });
  });
});

function _getFirstTestData() {
  var slug = "independence-day-1996";
  var data = {
    title: "Independence Day",
    year: 1996,
    tagline: "Aliens don't use antivirus.",
    overview: "The aliens are coming!",
    released: "1996-07-04",
    runtime: 145,
    rating: 9.9998,
    ids: {
      trakt: 123456,
      imdb: "imdbtest",
      tmdb: 98765,
      slug: slug
    },
    genres: ['action', 'scifi', 'comedy']
  };
  var expected = Object.assign({}, data);
  expected['slug'] = slug;
  delete expected.genres;
  delete expected.ids;
  expected.trakt_id = data.ids.trakt;
  expected.imdb_id = data.ids.imdb;
  expected.tmdb_id = data.ids.tmdb;
  return [data, expected];
}

function _getSecondTestData() {
  var slug = "armageddon-1998";
  var data = {
    title: "Armageddon",
    year: 1998,
    tagline: "Astronauts can't mine.",
    overview: "The comet is coming!",
    released: "1998-06-01",
    runtime: 130,
    rating: 8.231,
    ids: {
      trakt: 112233,
      imdb: "armaimdb",
      tmdb: 998877,
      slug: slug
    },
    genres: ['action', 'scifi', 'documentary']
  };
  var expected = Object.assign({}, data);
  expected['slug'] = slug;
  delete expected.ids;
  delete expected.genres;
  expected.trakt_id = data.ids.trakt;
  expected.imdb_id = data.ids.imdb;
  expected.tmdb_id = data.ids.tmdb;
  return [data, expected];
}