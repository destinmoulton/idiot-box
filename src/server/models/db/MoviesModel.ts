import { IBDB } from "../../db/IBDB";
import MovieToGenreModel from "./MovieToGenreModel";
export default class MoviesModel {
    _ibdb: IBDB;
    _tableName: string;
    _movieToGenreModel: MovieToGenreModel;

    constructor(ibdb, movieToGenreModel) {
        this._ibdb = ibdb;

        this._movieToGenreModel = movieToGenreModel;

        this._tableName = "movies";
    }

    async addMovie(apiData, imageFilename) {
        const data = {
            title: apiData.title,
            year: apiData.year,
            tagline: apiData.tagline,
            overview: apiData.overview,
            released: apiData.released,
            runtime: apiData.runtime,
            rating: apiData.rating,
            slug: apiData.ids.slug,
            trakt_id: apiData.ids.trakt,
            imdb_id: apiData.ids.imdb,
            tmdb_id: apiData.ids.tmdb,
            image_filename: imageFilename,
            has_watched: 0,
            status_tags: "",
        };

        await this._ibdb.insert(data, this._tableName);
        const movie = await this.getSingleByTraktID(data.trakt_id);
        await this._movieToGenreModel.addMovieToArrayGenres(
            movie.id,
            apiData.genres
        );
        return movie;
    }

    async updateHasWatched(movieID, hasWatched) {
        const where = {
            id: movieID,
        };
        let data = {
            has_watched: hasWatched,
        };

        await this._ibdb.update(data, where, this._tableName);
        return await this.getSingle(movieID);
    }

    async updateStatusTags(movieID, statusTags) {
        const where = {
            id: movieID,
        };

        const data = {
            status_tags: statusTags,
        };

        await this._ibdb.update(data, where, this._tableName);
        return await this.getSingle(movieID);
    }

    async getAll() {
        return await this._ibdb.getAll({}, this._tableName, "title ASC");
    }

    async getAllStartingWith(startingLetter) {
        // Include "The <letter>" for most queries
        let query =
            "SELECT * FROM " +
            this._tableName +
            " WHERE title LIKE ? " +
            " OR title LIKE ? ORDER BY title ASC";

        let params = [startingLetter + "%", "The " + startingLetter + "%"];
        if (startingLetter === "T") {
            // Don't add the "The <letter>" parameter
            query =
                "SELECT * FROM " +
                this._tableName +
                " WHERE title LIKE ? ORDER BY title ASC";

            let params = [startingLetter + "%"];
        } else if (startingLetter === "#") {
            // Run a regex for titles starting with letter
            query =
                "SELECT * FROM " +
                this._tableName +
                " WHERE title LIKE '0%' " +
                " OR title LIKE '1%' " +
                " OR title LIKE '2%' " +
                " OR title LIKE '3%' " +
                " OR title LIKE '4%' " +
                " OR title LIKE '5%' " +
                " OR title LIKE '6%' " +
                " OR title LIKE '7%' " +
                " OR title LIKE '8%' " +
                " OR title LIKE '9%' " +
                " ORDER BY title ASC";
            params = [];
        }

        return await this._ibdb.queryAll(query, params);
    }

    async getSingleByTraktID(traktID) {
        const where = {
            trakt_id: traktID,
        };

        return await this._ibdb.getRow(where, this._tableName);
    }

    async getSingle(movieID) {
        const where = {
            id: movieID,
        };
        return await this._ibdb.getRow(where, this._tableName);
    }

    async deleteSingle(movieID) {
        const where = {
            id: movieID,
        };

        return await this._ibdb.delete(where, this._tableName);
    }
}
