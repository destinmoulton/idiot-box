import ibdb from "../../db/IBDB";
import logger from "../../logger";

import EpisodeAPI from "../../models/EpisodeAPI";
import FilesModel from "../../models/db/FilesModel";
import FileToEpisodeModel from "../../models/db/FileToEpisodeModel";
import ShowsAPI from "../../models/ShowsAPI";
import ShowsModel from "../../models/db/ShowsModel";
import ShowSeasonsModel from "../../models/db/ShowSeasonsModel";
import ShowSeasonEpisodesModel from "../../models/db/ShowSeasonEpisodesModel";

const filesModel = new FilesModel(ibdb);
const fileToEpisodeModel = new FileToEpisodeModel(ibdb);
const showsModel = new ShowsModel(ibdb);
const showSeasonsModel = new ShowSeasonsModel(ibdb);
const showSeasonEpisodesModel = new ShowSeasonEpisodesModel(ibdb);

const episodeAPIConfig = {
    filesModel,
    fileToEpisodeModel,
    showSeasonEpisodesModel,
};

const episodeAPI = new EpisodeAPI(episodeAPIConfig);

const showsAPIConfig = {
    filesModel,
    fileToEpisodeModel,
    showsModel,
    showSeasonEpisodesModel,
    showSeasonsModel,
};

const showsAPI = new ShowsAPI(showsAPIConfig);

const shows = {
    show: {
        get_for_slug: {
            params: ["slug"],
            func: async (slug) => await showsModel.getSingleBySlug(slug),
        },
        delete: {
            params: ["show_id"],
            func: async (showID) => await showsAPI.deleteSingleShow(showID),
        },
    },
    shows: {
        get: {
            params: [],
            func: async () => await showsModel.getAll(),
        },
        get_all_with_locked_info: {
            params: [],
            func: async () => await showsAPI.getAllShowsWithSeasonLockedInfo(),
        },
    },
    season: {
        toggle_lock: {
            params: ["season_id", "lock_status"],
            func: async (seasonID, lockStatus) =>
                await showSeasonsModel.updateLock(seasonID, lockStatus),
        },
    },
    seasons: {
        get: {
            params: ["show_id"],
            func: async (showID) =>
                await showSeasonsModel.getSeasonsForShow(showID),
        },
    },
    episodes: {
        get: {
            params: ["show_id", "season_id"],
            func: async (showID, seasonID) =>
                await showSeasonEpisodesModel.getEpisodesForSeason(
                    showID,
                    seasonID
                ),
        },
        get_all_with_file_info: {
            params: ["show_id", "season_number"],
            func: async (showID, seasonNum) =>
                await episodeAPI.getAllEpisodesWithFileInfo(showID, seasonNum),
        },
        toggle_watched: {
            params: ["episode_ids", "watched_status"],
            func: async (episodeIDs, watchedStatus) =>
                await showSeasonEpisodesModel.updateMultipleEpisodesWatchedStatus(
                    episodeIDs,
                    watchedStatus
                ),
        },
        get_between_unix_timestamps: {
            params: ["start_unix_timestamp", "end_unix_timestamp"],
            func: async (startUnixTimestamp, endUnixTimestamp) =>
                await showsAPI.getEpisodesBetweenTimestamps(
                    startUnixTimestamp,
                    endUnixTimestamp
                ),
        },
    },
    episode: {
        collate: {
            params: ["episode_info"],
            func: async (episodeInfo) =>
                await showSeasonEpisodesModel.collateEpisodeInfo(
                    episodeInfo,
                    showsModel,
                    showSeasonsModel
                ),
        },
    },
};

export default shows;
