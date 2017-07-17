"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IDMovieModal = function () {
    function IDMovieModal(mediaScraperModal, moviesModal, filesModel, fileToMovieModel) {
        _classCallCheck(this, IDMovieModal);

        this._moviesModal = moviesModal;
        this._filesModel = filesModel, this._fileToMovieModel = fileToMovieModel;
        this._mediaScraperModal = mediaScraperModal;
    }

    _createClass(IDMovieModal, [{
        key: "movie",
        value: function movie(movieInfo, pathInfo, imageInfo) {
            var _this = this;

            var imageFilename = movieInfo.title + "." + movieInfo.year;
            return this._mediaScraperModal.downloadThumbnail("Movie", imageInfo.url, imageFilename).then(function (imageFilename) {
                return _this._moviesModal.addMovie(movieInfo, imageFilename);
            }).then(function (movieRow) {
                return _this._filesModel.addFile(pathInfo.setting_id, pathInfo.subpath, pathInfo.filename, "movie").then(function (fileRow) {
                    return _this._fileToMovieModel.add(fileRow.id, movieRow.id);
                });
            });
        }
    }]);

    return IDMovieModal;
}();