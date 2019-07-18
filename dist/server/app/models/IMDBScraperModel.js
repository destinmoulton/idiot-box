"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _scraperjs = _interopRequireDefault(require("scraperjs"));

var _randomUseragent = _interopRequireDefault(require("random-useragent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var IMDBScraperModel =
/*#__PURE__*/
function () {
  function IMDBScraperModel() {
    _classCallCheck(this, IMDBScraperModel);

    this._posterSelector = "div.poster > a > img";
    this._imdbPath = "http://www.imdb.com/title/";
  }

  _createClass(IMDBScraperModel, [{
    key: "getPosterURL",
    value: function getPosterURL(imdbID) {
      var _this = this;

      var url = this._buildImdbPath(imdbID);

      return _scraperjs["default"].StaticScraper.create().request({
        url: url,
        method: "GET",
        headers: {
          "user-agent": _randomUseragent["default"].getRandom(function (ua) {
            return parseFloat(ua.browserVersion) >= 20 && ua.browserName === 'Firefox';
          }),
          "accept": "text/html"
        }
      }).scrape(function ($) {
        return $(_this._posterSelector).attr("src");
      }).then(function (parsedResult, utils) {
        return {
          imageURL: parsedResult,
          url: utils.url
        };
      });
    }
  }, {
    key: "_buildImdbPath",
    value: function _buildImdbPath(imdbID) {
      return this._imdbPath + imdbID;
    }
  }]);

  return IMDBScraperModel;
}();

exports["default"] = IMDBScraperModel;