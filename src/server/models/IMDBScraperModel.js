import scraperjs from "scraperjs";
import randomUseragent from "random-useragent";

export default class IMDBScraperModel {
    constructor(){
        this._posterSelector = "div.poster > a > img";
        this._imdbPath = "http://www.imdb.com/title/";
    }

    getPosterURL(imdbID){
        const url = this._buildImdbPath(imdbID);
        return scraperjs.StaticScraper.create()
            .request({
                url,
                method: "GET",
                headers: {
                    "user-agent":randomUseragent.getRandom((ua)=>{
                        return parseFloat(ua.browserVersion) >= 20 && ua.browserName === 'Firefox'
                    }),
                    "accept":"text/html"
                }
            })
            .scrape(($)=>{
                return $(this._posterSelector).attr("src");
            })
            .then((parsedResult, utils)=>{
                return {
                    imageURL: parsedResult,
                    url: utils.url
                }
            });
    }

    _buildImdbPath(imdbID){
        return this._imdbPath + imdbID;
    }
}