"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  movies: _path["default"].resolve(__dirname, '../../public/images/movies'),
  shows: _path["default"].resolve(__dirname, '../../public/images/shows')
};
exports["default"] = _default;