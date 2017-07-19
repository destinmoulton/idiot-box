"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IDModel = function () {
    function IDModel(models) {
        _classCallCheck(this, IDModel);

        this._filesModel = models.filesModel;
        this._fileToMovieModel = models.fileToMovieModel;
        this._mediaScraperModel = models.mediaScraperModel;
        this._moviesModel = models.moviesModel;
        this._settingsModel = models.settingsModel;
    }

    _createClass(IDModel, [{
        key: "idMovie",
        value: function idMovie(movieInfo, fileInfo, imageInfo) {
            var _this = this;

            var imageFilename = movieInfo.title + "." + movieInfo.year;
            return this._mediaScraperModel.downloadThumbnail("Movie", imageInfo.url, imageFilename).then(function (imageFilename) {
                return _this._moviesModel.addMovie(movieInfo, imageFilename);
            }).then(function (movieRow) {
                return _this._filesModel.addFile(fileInfo.setting_id, fileInfo.subpath, fileInfo.filename, "movie").then(function (fileRow) {
                    return _this._fileToMovieModel.add(fileRow.id, movieRow.id);
                });
            });
        }
    }, {
        key: "findID",
        value: function findID(fileInfo) {
            var _this2 = this;

            var subpath = fileInfo.fullPath.slice(fileInfo.basePath.length + 1);
            return this._settingsModel.getSingleByCatAndVal("directories", fileInfo.basePath).then(function (setting) {
                if (!'id' in setting) {
                    return {};
                }
                return _this2._filesModel.getSingleByDirectoryAndFilename(setting.id, subpath, fileInfo.filename);
            }).then(function (file) {
                if (!'id' in file) {
                    return {};
                }

                if (file.mediatype === "movie") {
                    return _this2._fileToMovieModel.getSingleForFile(file.id).then(function (fileToMovie) {
                        return _this2._moviesModel.getSingle(fileToMovie.movie_id);
                    });
                } else {
                    return {};
                }
            });
        }
    }]);

    return IDModel;
}();

exports.default = IDModel;