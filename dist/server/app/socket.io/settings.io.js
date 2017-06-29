'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = settingsIOListeners;

var _io = require('./io');

var _io2 = _interopRequireDefault(_io);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function settingsIOListeners(socket) {
    socket.on('settings.test', function (msg) {
        _logger2.default.debug(msg);
    });
}