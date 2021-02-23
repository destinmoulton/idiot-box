import Trakt from "trakt.tv";

import ibdb from "../db/IBDB";

import FilesModel from "../models/db/FilesModel";
import FileToEpisodeModel from "../models/db/FileToEpisodeModel";
import MediaScraperModel from "../models/MediaScraperModel";
import SettingsModel from "../models/db/SettingsModel";
import ShowsModel from "../models/db/ShowsModel";
import ShowSeasonsModel from "../models/db/ShowSeasonsModel";
import ShowSeasonEpisodesModel from "../models/db/ShowSeasonEpisodesModel";

import config from "../config";

const settingsModel = new SettingsModel(ibdb);
const filesModel = new FilesModel(ibdb);
const fileToEpisodeModel = new FileToEpisodeModel(ibdb);
const mediaScraperModel = new MediaScraperModel(
    new Trakt(config.trakt),
    settingsModel
);
const showsModel = new ShowsModel(ibdb);
const showSeasonsModel = new ShowSeasonsModel(ibdb);
const showSeasonEpisodesModel = new ShowSeasonEpisodesModel(ibdb);

(async () => {
    await ibdb.connect(config);
    await compareShows();
})();

async function compareShows() {
    const shows = await showsModel.getAll();
    return shows.map(async (show) => {
        return await compareSeasons(show.id, show.trakt_id);
    });
}

async function compareSeasons(showID, showTraktID) {
    const traktSeasons = await mediaScraperModel.getShowSeasonsList(
        showTraktID
    );
    return traktSeasons.map(async (traktSeason) => {
        return await processSeason(traktSeason, showID, showTraktID);
    });
}

async function processSeason(traktSeason, showID, showTraktID) {
    let showSeason = await showSeasonsModel.getSingleByTraktID(
        traktSeason.ids.trakt
    );
    if (!showSeason.hasOwnProperty("id")) {
        // Add the season
        showSeason = await showSeasonsModel.addShowSeason(showID, traktSeason);
    }
    if (showSeason.locked !== 1) {
        return await compareEpisodes(
            showID,
            showSeason.id,
            showTraktID,
            showSeason.season_number
        );
    }
    return true;
}

async function compareEpisodes(showID, seasonID, showTraktID, seasonNum) {
    const traktEpisodes = await mediaScraperModel.getEpisodesForSeason(
        showTraktID,
        seasonNum
    );
    return traktEpisodes.map(async (traktEpisode) => {
        return await processEpisode(showID, seasonID, traktEpisode);
    });
}

async function processEpisode(showID, seasonID, traktEpisode) {
    let seasonEpisode = await showSeasonEpisodesModel.getSingleByTraktID(
        traktEpisode.ids.trakt
    );
    if (!seasonEpisode.hasOwnProperty("id")) {
        // Add the episode
        return await showSeasonEpisodesModel.addEpisode(
            showID,
            seasonID,
            traktEpisode
        );
    } else {
        return await showSeasonEpisodesModel.updateEpisode(
            showID,
            seasonID,
            seasonEpisode.id,
            traktEpisode
        );
    }
}
