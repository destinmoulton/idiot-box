import fs from "fs";
import path from "path";

import axios from "axios";
import trakt from "trakt.tv";

import logger from "../logger";

import SettingsModel from "./db/SettingsModel";
import config from "../config";

export default class MediaScraperModel {
    _trakt: any;
    _settingsModel: SettingsModel;

    constructor(traktInstance, settingsModel) {
        this._trakt = traktInstance;
        this._settingsModel = settingsModel;
    }

    async searchMovies(movieQuery) {
        const options = {
            query: movieQuery,
            type: "movie",
            extended: "full",
        };
        const results = await this._trakt.search.text(options);
        let res = [];
        for (const item of results) {
            res.push(item.movie);
        }
        return res;
    }

    async searchShows(tvQuery) {
        const options = {
            query: tvQuery,
            type: "show",
            extended: "full",
        };
        const results = await this._trakt.search.text(options);

        return results.map((item) => {
            return item.show;
        });
    }

    async getShowByTraktID(traktID) {
        const options = {
            id: traktID,
            extended: "full",
        };
        return await this._trakt.shows.summary(options);
    }

    async getShowSeasonsList(id) {
        return await this._trakt.seasons.summary({
            id,
            extended: "full",
        });
    }

    async getEpisodesForSeason(showID, seasonNumber) {
        return await this._trakt.seasons.season({
            id: showID,
            season: seasonNumber,
            extended: "full",
        });
    }

    async downloadThumbnail(typeOfMedia, fileURL, destFilenameMinusExt) {
        const origFilename = fileURL.split("/").pop();
        const origFileExt = origFilename.split(".").pop();
        const destFilename =
            this._sanitizeThumbFilename(destFilenameMinusExt) +
            "." +
            origFileExt;

        const camelCaseType =
            typeOfMedia[0].toUpperCase() + typeOfMedia.slice(1);

        const res = await axios.get(fileURL, {responseType: "stream"});
        const imagepaths = config.paths.images;

        const finalPath = path.join(
            imagepaths.base,
            imagepaths[typeOfMedia],
            destFilename
        );
        const dest = fs.createWriteStream(finalPath);
        res.data.pipe(dest);
        return destFilename;
    }

    _sanitizeThumbFilename(originalFilename) {
        // Replace current periods
        let newThumbFilename = originalFilename.replace(/\./g, "");

        // Replace spaces and dashes with periods
        newThumbFilename = newThumbFilename.replace(/(\s|\-)/g, ".");

        // Replace everything else with blank
        return newThumbFilename.replace(/[^\.a-zA-Z0-9]/g, "");
    }
}
