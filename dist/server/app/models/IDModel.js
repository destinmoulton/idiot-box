"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _logger = require("../logger");

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
            return this._filesystemModel.moveInSetDir(sourceInfo, destInfo, "Movies").then(function () {
                if (imageURL !== "") {
                    return _this._mediaScraperModel.downloadThumbnail("movies", imageURL, imageFilename);
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

            return this._filesystemModel.moveInSetDir(sourceInfo, destInfo, "Shows").then(function () {
                return _this2._settingsModel.getSingle("directories", "Shows");
            }).then(function (destSetting) {
                return _this2._filesModel.addFile(destSetting.id, destInfo.subpath, destInfo.filename, "show");
            }).then(function (fileRow) {
                return _this2._fileToEpisodeModel.add(fileRow.id, epInfo.show_id, epInfo.season_id, epInfo.episode_id);
            });
        }
    }, {
        key: "idAndArchiveMultipleEpisodes",
        value: function idAndArchiveMultipleEpisodes(sourcePathInfo, destSubpath, idInfo) {
            var _this3 = this;

            var episodesToMove = idInfo.episodes;
            var filenames = Object.keys(episodesToMove);

            var promisesToRun = [];

            filenames.forEach(function (filename) {
                var episode = episodesToMove[filename];
                var dest = {
                    filename: episode.newFilename,
                    subpath: destSubpath
                };

                var source = {
                    setting_id: sourcePathInfo.setting_id,
                    subpath: sourcePathInfo.subpath,
                    filename: filename
                };

                var epInfo = {
                    show_id: idInfo.show_id,
                    season_id: idInfo.season_id,
                    episode_id: episode.selectedEpisodeID
                };

                promisesToRun.push(_this3.idAndArchiveEpisode(epInfo, source, dest));
            });

            return Promise.all(promisesToRun);
        }
    }, {
        key: "removeMultipleIDs",
        value: function removeMultipleIDs(itemsToRemove) {
            var _this4 = this;

            var promisesToRun = [];
            itemsToRemove.forEach(function (item) {
                promisesToRun.push(_this4.removeSingleID(item.assocData));
            });

            return Promise.all(promisesToRun);
        }
    }, {
        key: "removeSingleID",
        value: function removeSingleID(idInfo) {
            if (idInfo.type === "movie") {
                return this._removeMovie(idInfo);
            } else if (idInfo.type === "show") {}
        }

        /**
         * Remove a movie and the file-to-movie associated with it.
         *
         * The movie is deleted because movies are 1:1 with files.
         *
         * @param object idInfo
         */

    }, {
        key: "_removeMovie",
        value: function _removeMovie(idInfo) {
            var _this5 = this;

            return this._filesModel.deleteSingle(idInfo.file_id).then(function () {
                return _this5._fileToMovieModel.deleteSingle(idInfo.file_id, idInfo.movie_id);
            }).then(function () {
                return _this5._moviesModel.deleteSingle(idInfo.movie_id);
            });
        }
    }, {
        key: "addShow",
        value: function addShow(showInfo, imageInfo) {
            var _this6 = this;

            var imageFilename = this._buildThumbFilename(showInfo);
            return this._mediaScraperModel.downloadThumbnail("shows", imageInfo.url, imageFilename).then(function (imageFilename) {
                return _this6._showsModel.addShow(showInfo, imageFilename);
            }).then(function (show) {
                return _this6._scrapeAndAddSeasonsForShow(show);
            });
        }
    }, {
        key: "_buildThumbFilename",
        value: function _buildThumbFilename(mediaInfo) {
            return mediaInfo.title + "." + mediaInfo.year;
        }

        /**
         * Scrape and add the seasons (and episodes)
         * for a show.
         *
         * @param Show show
         */

    }, {
        key: "_scrapeAndAddSeasonsForShow",
        value: function _scrapeAndAddSeasonsForShow(show) {
            var _this7 = this;

            return this._mediaScraperModel.getShowSeasonsList(show.trakt_id).then(function (seasons) {
                return _this7._showSeasonsModel.addArrayOfSeasons(seasons, show.id);
            }).then(function (addedSeasons) {
                return _this7._scrapeAndAddEpisodesForSeasons(show, addedSeasons);
            });
        }

        /**
         * Scrape the episodes for an array of seasons and
         * add them to the db.
         *
         * @param Show show
         * @param ShowSeasons seasons for a show
         */

    }, {
        key: "_scrapeAndAddEpisodesForSeasons",
        value: function _scrapeAndAddEpisodesForSeasons(show, seasons) {
            var _this8 = this;

            var promisesToRun = [];
            seasons.forEach(function (season) {
                var prom = _this8._mediaScraperModel.getEpisodesForSeason(show.trakt_id, season.season_number).then(function (episodesArr) {
                    return _this8._showSeasonEpisodesModel.addArrEpisodes(show.id, season.id, episodesArr);
                });
                promisesToRun.push(prom);
            });
            return Promise.all(promisesToRun);
        }
    }]);

    return IDModel;
}();

exports.default = IDModel;