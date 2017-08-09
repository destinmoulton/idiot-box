import fs from 'fs';
import path from 'path';

import fetch from 'node-fetch';

import logger from '../logger';

import thumbConf from '../config/thumbnails.config';

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

    getShowByTraktID(traktID){
        const options = {
            id: traktID,
            extended: 'full'
        };
        return this._trakt.shows.summary(options);
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
        const destFilename = this._sanitizeThumbFilename(destFilenameMinusExt) + "." + origFileExt;

        const camelCaseType = typeOfMedia[0].toUpperCase() + typeOfMedia.slice(1);
        
        return fetch(fileURL)
                .then((res)=>{
                    const finalPath = path.join(thumbConf[typeOfMedia], destFilename);
                    const dest = fs.createWriteStream(finalPath);
                    res.body.pipe(dest);
                    return destFilename;
                });
    }

    _sanitizeThumbFilename(originalFilename){
        // Replace current periods
        let newThumbFilename = originalFilename.replace(/\./g, "");

        // Replace spaces and dashes with periods
        newThumbFilename = newThumbFilename.replace(/(\s|\-)/g, ".");

        // Replace everything else with blank
        return newThumbFilename.replace(/[^\.a-zA-Z0-9]/g, "");
    }
}