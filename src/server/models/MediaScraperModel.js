import fs from 'fs';
import path from 'path';

import fetch from 'node-fetch';

import logger from '../logger';

export default class MediaScraperModel {
    
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
        const options = {
            query: tvQuery,
            type: 'show',
            extended: 'full'
        };
        return this._trakt.search.text(options)
                .then((results)=>{
                    return results.map((item)=>{return item.show});
                })
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

        const camelCaseType = typeOfMedia[0].toUpperCase() + typeOfMedia.slice(1);
        return this._settingsModel.getSingle("thumbpaths", camelCaseType)
            .then((setting)=>{
                logger.debug(setting);
                if(!fs.existsSync(setting.value)){
                    return Promise.reject(`MediaScrapeModel :: downloadThumbnail :: The path for ${typeOfMedia} ${setting.value} does not exist.`);
                }
                return fetch(fileURL)
                        .then((res)=>{
                            const finalPath = path.join(setting.value, destFilename);
                            const dest = fs.createWriteStream(finalPath);
                            res.body.pipe(dest);
                            return destFilename;
                        });
            })
    }
}