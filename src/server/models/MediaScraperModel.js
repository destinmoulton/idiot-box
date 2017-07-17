import fs from 'fs';
import path from 'path';

import fetch from 'node-fetch';

export default class MediaScrapeModel {
    
    constructor(traktInstance, settingsModel){
        this._trakt = traktInstance;
        this._settingsModel = settingsModel;
    }

    searchMovies(movieQuery){
        const options = {
            query: movieQuery,
            type: 'movie',
            extended: 'full'
        };
        return this._trakt.search.text(options)
            .then((results)=>{
                return results.map((item)=>{return item.movie});
            })
    }

    searchShows(tvQuery){
        return this._trakt.search.text({
            query: tvQuery,
            type: 'show',
            extended: 'full'
        });
    }

    getShowSeasonsList(id){
        return this._trakt.seasons.summary({
            id,
            extended: 'full'
        });
    }

    getEpisodesForSeason(showID, seasonNumber){
        return this._trakt.seasons.season({
            id: showID,
            season: seasonNumber,
            extended: 'full'
        });
    }

    downloadThumbnail(typeOfMedia, fileURL, destFilenameMinusExt){
        const origFilename = fileURL.split("/").pop();
        const origFileExt = origFilename.split(".").pop();
        const destFilename = destFilenameMinusExt + "." + origFileExt;

        this._settingsModel.getSingle("thumbpaths", typeOfMedia)
            .then((setting)=>{
                if(!fs.existsSync(setting.value)){
                    return Promise.reject(`MediaScrapeModel :: downloadThumbnail :: The path for ${typeOfMedia} ${setting.value} does not exist.`);
                }
                return fetch(fileURL), setting;
            })
            .then((res, thumbPath)=>{
                const finalPath = path.join(thumbPath, destFilename);
                const dest = fs.createWriteStream(finalPath);
                res.body.pipe(dest);
                return destFilename;
            })
    }
}