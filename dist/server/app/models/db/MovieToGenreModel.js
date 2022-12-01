"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MovieToGenreModel {
    _ibdb;
    _genresModel;
    _tableName;
    constructor(ibdb, genresModel) {
        this._ibdb = ibdb;
        this._genresModel = genresModel;
        this._tableName = "movie_to_genre";
    }
    async addMovieToArrayGenres(movieID, genreArray) {
        genreArray.forEach(async (genreSlug) => {
            const genreInfo = await this._genresModel.addGenre(genreSlug);
            await this.addMovieToGenre(movieID, genreInfo.id);
        });
    }
    async addMovieToGenre(movieID, genreID) {
        const data = {
            movie_id: movieID,
            genre_id: genreID,
        };
        await this._ibdb.insert(data, this._tableName);
        return await this.getSingleByMovieAndGenre(movieID, genreID);
    }
    async getAllGenresForMovie(movieID) {
        const where = {
            movie_id: movieID,
        };
        const movieToGenres = await this._ibdb.getAll(where, this._tableName);
        const genres = [];
        for (const link of movieToGenres) {
            genres.push(await this._genresModel.getSingle(link.genre_id));
        }
        return genres.sort(this._sortGenresByName);
    }
    async getAllMoviesForGenre(genreID) {
        const where = {
            genre_id: genreID,
        };
        return await this._ibdb.getAll(where, this._tableName);
    }
    async getSingleByMovieAndGenre(movieID, genreID) {
        const where = {
            movie_id: movieID,
            genre_id: genreID,
        };
        return await this._ibdb.getRow(where, this._tableName);
    }
    async deleteForMovie(movieID) {
        const where = {
            movie_id: movieID,
        };
        return await this._ibdb.delete(where, this._tableName);
    }
    // Sort the array of genres by the 'name' property
    _sortGenresByName(a, b) {
        if (a.slug < b.slug) {
            return -1;
        }
        if (a.slug > b.slug) {
            return 1;
        }
        return 0;
    }
}
exports.default = MovieToGenreModel;
//# sourceMappingURL=MovieToGenreModel.js.map