"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EpisodeAPI {
    _filesModel;
    _fileToEpisodeModel;
    _showSeasonEpisodesModel;
    constructor(models) {
        this._showSeasonEpisodesModel = models.showSeasonEpisodesModel;
        this._filesModel = models.filesModel;
        this._fileToEpisodeModel = models.fileToEpisodeModel;
    }
    async getAllEpisodesWithFileInfo(showID, seasonNum) {
        const episodes = await this._showSeasonEpisodesModel.getEpisodesForSeasonNum(showID, seasonNum);
        let res = [];
        let episode;
        for (episode of episodes) {
            let data = Object.assign({}, episode);
            data["file_info"] = {};
            const fileEp = this._fileToEpisodeModel.getSingleForEpisode(episode.id);
            if (!fileEp.hasOwnProperty("file_id")) {
                res.push(data);
            }
            else {
                res.push(await this._collectFileInfo(fileEp, data));
            }
        }
        return res;
    }
    /**
     * Add File info to the episode object if it exists.
     *
     * @param FileToEpisode fileEp
     * @param ShowSeasonEpisode episode
     */
    async _collectFileInfo(fileEp, episode) {
        const file = await this._filesModel.getSingle(fileEp.file_id);
        if (!file.hasOwnProperty("id")) {
            return episode;
        }
        episode.file_info = file;
        return episode;
    }
}
exports.default = EpisodeAPI;
//# sourceMappingURL=EpisodeAPI.js.map