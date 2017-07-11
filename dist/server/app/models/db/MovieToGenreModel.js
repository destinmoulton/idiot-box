"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MovieToGenreModel = function () {
    function MovieToGenreModel(ibdb, genresModel) {
        _classCallCheck(this, MovieToGenreModel);

        this._ibdb = ibdb;
        this._genresModel = genresModel;
        this._tableName = "movie_to_genre";
    }

    _createClass(MovieToGenreModel, [{
        key: "addMovieToArrayGenres",
        value: function addMovieToArrayGenres(movieID, genreArray) {
            var _this = this;

            var toProcess = [];
            genreArray.forEach(function (genreSlug) {
                toProcess.push(_this._genresModel.addGenre(genreSlug).then(function (genreInfo) {
                    return _this.addMovieToGenre(movieID, genreInfo.id);
                }));
            });

            return Promise.all(toProcess);
        }
    }, {
        key: "addMovieToGenre",
        value: function addMovieToGenre(movieID, genreID) {
            var _this2 = this;

            var data = {
                movie_id: movieID,
                genre_id: genreID
            };

            return this._ibdb.insert(data, this._tableName).then(function () {
                return _this2.getSingleByMovieAndGenre(movieID, genreID);
            });
        }
    }, {
        key: "getAllGenresForMovie",
        value: function getAllGenresForMovie(movieID) {
            var _this3 = this;

            var where = {
                movie_id: movieID
            };

            return this._ibdb.getAll(where, this._tableName).then(function (movieToGenres) {
                var toProcess = [];
                movieToGenres.forEach(function (link) {
                    toProcess.push(_this3._genresModel.getSingle(link.genre_id));
                });

                return Promise.all(toProcess);
            }).then(function (genres) {
                return genres.sort(_this3._sortGenresByName);
            });
        }
    }, {
        key: "getAllMoviesForGenre",
        value: function getAllMoviesForGenre(genreID) {
            var where = {
                genre_id: genreID
            };

            return this._ibdb.getAll(where, this._tableName);
        }
    }, {
        key: "getSingleByMovieAndGenre",
        value: function getSingleByMovieAndGenre(movieID, genreID) {
            var where = {
                movie_id: movieID,
                genre_id: genreID
            };

            return this._ibdb.getRow(where, this._tableName);
        }

        // Sort the array of genres by the 'name' property

    }, {
        key: "_sortGenresByName",
        value: function _sortGenresByName(a, b) {
            if (a.slug < b.slug) {
                return -1;
            }
            if (a.slug > b.slug) {
                return 1;
            }
            return 0;
        }
    }]);

    return MovieToGenreModel;
}();

exports.default = MovieToGenreModel;