'use strict';

var _trakt = require('trakt.tv');

var _trakt2 = _interopRequireDefault(_trakt);

var _IBDB = require('../db/IBDB');

var _IBDB2 = _interopRequireDefault(_IBDB);

var _FilesModel = require('../models/db/FilesModel');

var _FilesModel2 = _interopRequireDefault(_FilesModel);

var _FileToEpisodeModel = require('../models/db/FileToEpisodeModel');

var _FileToEpisodeModel2 = _interopRequireDefault(_FileToEpisodeModel);

var _MediaScraperModel = require('../models/MediaScraperModel');

var _MediaScraperModel2 = _interopRequireDefault(_MediaScraperModel);

var _SettingsModel = require('../models/db/SettingsModel');

var _SettingsModel2 = _interopRequireDefault(_SettingsModel);

var _ShowsModel = require('../models/db/ShowsModel');

var _ShowsModel2 = _interopRequireDefault(_ShowsModel);

var _ShowSeasonsModel = require('../models/db/ShowSeasonsModel');

var _ShowSeasonsModel2 = _interopRequireDefault(_ShowSeasonsModel);

var _ShowSeasonEpisodesModel = require('../models/db/ShowSeasonEpisodesModel');

var _ShowSeasonEpisodesModel2 = _interopRequireDefault(_ShowSeasonEpisodesModel);

var _db = require('../config/db.config');

var _db2 = _interopRequireDefault(_db);

var _thumbnails = require('../config/thumbnails.config');

var _thumbnails2 = _interopRequireDefault(_thumbnails);

var _trakt3 = require('../config/trakt.config');

var _trakt4 = _interopRequireDefault(_trakt3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var settingsModel = new _SettingsModel2.default(_IBDB2.default);
var filesModel = new _FilesModel2.default(_IBDB2.default);
var fileToEpisodeModel = new _FileToEpisodeModel2.default(_IBDB2.default);
var mediaScraperModel = new _MediaScraperModel2.default(new _trakt2.default(_trakt4.default), settingsModel);
var showsModel = new _ShowsModel2.default(_IBDB2.default);
var showSeasonsModel = new _ShowSeasonsModel2.default(_IBDB2.default);
var showSeasonEpisodesModel = new _ShowSeasonEpisodesModel2.default(_IBDB2.default);

Promise.resolve().then(function () {
    return _IBDB2.default.connect(_db2.default);
}).then(function () {
    return compareShows();
}).catch(function (err) {
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