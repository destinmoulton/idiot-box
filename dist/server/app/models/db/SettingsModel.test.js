'use strict';

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

    it("adds and gets a single setting", function () {
        expect.assertions(3);
        return settingsModel.addSetting("sizes", "small", 42).then(function (res) {
            expect(res.category).toBe("sizes");
            expect(res.key).toBe("small");
            expect(res.value).toBe("42");
        });
    });
});