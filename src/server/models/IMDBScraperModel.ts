import got from "got";
import cheerio from "cheerio";
import randomUseragent from "random-useragent";

export default class IMDBScraperModel {
    _posterSelector: string;
    _imdbPath: string;
    constructor() {
        this._posterSelector = "div.poster > a > img";
        this._imdbPath = "https://www.imdb.com/title/";
    }

    getPosterURL(imdbID) {
        const url = this._buildImdbPath(imdbID);
        const options = {
            retry: 0,
            headers: {
                "user-agent": randomUseragent.getRandom((ua) => {
                    return (
                        parseFloat(ua.browserVersion) >= 20 &&
                        ua.browserName === "Firefox"
                    );
                }),
                accept: "text/html",
                "accept-language": "en-US,en;q=0.9",
                "cache-control": "no-cache",
                pragma: "no-cache",
            },
        };
        return got.get(url, options).then((resp) => {
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
