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

var _api = require('./api.io');

var _api2 = _interopRequireDefault(_api);

var _server = require('./server.io');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var io = {};
function setupSocketIO(server) {
    io = _socket2.default.listen(server, { path: '/socket.io' });
    setupListeners(io);
}

function setupListeners(io) {
    io.on('connection', function (socket) {
        _logger2.default.info("socket.io :: client connected");
        (0, _api2.default)(socket);
        (0, _server2.default)(socket);
    });
}

exports.default = io;