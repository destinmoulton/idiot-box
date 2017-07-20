import Trakt from 'trakt.tv';

import traktConfig from '../../config/trakt.config';

import ibdb from '../../db/IBDB';
import logger from '../../logger';

import IDModel from '../../models/IDModel';
import FilesModel from '../../models/db/FilesModel';
import FileToMovieModel from '../../models/db/FileToMovieModel';
import GenresModel from '../../models/db/GenresModel';
import MediaScraperModel from '../../models/MediaScraperModel';
import MoviesModel from '../../models/db/MoviesModel';
import MovieToGenreModel from '../../models/db/MovieToGenreModel';
import SettingsModel from '../../models/db/SettingsModel';
import ShowsModel from '../../models/db/ShowsModel';
import ShowSeasonsModel from '../../models/db/ShowSeasonsModel';
import ShowSeasonEpisodesModel from '../../models/db/ShowSeasonEpisodesModel';

const filesModel = new FilesModel(ibdb);
const fileToMovieModel = new FileToMovieModel(ibdb);
const settingsModel = new SettingsModel(ibdb);
const genresModel = new GenresModel(ibdb);
const mediaScraperModel = new MediaScraperModel(new Trakt(traktConfig), settingsModel);
const movieToGenreModel = new MovieToGenreModel(ibdb, genresModel);
const moviesModel = new MoviesModel(ibdb, movieToGenreModel);
const showsModel = new ShowsModel(ibdb);
const showSeasonsModel = new ShowSeasonsModel(ibdb);
const showSeasonEpisodesModel = new ShowSeasonEpisodesModel(ibdb);

const models = {
    filesModel,
    fileToMovieModel,
    mediaScraperModel,
    moviesModel,
    settingsModel,
    showsModel,
    showSeasonsModel,
    showSeasonEpisodesModel
};
const idModel = new IDModel(models);

const id = {
    file: {
        search: {
            params: ['file_info'],
            func: (fileInfo) => idModel.findID(fileInfo)
        }
    },
    movie: {
        add: {
            params: ['movie_info', 'file_info', 'image_info'],
            func: (movieInfo, fileInfo, imageInfo)=> idModel.idMovie(movieInfo, fileInfo, imageInfo)
        }
    },
    show: {
        add: {
            params: ['show_info', 'image_info'],
            func: (showInfo, imageInfo)=> idModel.addShow(showInfo, imageInfo)
        }
    },
    episode: {
        id: {
            params: ['ep_info', 'file_info'],
            func: (epInfo, fileInfo)=> idModel.idEpisode(epInfo, fileInfo)
        }
    }
};

export default id;