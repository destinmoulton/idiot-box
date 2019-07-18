"use strict";

var _path = _interopRequireDefault(require("path"));

var _IBDB = _interopRequireDefault(require("../../db/IBDB"));

var _logger = _interopRequireDefault(require("../../logger"));

var _FilesModel = _interopRequireDefault(require("./FilesModel"));

var _SettingsModel = _interopRequireDefault(require("./SettingsModel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe("FilesModel", function () {
  var settingsModel = {};
  var filesModel = {};
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
      filesModel = new _FilesModel["default"](_IBDB["default"]);
      settingsModel = new _SettingsModel["default"](_IBDB["default"]);
    });
  });
  afterEach(function () {
    _IBDB["default"].close();
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