'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = errorIOListeners;

var _eventBus = require('../eventBus');

var _eventBus2 = _interopRequireDefault(_eventBus);

var _io = require('./io');

var _io2 = _interopRequireDefault(_io);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function errorIOListeners(socket) {
    _eventBus2.default.on('error', function (message) {
        socket.emit('io.error', { message: message });
    });
}