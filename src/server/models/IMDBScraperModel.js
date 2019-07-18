import rp from "request-promise";
import cheerio from "cheerio";
import randomUseragent from "random-useragent";

export default class IMDBScraperModel {
    constructor() {
        this._posterSelector = "div.poster > a > img";
        this._imdbPath = "http://www.imdb.com/title/";
    }

    getPosterURL(imdbID) {
        const url = this._buildImdbPath(imdbID);
        const options = {
            url,

            headers: {
                "User-Agent": randomUseragent.getRandom(ua => {
                    return (
                        parseFloat(ua.browserVersion) >= 20 &&
                        ua.browserName === "Firefox"
                    );
                }),
                accept: "text/html"
            },
            transform: function(body) {
                return cheerio.load(body);
            }
        };
        return rp(options)
            .then($ => {
                return $(this._posterSelector).attr("src");
            })
            .then(parsedResult => {
                return {
                    imageURL: parsedResult,
                    url
                };
            });
    }

    _buildImdbPath(imdbID) {
        return this._imdbPath + imdbID;
    }
}
