export default class MoviesModel {
    constructor(ibdb, movieToGenreModel) {
        this._ibdb = ibdb;

        this._movieToGenreModel = movieToGenreModel;

        this._tableName = "movies";
    }

    addMovie(apiData, imageFilename) {
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
            status_tags: ""
        };

        return this._ibdb
            .insert(data, this._tableName)
            .then(() => {
                return this.getSingleByTraktID(data.trakt_id);
            })
            .then(movie => {
                return this._movieToGenreModel
                    .addMovieToArrayGenres(movie.id, apiData.genres)
                    .then(() => {
                        return movie;
                    });
            });
    }

    updateHasWatched(movieID, hasWatched) {
        const where = {
            id: movieID
        };
        let data = {
            has_watched: hasWatched
        };

        return this._ibdb.update(data, where, this._tableName).then(() => {
            return this.getSingle(movieID);
        });
    }

    updateStatusTags(movieID, statusTags) {
        const where = {
            id: movieID
        };

        const data = {
            status_tags: statusTags
        };

        return this._ibdb.update(data, where, this._tableName).then(() => {
            return this.getSingle(movieID);
        });
    }

    getAll() {
        return this._ibdb.getAll({}, this._tableName, "title ASC");
    }

    getSingleByTraktID(traktID) {
        const where = {
            trakt_id: traktID
        };

        return this._ibdb.getRow(where, this._tableName);
    }

    getSingle(movieID) {
        const where = {
            id: movieID
        };
        return this._ibdb.getRow(where, this._tableName);
    }

    deleteSingle(movieID) {
        const where = {
            id: movieID
        };

        return this._ibdb.delete(where, this._tableName);
    }
}