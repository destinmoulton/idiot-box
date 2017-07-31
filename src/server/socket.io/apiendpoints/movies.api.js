import ibdb from '../../db/IBDB';
import logger from '../../logger';

import GenresModel from '../../models/db/GenresModel';
import MovieToGenreModel from '../../models/db/MovieToGenreModel';
import MoviesModel from '../../models/db/MoviesModel';

const genresModel = new GenresModel(ibdb);
const movieToGenreModel = new MovieToGenreModel(ibdb, genresModel);
const moviesModel = new MoviesModel(ibdb, movieToGenreModel);

const movies = {
    movies: {
        get_all: {
            params: [],
            func: ()=> moviesModel.getAll()
        }
    }
};

export default movies;