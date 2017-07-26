"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IDModel = function () {
    function IDModel(models) {
        _classCallCheck(this, IDModel);

        this._filesystemModel = models.filesystemModel, this._filesModel = models.filesModel;
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
        key: "idAndArchiveMovie",
        value: function idAndArchiveMovie(movieInfo, imageURL, sourceInfo, destInfo) {
            var _this = this;

            var imageFilename = this._buildThumbFilename(movieInfo);
            return this._filesystemModel.move(sourceInfo, destInfo, "Movies").then(function () {
                if (imageURL !== "") {
                    return _this._mediaScraperModel.downloadThumbnail("Movie", imageURL, imageFilename);
                }
                return Promise.resolve("");
            }).then(function (imageFilename) {
                return _this._moviesModel.addMovie(movieInfo, imageFilename);
            }).then(function (movieRow) {
                return _this._settingsModel.getSingle("directories", "Movies").then(function (destSetting) {
                    return _this._filesModel.addFile(destSetting.id, destInfo.subpath, destInfo.filename, "movie");
                }).then(function (fileRow) {
                    return _this._fileToMovieModel.add(fileRow.id, movieRow.id);
                });
            });
        }
    }, {
        key: "idAndArchiveEpisode",
        value: function idAndArchiveEpisode(epInfo, sourceInfo, destInfo) {
            var _this2 = this;

            return this._filesystemModel.move(sourceInfo, destInfo, "Shows").then(function () {
                return _this2._settingsModel.getSingle("directories", "Shows");
            }).then(function (destSetting) {
                return _this2._filesModel.addFile(destSetting.id, destInfo.subpath, destInfo.filename, "show");
            }).then(function (fileRow) {
                return _this2._fileToEpisodeModel.add(fileRow.id, epInfo.show_id, epInfo.season_id, epInfo.episode_id);
            });
        }
    }, {
        key: "removeMultipleIDs",
        value: function removeMultipleIDs(itemsToRemove) {
            var _this3 = this;

            var promisesToRun = [];
            itemsToRemove.forEach(function (item) {
                promisesToRun.push(_this3.removeSingleID(item));
            });

            return Promise.all(promisesToRun);
        }
    }, {
        key: "removeSingleID",
        value: function removeSingleID(idInfo) {
            var _this4 = this;

            if (idInfo.type === "movie") {
                return this._filesModel.deleteSingle(idInfo.file_id).then(function () {
                    return _this4._fileToMovieModel.deleteSingle(idInfo.file_id, idInfo.movie_id);
                }).then(function () {
                    return _this4._moviesModel.deleteSingle(idInfo.movie_id);
                });
            } else if (inInfo.type === "show") {
                return this._filesModel.deleteSingle(idInfo.file_id).then(function () {
                    return _this4._fileToEpisodeModel.deleteSingle(idInfo.file_id, idInfo.episode_id);
                }).then(function () {
                    return _this4._showSeasonEpisodesModel.deleteSingle(idInfo.episode_id);
                });
            }
        }
    }, {
        key: "addShow",
        value: function addShow(showInfo, imageInfo) {
            var _this5 = this;

            var imageFilename = this._buildThumbFilename(showInfo);
            return this._mediaScraperModel.downloadThumbnail("Show", imageInfo.url, imageFilename).then(function (imageFilename) {
                return _this5._showsModel.addShow(showInfo, imageFilename);
            }).then(function (show) {
                return _this5._mediaScraperModel.getShowSeasonsList(show.trakt_id).then(function (seasons) {
                    return _this5._showSeasonsModel.addArrayOfSeasons(seasons, show.id);
                }).then(function (addedSeasons) {
                    var promisesToRun = [];
                    addedSeasons.forEach(function (season) {
                        var prom = _this5._mediaScraperModel.getEpisodesForSeason(show.trakt_id, season.season_number).then(function (episodesArr) {
                            return _this5._showSeasonEpisodesModel.addArrEpisodes(show.id, season.id, episodesArr);
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
    }]);

    return IDModel;
}();

exports.default = IDModel;