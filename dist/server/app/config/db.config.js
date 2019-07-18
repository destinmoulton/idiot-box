"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  filename: _path["default"].resolve(__dirname, '../../database/idiot-box.sqlite3'),
  migrationsPath: _path["default"].resolve(__dirname, '../../migrations')
};
exports["default"] = _default;