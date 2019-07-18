"use strict";

var _path = _interopRequireDefault(require("path"));

var _IBDB = _interopRequireDefault(require("../../db/IBDB"));

var _SettingsModel = _interopRequireDefault(require("./SettingsModel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

describe("SettingsModel", function () {
  var settingsModel = {};
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
      settingsModel = new _SettingsModel["default"](_IBDB["default"]);
    });
  });
  afterEach(function () {
    _IBDB["default"].close();
  });
  describe("Gets single by", function () {
    it("id [getSingleByID()]", function () {
      expect.assertions(2);
      return settingsModel.getSingleByID(3).then(function (res) {
        expect(_typeof(res)).toBe("object");
        expect(res.key).toBe("Shows");
      });
    });
    it("category and key [getSingle()]", function () {
      expect.assertions(2);
      return settingsModel.getSingle("directories", "Movies").then(function (res) {
        expect(_typeof(res)).toBe("object");
        expect(res.key).toBe("Movies");
      });
    });
    it("category and value [getSingleByCatAndVal(]", function () {
      expect.assertions(2);
      return settingsModel.getSingle("directories", "Downloads").then(function (res) {
        expect(_typeof(res)).toBe("object");
        expect(res.key).toBe("Downloads");
      });
    });
  });
  it("adds and a single setting [addSetting()]", function () {
    expect.assertions(3);
    return settingsModel.addSetting("sizes", "small", 42).then(function (res) {
      expect(res.category).toBe("sizes");
      expect(res.key).toBe("small");
      expect(res.value).toBe("42");
    });
  });
  describe("Adds multiple and", function () {
    beforeEach(function () {
      return settingsModel.addSetting("crackers", "Nabisco", "Ritz").then(function () {
        return settingsModel.addSetting("crackers", "Keebler", "Cheez-It");
      }).then(function () {
        return settingsModel.addSetting("cookies", "Nabisco", "Oreos");
      });
    });
    it("gets all [getAll()]", function () {
      expect.assertions(3);
      return settingsModel.getAll().then(function (res) {
        expect(res.length).toBe(8);
        expect(res[3].key).toBe("Trash");
        expect(res[7].value).toBe("Oreos");
      });
    });
    it("updates single [updateSetting()]", function () {
      expect.assertions(6);
      return settingsModel.updateSetting(7, "crackers", "Nabadsco", "Nachos").then(function (res) {
        expect(res.key).toBe("Nabadsco");
        expect(res.value).toBe("Nachos");
        return settingsModel.getSingleByID(6);
      }).then(function (res) {
        expect(res.key).toBe("Nabisco");
        expect(res.value).toBe("Ritz");
        return settingsModel.getSingleByID(8);
      }).then(function (res) {
        expect(res.key).toBe("Nabisco");
        expect(res.value).toBe("Oreos");
      });
    });
    it("deletes single [deleteSetting()]", function () {
      expect.assertions(3);
      return settingsModel.deleteSetting(6).then(function () {
        return settingsModel.getAll();
      }).then(function (res) {
        expect(res.length).toBe(7);
        expect(res[5].key).toBe("Keebler");
        expect(res[6].value).toBe("Oreos");
      });
    });
  });
});