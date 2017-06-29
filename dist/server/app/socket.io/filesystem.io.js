'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = filesystemIOListeners;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _io = require('./io');

var _io2 = _interopRequireDefault(_io);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function filesystemIOListeners(socket) {
    socket.on('filesystem.dir.list', function (options) {

        if (!_fs2.default.existsSync(options.path)) {
            socket.emit('filesystem.error', { message: options.path + ' does not exist.' });
        }
        var contents = _fs2.default.readdirSync(options.path);
        var dirList = [];
        contents.forEach(function (name) {
            var info = _fs2.default.statSync(_path2.default.join(options.path, name));
            var data = {
                name: name,
                ino: info.ino,
                atime: info.atime,
                birthtime: info.birthtime,
                size: info.size,
                isDirectory: info.isDirectory()
            };
            dirList.push(data);
        });

        socket.emit('filesystem.dir.ready', dirList);
    });
}