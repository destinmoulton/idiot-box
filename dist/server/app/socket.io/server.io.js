"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = serverIOListeners;

var _os = _interopRequireDefault(require("os"));

var _path = _interopRequireDefault(require("path"));

var _logger = _interopRequireDefault(require("../logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function serverIOListeners(socket) {
  socket.on('server.info.request', function () {
    var data = {
      hostname: _os["default"].hostname(),
      pathSeparator: _path["default"].sep
    };
    socket.emit('server.info.ready', data);
  });
}