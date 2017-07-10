'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _IBDB = require('../../db/IBDB');

var _IBDB2 = _interopRequireDefault(_IBDB);

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

var _FilesModel = require('./FilesModel');

var _FilesModel2 = _interopRequireDefault(_FilesModel);

var _SettingsModel = require('./SettingsModel');

var _SettingsModel2 = _interopRequireDefault(_SettingsModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("FilesModel", function () {
    var settingsModel = {};
    var filesModel = {};
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
            filesModel = new _FilesModel2.default(_IBDB2.default);
            settingsModel = new _SettingsModel2.default(_IBDB2.default);
        });
    });

    afterEach(function () {
        _IBDB2.default.close();
    });

    it("adds a file", function () {
        var filename = "testfilename.tst";
        var subpath = "test/path/here";
        var mediatype = "show";
        var setting_id = 0;
        expect.assertions(4);
        return settingsModel.addSetting("directories", "youtube", "/mnt/youtube").then(function (setting) {
            setting_id = setting.id;
            return filesModel.addFile(setting_id, subpath, filename, mediatype);
        }).then(function (file) {
            expect(file.directory_setting_id).toBe(setting_id);
            expect(file.subpath).toBe(subpath);
            expect(file.filename).toBe(filename);
            expect(file.mediatype).toBe(mediatype);
        });
    });
});