"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IBDB_1 = __importDefault(require("../../db/IBDB"));
const EpisodeAPI_1 = __importDefault(require("../../models/EpisodeAPI"));
const FilesModel_1 = __importDefault(require("../../models/db/FilesModel"));
const FileToEpisodeModel_1 = __importDefault(require("../../models/db/FileToEpisodeModel"));
const ShowsAPI_1 = __importDefault(require("../../models/ShowsAPI"));
const ShowsModel_1 = __importDefault(require("../../models/db/ShowsModel"));
const ShowSeasonsModel_1 = __importDefault(require("../../models/db/ShowSeasonsModel"));
const ShowSeasonEpisodesModel_1 = __importDefault(require("../../models/db/ShowSeasonEpisodesModel"));
const filesModel = new FilesModel_1.default(IBDB_1.default);
const fileToEpisodeModel = new FileToEpisodeModel_1.default(IBDB_1.default);
const showsModel = new ShowsModel_1.default(IBDB_1.default);
const showSeasonsModel = new ShowSeasonsModel_1.default(IBDB_1.default);
const showSeasonEpisodesModel = new ShowSeasonEpisodesModel_1.default(IBDB_1.default);
const episodeAPIConfig = {
    filesModel,
    fileToEpisodeModel,
    showSeasonEpisodesModel,
};
const episodeAPI = new EpisodeAPI_1.default(episodeAPIConfig);
const showsAPIConfig = {
    filesModel,
    fileToEpisodeModel,
    showsModel,
    showSeasonEpisodesModel,
    showSeasonsModel,
};
const showsAPI = new ShowsAPI_1.default(showsAPIConfig);
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
            func: async (seasonID, lockStatus) => await showSeasonsModel.updateLock(seasonID, lockStatus),
        },
    },
    seasons: {
        get: {
            params: ["show_id"],
            func: async (showID) => {
                return await showSeasonsModel.getSeasonsForShow(showID);
            },
        },
        toggle_lock_all: {
            params: ["show_id", "lock_status"],
            func: async (showID, lockStatus) => {
                return await showSeasonsModel.updateLockAllSeasons(showID, lockStatus);
            },
        },
    },
    episodes: {
        get: {
            params: ["show_id", "season_id"],
            func: async (showID, seasonID) => {
                return await showSeasonEpisodesModel.getEpisodesForSeason(showID, seasonID);
            },
        },
        get_all_with_file_info: {
            params: ["show_id", "season_number"],
            func: async (showID, seasonNum) => {
                return await episodeAPI.getAllEpisodesWithFileInfo(showID, seasonNum);
            },
        },
        toggle_watched: {
            params: ["episode_ids", "watched_status"],
            func: async (episodeIDs, watchedStatus) => {
                return await showSeasonEpisodesModel.updateMultipleEpisodesWatchedStatus(episodeIDs, watchedStatus);
            },
        },
        get_between_unix_timestamps: {
            params: ["start_unix_timestamp", "end_unix_timestamp"],
            func: async (startUnixTimestamp, endUnixTimestamp) => {
                return await showsAPI.getEpisodesBetweenTimestamps(startUnixTimestamp, endUnixTimestamp);
            },
        },
    },
    episode: {
        collate: {
            params: ["episode_info"],
            func: async (episodeInfo) => {
                return await showSeasonEpisodesModel.collateEpisodeInfo(episodeInfo, showsModel, showSeasonsModel);
            },
        },
    },
};
exports.default = shows;
//# sourceMappingURL=shows.api.js.map