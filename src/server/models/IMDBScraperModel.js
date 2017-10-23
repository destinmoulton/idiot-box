import scraperjs from 'scraperjs';

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
                    "user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X)",
                    "accept":"text/html"
                }
            })
            .scrape(($)=>{
                return $(this._posterSelector).attr('src');
            });
    }

    _buildImdbPath(imdbID){
        return this._imdbPath + imdbID;
    }
}