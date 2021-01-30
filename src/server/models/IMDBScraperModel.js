import needle from "needle";
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
            headers: {
                "User-Agent": randomUseragent.getRandom((ua) => {
                    return (
                        parseFloat(ua.browserVersion) >= 20 &&
                        ua.browserName === "Firefox"
                    );
                }),
                accept: "text/html",
            },
        };
        return needle("get", url, options).then((resp) => {
            const $ = cheerio.load(resp.body);
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
