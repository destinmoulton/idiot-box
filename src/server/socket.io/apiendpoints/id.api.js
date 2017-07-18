import Trakt from 'trakt.tv';

import traktConfig from '../../config/trakt.config';

import ibdb from '../../db/IBDB';
import logger from '../../logger';

import IDMovieModel from '../../models/IDMovieModel';
import FilesModel from '../../models/db/FilesModel';
import FileToMovieModel from '../../models/db/FileToMovieModel';
import GenresModel from '../../models/db/GenresModel';
import MediaScraperModel from '../../models/MediaScraperModel';
import MoviesModel from '../../models/db/MoviesModel';
import MovieToGenreModel from '../../models/db/MovieToGenreModel';
import SettingsModel from '../../models/db/SettingsModel';

const filesModel = new FilesModel(ibdb);
const fileToMovieModel = new FileToMovieModel(ibdb);
const settingsModel = new SettingsModel(ibdb);
const genresModel = new GenresModel(ibdb);
const mediaScraperModel = new MediaScraperModel(new Trakt(traktConfig), settingsModel);
const movieToGenreModel = new MovieToGenreModel(ibdb, genresModel);
const moviesModel = new MoviesModel(ibdb, movieToGenreModel);
const idMovieModel = new IDMovieModel(mediaScraperModel, moviesModel, filesModel, fileToMovieModel);

const id = {
    movie: {
        run: {
            params: ['movie_info', 'file_info', 'image_info'],
            func: (movieInfo, fileInfo, imageInfo)=> idMovieModel.runID(movieInfo, fileInfo, imageInfo)
        }
    }
};

export default id;