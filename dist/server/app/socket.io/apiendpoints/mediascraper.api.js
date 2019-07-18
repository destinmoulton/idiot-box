"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _trakt = _interopRequireDefault(require("trakt.tv"));

var _trakt2 = _interopRequireDefault(require("../../config/trakt.config"));

var _IBDB = _interopRequireDefault(require("../../db/IBDB"));

var _MediaScraperModel = _interopRequireDefault(require("../../models/MediaScraperModel"));

var _SettingsModel = _interopRequireDefault(require("../../models/db/SettingsModel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var settingsModel = new _SettingsModel["default"](_IBDB["default"]);
var mediaScraperModel = new _MediaScraperModel["default"](new _trakt["default"](_trakt2["default"]), settingsModel);
var mediascraper = {
  movies: {
    search: {
      params: ['search_string'],
      func: function func(searchString) {
        return mediaScraperModel.searchMovies(searchString);
      }
    }
  },
  shows: {
    search: {
      params: ['search_string'],
      func: function func(searchString) {
        return mediaScraperModel.searchShows(searchString);
      }
    }
  }
};
var _default = mediascraper;
exports["default"] = _default;