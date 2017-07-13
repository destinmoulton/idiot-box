'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _FilesystemModel = require('../../models/FilesystemModel');

var _FilesystemModel2 = _interopRequireDefault(_FilesystemModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var filesystemModel = new _FilesystemModel2.default();

exports.default = filesystem = {
    dir: {
        get: {
            params: ['path'],
            func: function func(pathToList) {
                return filesystemModel.getDirList(pathToList);
            }
        }
    }
};