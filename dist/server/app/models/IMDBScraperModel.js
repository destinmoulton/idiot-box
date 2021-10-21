"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var got_1 = __importDefault(require("got"));
var cheerio_1 = __importDefault(require("cheerio"));
var random_useragent_1 = __importDefault(require("random-useragent"));
var IMDBScraperModel = /** @class */ (function () {
    function IMDBScraperModel() {
        this._posterSelector = "div.ipc-poster > div.ipc-media__img > img";
        this._imdbPath = "https://www.imdb.com/title/";
    }
    IMDBScraperModel.prototype.getPosterURL = function (imdbID) {
        var _this = this;
        var url = this._buildImdbPath(imdbID);
        var options = {
            retry: 0,
            headers: {
                "user-agent": random_useragent_1["default"].getRandom(function (ua) {
                    return (parseFloat(ua.browserVersion) >= 20 &&
                        ua.browserName === "Firefox");
                }),
                accept: "text/html",
                "accept-language": "en-US,en;q=0.9",
                "cache-control": "no-cache",
                pragma: "no-cache"
            }
        };
        return got_1["default"].get(url, options).then(function (resp) {
            var $ = cheerio_1["default"].load(resp.body);
            var imageURL = $(_this._posterSelector).attr("src");
            return {
                imageURL: imageURL,
                url: url
            };
        });
    };
    IMDBScraperModel.prototype._buildImdbPath = function (imdbID) {
        return this._imdbPath + imdbID;
    };
    return IMDBScraperModel;
}());
exports["default"] = IMDBScraperModel;
//# sourceMappingURL=IMDBScraperModel.js.map