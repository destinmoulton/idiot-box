import axios from "axios";
import cheerio from "cheerio";
import randomUseragent from "random-useragent";

export default class IMDBScraperModel {
    _posterSelector: string;
    _imdbPath: string;

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
        return axios.get(url, options).then((resp) => {
            const $ = cheerio.load(resp.data);
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
