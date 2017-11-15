"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _scraperjs = require("scraperjs");

var _scraperjs2 = _interopRequireDefault(_scraperjs);

var _randomUseragent = require("random-useragent");

var _randomUseragent2 = _interopRequireDefault(_randomUseragent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IMDBScraperModel = function () {
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
            return _scraperjs2.default.StaticScraper.create().request({
                url: url,
                method: "GET",
                headers: {
                    "user-agent": _randomUseragent2.default.getRandom(function (ua) {
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

exports.default = IMDBScraperModel;