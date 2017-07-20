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
        this._fileToEpisodeModel = models.fileToEpisodeModel;
        this._fileToMovieModel = models.fileToMovieModel;
        this._mediaScraperModel = models.mediaScraperModel;
        this._moviesModel = models.moviesModel;
        this._settingsModel = models.settingsModel;
        this._showsModel = models.showsModel;
        this._showSeasonsModel = models.showSeasonsModel;
        this._showSeasonEpisodesModel = models.showSeasonEpisodesModel;
    }

    _createClass(IDModel, [{
        key: "idMovie",
        value: function idMovie(movieInfo, fileInfo, imageInfo) {
            var _this = this;

            var imageFilename = this._buildThumbFilename(movieInfo);
            return this._mediaScraperModel.downloadThumbnail("Movie", imageInfo.url, imageFilename).then(function (imageFilename) {
                return _this._moviesModel.addMovie(movieInfo, imageFilename);
            }).then(function (movieRow) {
                return _this._filesModel.addFile(fileInfo.setting_id, fileInfo.subpath, fileInfo.filename, "movie").then(function (fileRow) {
                    return _this._fileToMovieModel.add(fileRow.id, movieRow.id);
                });
            });
        }
    }, {
        key: "idEpisode",
        value: function idEpisode(epInfo, fileInfo) {
            var _this2 = this;

            return this._filesModel.addFile(fileInfo.setting_id, fileInfo.subpath, fileInfo.filename, "show").then(function (fileRow) {
                return _this2._fileToEpisodeModel.add(fileRow.id, epInfo.show_id, epInfo.season_id, epInfo.episode_id);
            });
        }
    }, {
        key: "addShow",
        value: function addShow(showInfo, imageInfo) {
            var _this3 = this;

            var imageFilename = this._buildThumbFilename(showInfo);
            return this._mediaScraperModel.downloadThumbnail("Show", imageInfo.url, imageFilename).then(function (imageFilename) {
                return _this3._showsModel.addShow(showInfo, imageFilename);
            }).then(function (show) {
                return _this3._mediaScraperModel.getShowSeasonsList(show.trakt_id).then(function (seasons) {
                    return _this3._showSeasonsModel.addArrayOfSeasons(seasons, show.id);
                }).then(function (addedSeasons) {
                    var promisesToRun = [];
                    addedSeasons.forEach(function (season) {
                        var prom = _this3._mediaScraperModel.getEpisodesForSeason(show.trakt_id, season.season_number).then(function (episodesArr) {
                            return _this3._showSeasonEpisodesModel.addArrEpisodes(show.id, season.id, episodesArr);
                        });
                        promisesToRun.push(prom);
                    });
                    return Promise.all(promisesToRun);
                });
            });
        }
    }, {
        key: "_buildThumbFilename",
        value: function _buildThumbFilename(mediaInfo) {
            return mediaInfo.title + "." + mediaInfo.year;
        }
    }, {
        key: "findID",
        value: function findID(fileInfo) {
            var _this4 = this;

            var subpath = fileInfo.fullPath.slice(fileInfo.basePath.length + 1);
            return this._settingsModel.getSingleByCatAndVal("directories", fileInfo.basePath).then(function (setting) {
                if (!'id' in setting) {
                    return {};
                }
                return _this4._filesModel.getSingleByDirectoryAndFilename(setting.id, subpath, fileInfo.filename);
            }).then(function (file) {
                if (!'id' in file) {
                    return {};
                }

                if (file.mediatype === "movie") {
                    return _this4._fileToMovieModel.getSingleForFile(file.id).then(function (fileToMovie) {
                        return _this4._moviesModel.getSingle(fileToMovie.movie_id);
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