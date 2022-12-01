"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
let got;
import("got").then((g) => got = g);
const cheerio_1 = __importDefault(require("cheerio"));
const random_useragent_1 = __importDefault(require("random-useragent"));
class IMDBScraperModel {
    _posterSelector;
    _imdbPath;
    constructor() {
        this._posterSelector = "div.ipc-poster > div.ipc-media__img > img";
        this._imdbPath = "https://www.imdb.com/title/";
        // Dynamically load got (ecmascript)
    }
    getPosterURL(imdbID) {
        const url = this._buildImdbPath(imdbID);
        const options = {
            retry: 0,
            headers: {
                "user-agent": random_useragent_1.default.getRandom((ua) => {
                    return (parseFloat(ua.browserVersion) >= 20 &&
                        ua.browserName === "Firefox");
                }),
                accept: "text/html",
                "accept-language": "en-US,en;q=0.9",
                "cache-control": "no-cache",
                pragma: "no-cache",
            },
        };
        return got.get(url, options).then((resp) => {
            const $ = cheerio_1.default.load(resp.body);
            const imageURL = $(this._posterSelector).attr("src");
            return {
                imageURL,
                url,
            };
        });
    }
    _buildImdbPath(imdbID) {
        return this._imdbPath + imdbID;
    }
}
exports.default = IMDBScraperModel;
//# sourceMappingURL=IMDBScraperModel.js.map