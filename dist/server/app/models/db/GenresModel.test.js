"use strict";

var _path = _interopRequireDefault(require("path"));

var _IBDB = _interopRequireDefault(require("../../db/IBDB"));

var _logger = _interopRequireDefault(require("../../logger"));

var _GenresModel = _interopRequireDefault(require("./GenresModel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe("GenresModel", function () {
  var genresModel = {};
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
    });
  });
  afterEach(function () {
    _IBDB["default"].close();
  });
  it("adds a genre", function () {
    expect.assertions(2);
    return genresModel.addGenre("testone").then(function (row) {
      expect(row.slug).toBe('testone');
      expect(row.name).toBe('Testone');
    });
  });
  it("can add multiple genres and get multiple", function () {
    expect.assertions(6);
    return genresModel.addGenre("testone").then(function (row) {
      expect(row.slug).toBe('testone');
      expect(row.name).toBe('Testone');
      return genresModel.addGenre("testtwo");
    }).then(function (row) {
      expect(row.slug).toBe('testtwo');
      expect(row.name).toBe('Testtwo');
      return genresModel.getAll();
    }).then(function (rows) {
      expect(rows.length).toBe(2);
      expect(rows[1].slug).toBe('testtwo');
    });
  });
  it("adds only unique genres", function () {
    expect.assertions(6);
    return genresModel.addGenre('testone').then(function (row) {
      expect(row.slug).toBe('testone');
      expect(row.name).toBe('Testone');
      return genresModel.addGenre("testone");
    }).then(function (row) {
      // Should return the row (even though it didn't add anything)
      expect(row.slug).toBe('testone');
      expect(row.name).toBe('Testone');
      return genresModel.getAll();
    }).then(function (rows) {
      // Should only have one
      expect(rows.length).toBe(1);
      expect(rows[0].slug).toBe('testone');
    });
  });
});