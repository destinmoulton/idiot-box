"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _IMDBScraperModel = _interopRequireDefault(require("../../models/IMDBScraperModel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var imdbScraperModel = new _IMDBScraperModel["default"]();
var imdb = {
  image: {
    get: {
      params: ['imdb_id'],
      func: function func(imdbID) {
        return imdbScraperModel.getPosterURL(imdbID);
      }
    }
  }
};
var _default = imdb;
exports["default"] = _default;