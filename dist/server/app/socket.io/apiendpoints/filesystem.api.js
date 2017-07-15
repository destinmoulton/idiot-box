'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _IBDB = require('../../db/IBDB');

var _IBDB2 = _interopRequireDefault(_IBDB);

var _FilesystemModel = require('../../models/FilesystemModel');

var _FilesystemModel2 = _interopRequireDefault(_FilesystemModel);

var _SettingsModel = require('../../models/db/SettingsModel');

var _SettingsModel2 = _interopRequireDefault(_SettingsModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var settingsModel = new _SettingsModel2.default(_IBDB2.default);
var filesystemModel = new _FilesystemModel2.default(settingsModel);

var filesystem = {
    dir: {
        get: {
            params: ['path'],
            func: function func(pathToList) {
                return filesystemModel.getDirList(pathToList);
            }
        }
    },
    trash: {
        execute: {
            params: ['source_path', 'filenames'],
            func: function func(sourcePath, filenames) {
                return filesystemModel.trash(sourcePath, filenames);
            }
        }
    }
};

exports.default = filesystem;