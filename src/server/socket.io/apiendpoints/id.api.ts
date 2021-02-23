import Trakt from "trakt.tv";

import config from "../../config";

import ibdb from "../../db/IBDB";
import logger from "../../logger";

import IDModel from "../../models/IDModel";
import FilesystemModel from "../../models/FilesystemModel";
import FilesModel from "../../models/db/FilesModel";
import FileToEpisodeModel from "../../models/db/FileToEpisodeModel";
import FileToMovieModel from "../../models/db/FileToMovieModel";
import GenresModel from "../../models/db/GenresModel";
import MediaScraperModel from "../../models/MediaScraperModel";
import MoviesModel from "../../models/db/MoviesModel";
import MovieToGenreModel from "../../models/db/MovieToGenreModel";
import SettingsModel from "../../models/db/SettingsModel";
import ShowsModel from "../../models/db/ShowsModel";
import ShowSeasonsModel from "../../models/db/ShowSeasonsModel";
import ShowSeasonEpisodesModel from "../../models/db/ShowSeasonEpisodesModel";

const settingsModel = new SettingsModel(ibdb);
const filesModel = new FilesModel(ibdb);
const fileToEpisodeModel = new FileToEpisodeModel(ibdb);
const fileToMovieModel = new FileToMovieModel(ibdb);
const genresModel = new GenresModel(ibdb);
const mediaScraperModel = new MediaScraperModel(
    new Trakt(config.trakt),
    settingsModel
);
const movieToGenreModel = new MovieToGenreModel(ibdb, genresModel);
const moviesModel = new MoviesModel(ibdb, movieToGenreModel);
const showsModel = new ShowsModel(ibdb);
const showSeasonsModel = new ShowSeasonsModel(ibdb);
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
const idModel = new IDModel(idConstructionModels);

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
                return await idModel.idAndArchiveMovie(
                    movieInfo,
                    imageURL,
                    sourceInfo,
                    destInfo
                );
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
                return await idModel.idAndArchiveMultipleEpisodes(
                    sourcePathInfo,
                    destSubpath,
                    idInfo
                );
            },
        },
    },
};

export default id;
