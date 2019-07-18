"use strict";

var _trakt = _interopRequireDefault(require("trakt.tv"));

var _IBDB = _interopRequireDefault(require("../db/IBDB"));

var _FilesModel = _interopRequireDefault(require("../models/db/FilesModel"));

var _FileToEpisodeModel = _interopRequireDefault(require("../models/db/FileToEpisodeModel"));

var _MediaScraperModel = _interopRequireDefault(require("../models/MediaScraperModel"));

var _SettingsModel = _interopRequireDefault(require("../models/db/SettingsModel"));

var _ShowsModel = _interopRequireDefault(require("../models/db/ShowsModel"));

var _ShowSeasonsModel = _interopRequireDefault(require("../models/db/ShowSeasonsModel"));

var _ShowSeasonEpisodesModel = _interopRequireDefault(require("../models/db/ShowSeasonEpisodesModel"));

var _db = _interopRequireDefault(require("../config/db.config"));

var _thumbnails = _interopRequireDefault(require("../config/thumbnails.config"));

var _trakt2 = _interopRequireDefault(require("../config/trakt.config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var settingsModel = new _SettingsModel["default"](_IBDB["default"]);
var filesModel = new _FilesModel["default"](_IBDB["default"]);
var fileToEpisodeModel = new _FileToEpisodeModel["default"](_IBDB["default"]);
var mediaScraperModel = new _MediaScraperModel["default"](new _trakt["default"](_trakt2["default"]), settingsModel);
var showsModel = new _ShowsModel["default"](_IBDB["default"]);
var showSeasonsModel = new _ShowSeasonsModel["default"](_IBDB["default"]);
var showSeasonEpisodesModel = new _ShowSeasonEpisodesModel["default"](_IBDB["default"]);
Promise.resolve().then(function () {
  return _IBDB["default"].connect(_db["default"]);
}).then(function () {
  return compareShows();
})["catch"](function (err) {
  return console.error(err);
});

function compareShows() {
  return showsModel.getAll().then(function (shows) {
    var promisesToRun = [];
    shows.forEach(function (show) {
      var cmd = compareSeasons(show.id, show.trakt_id);
      promisesToRun.push(cmd);
    });
    Promise.all(promisesToRun);
  });
}

function compareSeasons(showID, showTraktID) {
  return mediaScraperModel.getShowSeasonsList(showTraktID).then(function (traktSeasons) {
    var promisesToRun = [];
    traktSeasons.forEach(function (traktSeason) {
      var cmd = processSeason(traktSeason, showID, showTraktID);
      promisesToRun.push(cmd);
    });
    return Promise.all(promisesToRun);
  });
}

function processSeason(traktSeason, showID, showTraktID) {
  return showSeasonsModel.getSingleByTraktID(traktSeason.ids.trakt).then(function (showSeason) {
    if (!showSeason.hasOwnProperty('id')) {
      // Add the season
      return showSeasonsModel.addShowSeason(showID, traktSeason);
    }

    return Promise.resolve(showSeason);
  }).then(function (showSeason) {
    if (showSeason.locked !== 1) {
      return compareEpisodes(showID, showSeason.id, showTraktID, showSeason.season_number);
    }

    return Promise.resolve(true);
  });
}

function compareEpisodes(showID, seasonID, showTraktID, seasonNum) {
  return mediaScraperModel.getEpisodesForSeason(showTraktID, seasonNum).then(function (traktEpisodes) {
    var promisesToRun = [];
    traktEpisodes.forEach(function (traktEpisode) {
      var cmd = processEpisode(showID, seasonID, traktEpisode);
      promisesToRun.push(cmd);
    });
    return Promise.all(promisesToRun);
  });
}

function processEpisode(showID, seasonID, traktEpisode) {
  return showSeasonEpisodesModel.getSingleByTraktID(traktEpisode.ids.trakt).then(function (seasonEpisode) {
    if (!seasonEpisode.hasOwnProperty('id')) {
      // Add the episode
      return showSeasonEpisodesModel.addEpisode(showID, seasonID, traktEpisode);
    } else {
      return showSeasonEpisodesModel.updateEpisode(showID, seasonID, seasonEpisode.id, traktEpisode);
    }
  });
}