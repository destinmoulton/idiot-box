'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setupSocketIO = setupSocketIO;

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _settings = require('./settings.io');

var _settings2 = _interopRequireDefault(_settings);

var _filesystem = require('./filesystem.io');

var _filesystem2 = _interopRequireDefault(_filesystem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var io = {};
function setupSocketIO(server) {
    io = _socket2.default.listen(server, { path: '/socket.io' });
    setupListeners(io);
}

function setupListeners(io) {
    io.on('connection', function (socket) {
        _logger2.default.info("socket.io :: client connected");
        (0, _settings2.default)(socket);
        (0, _filesystem2.default)(socket);
    });
}

exports.default = io;