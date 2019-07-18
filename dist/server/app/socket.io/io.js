"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupSocketIO = setupSocketIO;
exports["default"] = void 0;

var _http = _interopRequireDefault(require("http"));

var _socket = _interopRequireDefault(require("socket.io"));

var _logger = _interopRequireDefault(require("../logger"));

var _api = _interopRequireDefault(require("./api.io"));

var _server = _interopRequireDefault(require("./server.io"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var io = {};

function setupSocketIO(server) {
  io = _socket["default"].listen(server, {
    path: '/socket.io'
  });
  setupListeners(io);
}

function setupListeners(io) {
  io.on('connection', function (socket) {
    _logger["default"].info("socket.io :: client connected");

    (0, _api["default"])(socket);
    (0, _server["default"])(socket);
  });
}

var _default = io;
exports["default"] = _default;