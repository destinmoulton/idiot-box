'use strict';

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
            migrationsPath: path.resolve(__dirname, '../../../migrations')
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
});