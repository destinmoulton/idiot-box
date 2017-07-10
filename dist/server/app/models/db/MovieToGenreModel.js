"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MovieToGenreModel = exports.MovieToGenreModel = function () {
    function MovieToGenreModel(ibdb, genresModel) {
        _classCallCheck(this, MovieToGenreModel);

        this._ibdb = ibdb;
        this._genresModel = genresModel;
        this._tableName = "movie_to_genre";
    }

    _createClass(MovieToGenreModel, [{
        key: "addMovieToGenres",
        value: function addMovieToGenres(movieID, genreArray) {
            var _this = this;

            genreArray.forEach(function (genreSlug) {});
            var data = {};

            return this._ibdb.insert(data, this._tableName).then(function () {
                return _this.getSingleByTraktID(data.trakt_id);
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
    }]);

    return MovieToGenreModel;
}();