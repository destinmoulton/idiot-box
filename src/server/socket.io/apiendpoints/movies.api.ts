import ibdb from "../../db/IBDB";
import logger from "../../logger";

import FilesModel from "../../models/db/FilesModel";
import FileToMovieModel from "../../models/db/FileToMovieModel";
import GenresModel from "../../models/db/GenresModel";
import MovieAPI from "../../models/MovieAPI";
import MovieToGenreModel from "../../models/db/MovieToGenreModel";
import MoviesModel from "../../models/db/MoviesModel";

const filesModel = new FilesModel(ibdb);
const fileToMovieModel = new FileToMovieModel(ibdb);
const genresModel = new GenresModel(ibdb);
const movieToGenreModel = new MovieToGenreModel(ibdb, genresModel);
const moviesModel = new MoviesModel(ibdb, movieToGenreModel);

const movieAPIModels = {
    filesModel,
    fileToMovieModel,
    movieToGenreModel,
    moviesModel
};

const movieAPI = new MovieAPI(movieAPIModels);

const movies = {
    movie: {
        delete: {
            params: ["movie_id"],
            func: movieID => movieAPI.deleteSingle(movieID)
        },
        update_status_tags: {
            params: ["movie_id", "status_tags"],
            func: (movieID, statusTags) =>
                movieAPI.updateStatusTags(movieID, statusTags)
        }
    },
    movies: {
        get_all: {
            params: [],
            func: () => moviesModel.getAll()
        },
        get_all_with_file_info: {
            params: [],
            func: () => movieAPI.getAllMoviesWithFileInfo()
        }
    }
};

export default movies;
