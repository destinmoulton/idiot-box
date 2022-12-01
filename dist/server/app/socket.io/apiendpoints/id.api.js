"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const trakt_tv_1 = __importDefault(require("trakt.tv"));
const config_1 = __importDefault(require("../../config"));
const IBDB_1 = __importDefault(require("../../db/IBDB"));
const IDModel_1 = __importDefault(require("../../models/IDModel"));
const FilesystemModel_1 = __importDefault(require("../../models/FilesystemModel"));
const FilesModel_1 = __importDefault(require("../../models/db/FilesModel"));
const FileToEpisodeModel_1 = __importDefault(require("../../models/db/FileToEpisodeModel"));
const FileToMovieModel_1 = __importDefault(require("../../models/db/FileToMovieModel"));
const GenresModel_1 = __importDefault(require("../../models/db/GenresModel"));
const MediaScraperModel_1 = __importDefault(require("../../models/MediaScraperModel"));
const MoviesModel_1 = __importDefault(require("../../models/db/MoviesModel"));
const MovieToGenreModel_1 = __importDefault(require("../../models/db/MovieToGenreModel"));
const SettingsModel_1 = __importDefault(require("../../models/db/SettingsModel"));
const ShowsModel_1 = __importDefault(require("../../models/db/ShowsModel"));
const ShowSeasonsModel_1 = __importDefault(require("../../models/db/ShowSeasonsModel"));
const ShowSeasonEpisodesModel_1 = __importDefault(require("../../models/db/ShowSeasonEpisodesModel"));
const settingsModel = new SettingsModel_1.default(IBDB_1.default);
const filesModel = new FilesModel_1.default(IBDB_1.default);
const fileToEpisodeModel = new FileToEpisodeModel_1.default(IBDB_1.default);
const fileToMovieModel = new FileToMovieModel_1.default(IBDB_1.default);
const genresModel = new GenresModel_1.default(IBDB_1.default);
const mediaScraperModel = new MediaScraperModel_1.default(new trakt_tv_1.default(config_1.default.trakt), settingsModel);
const movieToGenreModel = new MovieToGenreModel_1.default(IBDB_1.default, genresModel);
const moviesModel = new MoviesModel_1.default(IBDB_1.default, movieToGenreModel);
const showsModel = new ShowsModel_1.default(IBDB_1.default);
const showSeasonsModel = new ShowSeasonsModel_1.default(IBDB_1.default);
const showSeasonEpisodesModel = new ShowSeasonEpisodesModel_1.default(IBDB_1.default);
const filesystemConstructionModels = {
    filesModel,
    fileToEpisodeModel,
    fileToMovieModel,
    moviesModel,
    settingsModel,
    showSeasonEpisodesModel,
};
const filesystemModel = new FilesystemModel_1.default(filesystemConstructionModels);
const idConstructionModels = {
    filesystemModel,
    filesModel,
    fileToEpisodeModel,
    fileToMovieModel,
    mediaScraperModel,
    moviesModel,
    settingsModel,
    showsModel,
    showSeasonsModel,
    showSeasonEpisodesModel,
};
const idModel = new IDModel_1.default(idConstructionModels);
const id = {
    // file: {
    //     search: {
    //         params: ['file_info'],
    //         func: async(fileInfo) =>await idModel.findID(fileInfo)
    //     }
    // },
    movie_or_episode: {
        remove_ids: {
            params: ["items_to_remove"],
            func: async (itemsToRemove) => {
                return await idModel.removeMultipleIDs(itemsToRemove);
            },
        },
    },
    movie: {
        id_and_archive: {
            params: ["movie_info", "image_url", "source_info", "dest_info"],
            func: async (movieInfo, imageURL, sourceInfo, destInfo) => {
                return await idModel.idAndArchiveMovie(movieInfo, imageURL, sourceInfo, destInfo);
            },
        },
    },
    show: {
        add: {
            params: ["show_info", "image_info"],
            func: async (showInfo, imageInfo) => {
                return await idModel.addShow(showInfo, imageInfo);
            },
        },
    },
    episode: {
        id_and_archive: {
            params: ["episode_info", "source_info", "dest_info"],
            func: async (epInfo, sourceInfo, destInfo) => {
                await idModel.idAndArchiveEpisode(epInfo, sourceInfo, destInfo);
            },
        },
    },
    multiple_episodes: {
        id_and_archive: {
            params: ["source_path_info", "dest_subpath", "id_info"],
            func: async (sourcePathInfo, destSubpath, idInfo) => {
                return await idModel.idAndArchiveMultipleEpisodes(sourcePathInfo, destSubpath, idInfo);
            },
        },
    },
};
exports.default = id;
//# sourceMappingURL=id.api.js.map