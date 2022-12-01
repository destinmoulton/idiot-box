"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../config"));
class ShowsAPI {
    _filesModel;
    _fileToEpisodeModel;
    _showsModel;
    _showSeasonsModel;
    _showSeasonEpisodesModel;
    constructor(models) {
        this._filesModel = models.filesModel;
        this._fileToEpisodeModel = models.fileToEpisodeModel;
        this._showsModel = models.showsModel;
        this._showSeasonEpisodesModel = models.showSeasonEpisodesModel;
        this._showSeasonsModel = models.showSeasonsModel;
    }
    async getAllShowsWithSeasonLockedInfo() {
        const shows = await this._showsModel.getAll();
        const res = [];
        for (const show of shows) {
            res.push(await this._getSeasonLockedInfo(show));
        }
        return res;
    }
    async _getSeasonLockedInfo(show) {
        const seasons = await this._showSeasonsModel.getSeasonsForShow(show.id);
        const newShow = Object.assign({}, show);
        let countLocked = 0;
        let countUnLocked = 0;
        seasons.forEach((season) => {
            if (season.locked === 1) {
                countLocked++;
            }
            else {
                countUnLocked++;
            }
        });
        newShow["num_seasons_locked"] = countLocked;
        newShow["num_seasons_unlocked"] = countUnLocked;
        return newShow;
    }
    async getEpisodesBetweenTimestamps(startUnixTimestamp, endUnixTimestamp) {
        const episodes = await this._showSeasonEpisodesModel.getBetweenUnixTimestamps(startUnixTimestamp, endUnixTimestamp);
        if (episodes.length === 0) {
            return [];
        }
        let res = [];
        for (const episode of episodes) {
            res.push(await this._collateShowIntoEpisode(episode));
        }
        return res;
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
        if (show.image_filename === "") {
            return true;
        }
        const imagepaths = config_1.default.paths.images;
        const fullPath = path_1.default.join(imagepaths.base, imagepaths.shows, show.image_filename);
        if (!fs_1.default.existsSync(fullPath)) {
            return true;
        }
        const info = fs_1.default.statSync(fullPath);
        if (info.isDirectory) {
            return true;
        }
        return fs_1.default.unlinkSync(fullPath);
    }
    async _removeEpisodes(showID) {
        const episodes = await this._showSeasonEpisodesModel.getEpisodesForShow(showID);
        episodes.forEach(async (episode) => {
            await this._removeFileAssociations(episode.id);
        });
        return await this._showSeasonEpisodesModel.deleteAllForShow(showID);
    }
    async _removeFileAssociations(episodeID) {
        const fileToEpisode = await this._fileToEpisodeModel.getSingleForEpisode(episodeID);
        await this._filesModel.deleteSingle(fileToEpisode.file_id);
        return await this._fileToEpisodeModel.deleteSingle(fileToEpisode.file_id, episodeID);
    }
}
exports.default = ShowsAPI;
//# sourceMappingURL=ShowsAPI.js.map