"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _filesystem = _interopRequireDefault(require("./filesystem.api"));

var _id = _interopRequireDefault(require("./id.api"));

var _imdb = _interopRequireDefault(require("./imdb.api"));

var _mediascraper = _interopRequireDefault(require("./mediascraper.api"));

var _movies = _interopRequireDefault(require("./movies.api"));

var _settings = _interopRequireDefault(require("./settings.api"));

var _shows = _interopRequireDefault(require("./shows.api"));

var _videoplayer = _interopRequireDefault(require("./videoplayer.api"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var endpoints = {
  filesystem: _filesystem["default"],
  id: _id["default"],
  imdb: _imdb["default"],
  mediascraper: _mediascraper["default"],
  movies: _movies["default"],
  settings: _settings["default"],
  shows: _shows["default"],
  videoplayer: _videoplayer["default"]
};
var _default = endpoints;
exports["default"] = _default;