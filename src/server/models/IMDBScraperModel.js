import scraperjs from 'scraperjs';

export default class IMDBScraperModel {
    constructor(){
        this._posterSelector = "div.poster > a > img";
        this._imdbPath = "http://www.imdb.com/title/";
    }

    getPosterURL(imdbID){
        return scraperjs.StaticScraper.create(this._buildImdbPath(imdbID))
            .scrape(($)=>{
                return $(this._posterSelector).attr('src');
            });
    }

    _buildImdbPath(imdbID){
        return this._imdbPath + imdbID;
    }
}