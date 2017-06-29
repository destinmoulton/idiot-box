'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = serverIOListeners;

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function serverIOListeners(socket) {
    socket.on('server.info.request', function () {
        var data = {
            hostname: _os2.default.hostname(),
            pathSeparator: _path2.default.sep
        };

        socket.emit('server.info.ready', data);
    });
}