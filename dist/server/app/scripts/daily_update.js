"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const trakt_tv_1 = __importDefault(require("trakt.tv"));
const IBDB_1 = __importDefault(require("../db/IBDB"));
const FilesModel_1 = __importDefault(require("../models/db/FilesModel"));
const FileToEpisodeModel_1 = __importDefault(require("../models/db/FileToEpisodeModel"));
const MediaScraperModel_1 = __importDefault(require("../models/MediaScraperModel"));
const SettingsModel_1 = __importDefault(require("../models/db/SettingsModel"));
const ShowsModel_1 = __importDefault(require("../models/db/ShowsModel"));
const ShowSeasonsModel_1 = __importDefault(require("../models/db/ShowSeasonsModel"));
const ShowSeasonEpisodesModel_1 = __importDefault(require("../models/db/ShowSeasonEpisodesModel"));
const config_1 = __importDefault(require("../config"));
const settingsModel = new SettingsModel_1.default(IBDB_1.default);
const filesModel = new FilesModel_1.default(IBDB_1.default);
const fileToEpisodeModel = new FileToEpisodeModel_1.default(IBDB_1.default);
const mediaScraperModel = new MediaScraperModel_1.default(new trakt_tv_1.default(config_1.default.trakt), settingsModel);
const showsModel = new ShowsModel_1.default(IBDB_1.default);
const showSeasonsModel = new ShowSeasonsModel_1.default(IBDB_1.default);
const showSeasonEpisodesModel = new ShowSeasonEpisodesModel_1.default(IBDB_1.default);
(async () => {
    await IBDB_1.default.connect(config_1.default);
    await compareShows();
})();
async function compareShows() {
    const shows = await showsModel.getAll();
    return shows.map(async (show) => {
        return await compareSeasons(show.id, show.trakt_id);
    });
}
async function compareSeasons(showID, showTraktID) {
    const traktSeasons = await mediaScraperModel.getShowSeasonsList(showTraktID);
    return traktSeasons.map(async (traktSeason) => {
        return await processSeason(traktSeason, showID, showTraktID);
    });
}
async function processSeason(traktSeason, showID, showTraktID) {
    let showSeason = await showSeasonsModel.getSingleByTraktID(traktSeason.ids.trakt);
    if (!showSeason.hasOwnProperty("id")) {
        // Add the season
        showSeason = await showSeasonsModel.addShowSeason(showID, traktSeason);
    }
    if (showSeason.locked !== 1) {
        return await compareEpisodes(showID, showSeason.id, showTraktID, showSeason.season_number);
    }
    return true;
}
async function compareEpisodes(showID, seasonID, showTraktID, seasonNum) {
    const traktEpisodes = await mediaScraperModel.getEpisodesForSeason(showTraktID, seasonNum);
    return traktEpisodes.map(async (traktEpisode) => {
        return await processEpisode(showID, seasonID, traktEpisode);
    });
}
async function processEpisode(showID, seasonID, traktEpisode) {
    let seasonEpisode = await showSeasonEpisodesModel.getSingleByTraktID(traktEpisode.ids.trakt);
    if (!seasonEpisode.hasOwnProperty("id")) {
        // Add the episode
        return await showSeasonEpisodesModel.addEpisode(showID, seasonID, traktEpisode);
    }
    else {
        return await showSeasonEpisodesModel.updateEpisode(showID, seasonID, seasonEpisode.id, traktEpisode);
    }
}
//# sourceMappingURL=daily_update.js.map