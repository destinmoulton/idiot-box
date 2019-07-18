"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = error;
exports.doesErrorExist = doesErrorExist;

var _eventBus = _interopRequireDefault(require("./eventBus"));

var _logger = _interopRequireDefault(require("./logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var errors = [];

_eventBus["default"].on("error", function (msg) {
  errors.push(msg); //logger.error("ERROR::"+msg);
});

function error(message) {
  errors.push(message);

  _eventBus["default"].emit("error", message);
}

function doesErrorExist(msg) {
  return errors.includes(msg);
}