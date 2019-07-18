"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _events = _interopRequireDefault(require("events"));

var _logger = _interopRequireDefault(require("./logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var emitter = new _events["default"]();
emitter.on('uncaughtException', function (err) {
  _logger["default"].error(err);
});
var _default = emitter;
exports["default"] = _default;