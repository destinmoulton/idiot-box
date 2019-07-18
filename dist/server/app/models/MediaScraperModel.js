"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _logger = _interopRequireDefault(require("../logger"));

var _thumbnails = _interopRequireDefault(require("../config/thumbnails.config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MediaScraperModel =
/*#__PURE__*/
function () {
  function MediaScraperModel(traktInstance, settingsModel) {
    _classCallCheck(this, MediaScraperModel);

    this._trakt = traktInstance;
    this._settingsModel = settingsModel;
  }

  _createClass(MediaScraperModel, [{
    key: "searchMovies",
    value: function searchMovies(movieQuery) {
      var options = {
        query: movieQuery,
        type: 'movie',
        extended: 'full'
      };
      return this._trakt.search.text(options).then(function (results) {
        return results.map(function (item) {
          return item.movie;
        });
      });
    }
  }, {
    key: "searchShows",
    value: function searchShows(tvQuery) {
      var options = {
        query: tvQuery,
        type: 'show',
        extended: 'full'
      };
      return this._trakt.search.text(options).then(function (results) {
        return results.map(function (item) {
          return item.show;
        });
      });
    }
  }, {
    key: "getShowByTraktID",
    value: function getShowByTraktID(traktID) {
      var options = {
        id: traktID,
        extended: 'full'
      };
      return this._trakt.shows.summary(options);
    }
  }, {
    key: "getShowSeasonsList",
    value: function getShowSeasonsList(id) {
      return this._trakt.seasons.summary({
        id: id,
        extended: 'full'
      });
    }
  }, {
    key: "getEpisodesForSeason",
    value: function getEpisodesForSeason(showID, seasonNumber) {
      return this._trakt.seasons.season({
        id: showID,
        season: seasonNumber,
        extended: 'full'
      });
    }
  }, {
    key: "downloadThumbnail",
    value: function downloadThumbnail(typeOfMedia, fileURL, destFilenameMinusExt) {
      var origFilename = fileURL.split("/").pop();
      var origFileExt = origFilename.split(".").pop();
      var destFilename = this._sanitizeThumbFilename(destFilenameMinusExt) + "." + origFileExt;
      var camelCaseType = typeOfMedia[0].toUpperCase() + typeOfMedia.slice(1);
      return (0, _nodeFetch["default"])(fileURL).then(function (res) {
        var finalPath = _path["default"].join(_thumbnails["default"][typeOfMedia], destFilename);

        var dest = _fs["default"].createWriteStream(finalPath);

        res.body.pipe(dest);
        return destFilename;
      });
    }
  }, {
    key: "_sanitizeThumbFilename",
    value: function _sanitizeThumbFilename(originalFilename) {
      // Replace current periods
      var newThumbFilename = originalFilename.replace(/\./g, ""); // Replace spaces and dashes with periods

      newThumbFilename = newThumbFilename.replace(/(\s|\-)/g, "."); // Replace everything else with blank

      return newThumbFilename.replace(/[^\.a-zA-Z0-9]/g, "");
    }
  }]);

  return MediaScraperModel;
}();

exports["default"] = MediaScraperModel;