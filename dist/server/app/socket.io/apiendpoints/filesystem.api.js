"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IBDB_1 = __importDefault(require("../../db/IBDB"));
const FilesystemModel_1 = __importDefault(require("../../models/FilesystemModel"));
const FilesModel_1 = __importDefault(require("../../models/db/FilesModel"));
const FileToEpisodeModel_1 = __importDefault(require("../../models/db/FileToEpisodeModel"));
const FileToMovieModel_1 = __importDefault(require("../../models/db/FileToMovieModel"));
const GenresModel_1 = __importDefault(require("../../models/db/GenresModel"));
const MoviesModel_1 = __importDefault(require("../../models/db/MoviesModel"));
const MovieToGenreModel_1 = __importDefault(require("../../models/db/MovieToGenreModel"));
const SettingsModel_1 = __importDefault(require("../../models/db/SettingsModel"));
const ShowSeasonEpisodesModel_1 = __importDefault(require("../../models/db/ShowSeasonEpisodesModel"));
const settingsModel = new SettingsModel_1.default(IBDB_1.default);
const filesModel = new FilesModel_1.default(IBDB_1.default);
const fileToEpisodeModel = new FileToEpisodeModel_1.default(IBDB_1.default);
const fileToMovieModel = new FileToMovieModel_1.default(IBDB_1.default);
const genresModel = new GenresModel_1.default(IBDB_1.default);
const movieToGenreModel = new MovieToGenreModel_1.default(IBDB_1.default, genresModel);
const moviesModel = new MoviesModel_1.default(IBDB_1.default, movieToGenreModel);
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
const filesystem = {
    dir: {
        get: {
            params: ["base_path", "full_path"],
            func: async (basePath, fullPath) => {
                return await filesystemModel.getDirList(basePath, fullPath);
            },
        },
    },
    trash: {
        execute: {
            params: ["source_path", "filenames"],
            func: async (sourcePath, filenames) => {
                return await filesystemModel.trash(sourcePath, filenames);
            },
        },
    },
    rename: {
        multiple: {
            params: ["source_path", "dest_path", "items_to_rename"],
            func: async (sourcePath, destPath, itemsToRename) => {
                return await filesystemModel.directMoveMultiple(sourcePath, destPath, itemsToRename);
            },
        },
    },
};
exports.default = filesystem;
//# sourceMappingURL=filesystem.api.js.map