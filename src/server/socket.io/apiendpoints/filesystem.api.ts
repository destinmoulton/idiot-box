import ibdb from "../../db/IBDB";

import FilesystemModel from "../../models/FilesystemModel";
import FilesModel from "../../models/db/FilesModel";
import FileToEpisodeModel from "../../models/db/FileToEpisodeModel";
import FileToMovieModel from "../../models/db/FileToMovieModel";
import GenresModel from "../../models/db/GenresModel";
import MoviesModel from "../../models/db/MoviesModel";
import MovieToGenreModel from "../../models/db/MovieToGenreModel";
import SettingsModel from "../../models/db/SettingsModel";
import ShowSeasonEpisodesModel from "../../models/db/ShowSeasonEpisodesModel";

const settingsModel = new SettingsModel(ibdb);
const filesModel = new FilesModel(ibdb);
const fileToEpisodeModel = new FileToEpisodeModel(ibdb);
const fileToMovieModel = new FileToMovieModel(ibdb);
const genresModel = new GenresModel(ibdb);
const movieToGenreModel = new MovieToGenreModel(ibdb, genresModel);
const moviesModel = new MoviesModel(ibdb, movieToGenreModel);
const showSeasonEpisodesModel = new ShowSeasonEpisodesModel(ibdb);

const filesystemConstructionModels = {
    filesModel,
    fileToEpisodeModel,
    fileToMovieModel,
    moviesModel,
    settingsModel,
    showSeasonEpisodesModel,
};
const filesystemModel = new FilesystemModel(filesystemConstructionModels);

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
                return await filesystemModel.directMoveMultiple(
                    sourcePath,
                    destPath,
                    itemsToRename
                );
            },
        },
    },
};

export default filesystem;
