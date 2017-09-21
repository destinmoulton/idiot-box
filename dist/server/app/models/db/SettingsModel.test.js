'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _IBDB = require('../../db/IBDB');

var _IBDB2 = _interopRequireDefault(_IBDB);

var _SettingsModel = require('./SettingsModel');

var _SettingsModel2 = _interopRequireDefault(_SettingsModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("SettingsModel", function () {
    var settingsModel = {};
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
            settingsModel = new _SettingsModel2.default(_IBDB2.default);
        });
    });

    afterEach(function () {
        _IBDB2.default.close();
    });

    describe("Gets single by", function () {
        it("id [getSingleByID()]", function () {
            expect.assertions(2);
            return settingsModel.getSingleByID(3).then(function (res) {
                expect(typeof res === 'undefined' ? 'undefined' : _typeof(res)).toBe("object");
                expect(res.key).toBe("Shows");
            });
        });

        it("category and key [getSingle()]", function () {
            expect.assertions(2);
            return settingsModel.getSingle("directories", "Movies").then(function (res) {
                expect(typeof res === 'undefined' ? 'undefined' : _typeof(res)).toBe("object");
                expect(res.key).toBe("Movies");
            });
        });

        it("category and value [getSingleByCatAndVal(]", function () {
            expect.assertions(2);
            return settingsModel.getSingle("directories", "Downloads").then(function (res) {
                expect(typeof res === 'undefined' ? 'undefined' : _typeof(res)).toBe("object");
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
});