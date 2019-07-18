"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _logger = _interopRequireDefault(require("../logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var IDModel =
/*#__PURE__*/
function () {
  function IDModel(models) {
    _classCallCheck(this, IDModel);

    this._filesystemModel = models.filesystemModel;
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
        return _this._addMovieFileAssociations(movieRow, destInfo);
      });
    }
    /**
     * Add the file info to the db and the movie-to-file
     * association using that info.
     *
     * @param Movie movie
     * @param object destInfo
     */

  }, {
    key: "_addMovieFileAssociations",
    value: function _addMovieFileAssociations(movie, destInfo) {
      var _this2 = this;

      return this._settingsModel.getSingle("directories", "Movies").then(function (destSetting) {
        return _this2._filesModel.addFile(destSetting.id, destInfo.subpath, destInfo.filename, "movie");
      }).then(function (fileRow) {
        return _this2._fileToMovieModel.add(fileRow.id, movie.id);
      });
    }
  }, {
    key: "idAndArchiveEpisode",
    value: function idAndArchiveEpisode(epInfo, sourceInfo, destInfo) {
      var _this3 = this;

      return this._filesystemModel.moveInSetDir(sourceInfo, destInfo, "Shows").then(function () {
        return _this3._settingsModel.getSingle("directories", "Shows");
      }).then(function (destSetting) {
        return _this3._filesModel.addFile(destSetting.id, destInfo.subpath, destInfo.filename, "show");
      }).then(function (fileRow) {
        return _this3._fileToEpisodeModel.add(fileRow.id, epInfo.show_id, epInfo.season_id, epInfo.episode_id);
      });
    }
  }, {
    key: "idAndArchiveMultipleEpisodes",
    value: function idAndArchiveMultipleEpisodes(sourcePathInfo, destSubpath, idInfo) {
      var _this4 = this;

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
        promisesToRun.push(_this4.idAndArchiveEpisode(epInfo, source, dest));
      });
      return Promise.all(promisesToRun);
    }
  }, {
    key: "removeMultipleIDs",
    value: function removeMultipleIDs(itemsToRemove) {
      var _this5 = this;

      var promisesToRun = [];
      itemsToRemove.forEach(function (item) {
        promisesToRun.push(_this5.removeSingleID(item.assocData));
      });
      return Promise.all(promisesToRun);
    }
  }, {
    key: "removeSingleID",
    value: function removeSingleID(idInfo) {
      if (idInfo.type === "movie") {
        return this._removeMovie(idInfo);
      } else if (idInfo.type === "show") {
        return this._removeEpisodeFileAssociations(idInfo);
      }
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
      var _this6 = this;

      return this._filesModel.deleteSingle(idInfo.file_id).then(function () {
        return _this6._fileToMovieModel.deleteSingle(idInfo.file_id, idInfo.movie_id);
      }).then(function () {
        return _this6._moviesModel.deleteSingle(idInfo.movie_id);
      });
    }
    /**
     * Remove the file and file-to-episode associating for a show episode.
     *
     * This does not remove the show as Shows are not directly tied to episodes.
     *
     * @param object idInfo
     */

  }, {
    key: "_removeEpisodeFileAssociations",
    value: function _removeEpisodeFileAssociations(idInfo) {
      var _this7 = this;

      return this._filesModel.deleteSingle(idInfo.file_id).then(function () {
        return _this7._fileToEpisodeModel.deleteSingle(idInfo.file_id, idInfo.episode_id);
      });
    }
  }, {
    key: "addShow",
    value: function addShow(showInfo, imageInfo) {
      var _this8 = this;

      var imageFilename = this._buildThumbFilename(showInfo);

      return this._mediaScraperModel.downloadThumbnail("shows", imageInfo.url, imageFilename).then(function (imageFilename) {
        return _this8._showsModel.addShow(showInfo, imageFilename);
      }).then(function (show) {
        return _this8._scrapeAndAddSeasonsForShow(show);
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
      var _this9 = this;

      return this._mediaScraperModel.getShowSeasonsList(show.trakt_id).then(function (seasons) {
        return _this9._showSeasonsModel.addArrayOfSeasons(seasons, show.id);
      }).then(function (addedSeasons) {
        return _this9._scrapeAndAddEpisodesForSeasons(show, addedSeasons);
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
      var _this10 = this;

      var promisesToRun = [];
      seasons.forEach(function (season) {
        var prom = _this10._mediaScraperModel.getEpisodesForSeason(show.trakt_id, season.season_number).then(function (episodesArr) {
          return _this10._showSeasonEpisodesModel.addArrEpisodes(show.id, season.id, episodesArr);
        });

        promisesToRun.push(prom);
      });
      return Promise.all(promisesToRun);
    }
  }]);

  return IDModel;
}();

exports["default"] = IDModel;