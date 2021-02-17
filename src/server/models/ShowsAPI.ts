import fs from "fs";
import path from "path";

import FilesModel from "./db/FilesModel";
import FileToEpisodeModel from "./db/FileToEpisodeModel";
import ShowsModel from "./db/ShowsModel";
import ShowSeasonEpisodesModel from "./db/ShowSeasonEpisodesModel";
import ShowSeasonsModel from "./db/ShowSeasonsModel";
import thumbConfig from "../config/thumbnails.config";

class ShowsAPI {
    _filesModel: FilesModel;
    _fileToEpisodeModel: FileToEpisodeModel;
    _showsModel: ShowsModel;
    _showSeasonsModel: ShowSeasonsModel;
    _showSeasonEpisodesModel: ShowSeasonEpisodesModel;
    constructor(models) {
        this._filesModel = models.filesModel;
        this._fileToEpisodeModel = models.fileToEpisodeModel;
        this._showsModel = models.showsModel;
        this._showSeasonEpisodesModel = models.showSeasonEpisodesModel;
        this._showSeasonsModel = models.showSeasonsModel;
    }

    async getAllShowsWithSeasonLockedInfo() {
        const shows = await this._showsModel.getAll();
        return shows.map(async (show) => {
            return await this._getSeasonLockedInfo(show);
        });
    }

    async _getSeasonLockedInfo(show) {
        const seasons = await this._showSeasonsModel.getSeasonsForShow(show.id);
        const newShow = Object.assign({}, show);

        let countLocked = 0;
        let countUnLocked = 0;
        seasons.forEach((season) => {
            if (season.locked === 1) {
                countLocked++;
            } else {
                countUnLocked++;
            }
        });

        newShow["num_seasons_locked"] = countLocked;
        newShow["num_seasons_unlocked"] = countUnLocked;
        return newShow;
    }

    async getEpisodesBetweenTimestamps(startUnixTimestamp, endUnixTimestamp) {
        const episodes = await this._showSeasonEpisodesModel.getBetweenUnixTimestamps(
            startUnixTimestamp,
            endUnixTimestamp
        );
        if (episodes.length === 0) {
            return [];
        }

        return episodes.map(async (episode) => {
            return await this._collateShowIntoEpisode(episode);
        });
    }

    async _collateShowIntoEpisode(originalEpisode) {
        const show = await this._showsModel.getSingle(originalEpisode.show_id);
        originalEpisode["show_info"] = show;
        return originalEpisode;
    }

    async deleteSingleShow(showID) {
        await this._removeEpisodes(showID);
        await this._showSeasonsModel.deleteAllForShow(showID);
        await this._removeShowThumbnail(showID);
        return await this._showsModel.deleteSingle(showID);
    }

    async _removeShowThumbnail(showID) {
        const show = await this._showsModel.getSingle(showID);
        const fullPath = path.join(thumbConfig.shows, show.image_filename);
        if (!fs.existsSync(fullPath)) {
            return true;
        }
        return fs.unlinkSync(fullPath);
    }

    async _removeEpisodes(showID) {
        const episodes = await this._showSeasonEpisodesModel.getEpisodesForShow(
            showID
        );

        episodes.forEach(async (episode) => {
            await this._removeFileAssociations(episode.id);
        });
        return await this._showSeasonEpisodesModel.deleteAllForShow(showID);
    }

    async _removeFileAssociations(episodeID) {
        const fileToEpisode = await this._fileToEpisodeModel.getSingleForEpisode(
            episodeID
        );
        await this._filesModel.deleteSingle(fileToEpisode.file_id);
        return await this._fileToEpisodeModel.deleteSingle(
            fileToEpisode.file_id,
            episodeID
        );
    }
}

export default ShowsAPI;
