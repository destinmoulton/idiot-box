"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = errorIOListeners;

var _eventBus = _interopRequireDefault(require("../eventBus"));

var _io = _interopRequireDefault(require("./io"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function errorIOListeners(socket) {
  _eventBus["default"].on('error', function (message) {
    socket.emit('error', {
      message: message
    });
  });
}