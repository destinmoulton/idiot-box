'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MovieAPI = function () {
    function MovieAPI(models) {
        _classCallCheck(this, MovieAPI);

        this._filesModel = models.filesModel;
        this._fileToMovieModel = models.fileToMovieModel;
        this._moviesModel = models.moviesModel;
        this._movieToGenreModel = models.movieToGenreModel;
    }

    _createClass(MovieAPI, [{
        key: 'deleteSingle',
        value: function deleteSingle(movieID) {
            var _this = this;

            return this._moviesModel.getSingle(movieID).then(function (movie) {
                if (!movie.hasOwnProperty('id')) {
                    return Promise.reject("MovieAPI :: deleteSingle() :: Unable to find movie ${movieID}");
                }

                return _this._removeGenresForMovie(movieID);
            }).then(function () {
                return _this._removeFileAssociationForMovie(movieID);
            }).then(function () {
                return _this._moviesModel.deleteSingle(movieID);
            });
        }
    }, {
        key: '_removeFileAssociationForMovie',
        value: function _removeFileAssociationForMovie(movieID) {
            var _this2 = this;

            return this._fileToMovieModel.getSingleForMovie(movieID).then(function (fileToMovie) {
                if (!fileToMovie.hasOwnProperty('file_id')) {
                    return Promise.reject("MovieAPI :: _removeFileAssociationForMovie :: Unable to find file to movie association");
                }

                return _this2._filesModel.deleteSingle(fileToMovie.file_id).then(function () {
                    return _this2._fileToMovieModel.deleteSingle(fileToMovie.file_id, movieID);
                });
            });
        }
    }, {
        key: '_removeGenresForMovie',
        value: function _removeGenresForMovie(movieID) {
            return this._movieToGenreModel.deleteForMovie(movieID);
        }
    }]);

    return MovieAPI;
}();

exports.default = MovieAPI;