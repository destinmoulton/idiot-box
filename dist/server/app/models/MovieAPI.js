'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _thumbnails = require('../config/thumbnails.config');

var _thumbnails2 = _interopRequireDefault(_thumbnails);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
                return _this._removeMovieThumbnail(movie);
            }).then(function () {
                return _this._movieToGenreModel.deleteForMovie(movieID);
            }).then(function () {
                return _this._removeFileAssociationForMovie(movieID);
            }).then(function () {
                return _this._moviesModel.deleteSingle(movieID);
            });
        }
    }, {
        key: '_removeShowThumbnail',
        value: function _removeShowThumbnail(showID) {
            return this._showsModel.getSingle(showID).then(function (show) {
                var fullPath = _path2.default.join(_thumbnails2.default.shows, show.image_filename);
                if (!_fs2.default.existsSync(fullPath)) {
                    return Promise.resolve(true);
                }
                return Promise.resolve(_fs2.default.unlinkSync(fullPath));
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
        key: '_removeMovieThumbnail',
        value: function _removeMovieThumbnail(movie) {
            var fullPath = _path2.default.join(_thumbnails2.default.movies, movie.image_filename);
            if (!_fs2.default.existsSync(fullPath)) {
                return Promise.resolve(true);
            }
            return Promise.resolve(_fs2.default.unlinkSync(fullPath));
        }
    }]);

    return MovieAPI;
}();

exports.default = MovieAPI;