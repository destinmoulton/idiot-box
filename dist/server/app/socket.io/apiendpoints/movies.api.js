"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IBDB_1 = __importDefault(require("../../db/IBDB"));
const FilesModel_1 = __importDefault(require("../../models/db/FilesModel"));
const FileToMovieModel_1 = __importDefault(require("../../models/db/FileToMovieModel"));
const GenresModel_1 = __importDefault(require("../../models/db/GenresModel"));
const MovieAPI_1 = __importDefault(require("../../models/MovieAPI"));
const MovieToGenreModel_1 = __importDefault(require("../../models/db/MovieToGenreModel"));
const MoviesModel_1 = __importDefault(require("../../models/db/MoviesModel"));
const filesModel = new FilesModel_1.default(IBDB_1.default);
const fileToMovieModel = new FileToMovieModel_1.default(IBDB_1.default);
const genresModel = new GenresModel_1.default(IBDB_1.default);
const movieToGenreModel = new MovieToGenreModel_1.default(IBDB_1.default, genresModel);
const moviesModel = new MoviesModel_1.default(IBDB_1.default, movieToGenreModel);
const movieAPIModels = {
    filesModel,
    fileToMovieModel,
    movieToGenreModel,
    moviesModel,
};
const movieAPI = new MovieAPI_1.default(movieAPIModels);
const movies = {
    movie: {
        delete: {
            params: ["movie_id"],
            func: async (movieID) => await movieAPI.deleteSingle(movieID),
        },
        update_status_tags: {
            params: ["movie_id", "status_tags"],
            func: async (movieID, statusTags) => {
                return await movieAPI.updateStatusTags(movieID, statusTags);
            },
        },
    },
    movies: {
        get_all: {
            params: [],
            func: async () => await moviesModel.getAll(),
        },
        get_all_with_file_info: {
            params: [],
            func: async () => await movieAPI.getAllMoviesWithFileInfo(),
        },
        get_all_starting_with: {
            params: ["starting_letter"],
            func: async (startingLetter) => await movieAPI.getMoviesStartingWith(startingLetter),
        },
    },
};
exports.default = movies;
//# sourceMappingURL=movies.api.js.map