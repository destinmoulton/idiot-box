'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _sqlite = require('sqlite');

var _sqlite2 = _interopRequireDefault(_sqlite);

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

var settingsModel = new _SettingsModel2.default(_IBDB2.default); // Convert shows from Gaze to Idiot Box

var filesModel = new _FilesModel2.default(_IBDB2.default);
var fileToEpisodeModel = new _FileToEpisodeModel2.default(_IBDB2.default);
var mediaScraperModel = new _MediaScraperModel2.default(new _trakt2.default(_trakt4.default), settingsModel);
var showsModel = new _ShowsModel2.default(_IBDB2.default);
var showSeasonsModel = new _ShowSeasonsModel2.default(_IBDB2.default);
var showSeasonEpisodesModel = new _ShowSeasonEpisodesModel2.default(_IBDB2.default);

var gaze = {};

var gazeShowPosterPath = "/home/destin/Downloads/show_posters";
var gazePath = "/home/destin/Downloads/djanggazedb.sqlite3";

Promise.resolve().then(function () {
    return connectToDBs();
}).then(function () {
    return processShows();
    //return collateGazeFileDetails(918431)
})
//    .then((row)=>{
//console.log(row);
//})
.catch(function (err) {
    return console.log(err);
});

function connectToDBs() {
    return _IBDB2.default.connect(_db2.default).then(function () {
        return _sqlite2.default.open(gazePath);
    }).then(function (newDB) {
        gaze = newDB;
        return Promise.resolve(true);
    });
}

function processShows() {
    return getCurrentShows().then(function (shows) {
        var promisesToRun = [];
        var count = 0;
        shows.forEach(function (show) {
            if (count < 2) {
                promisesToRun.push(addShowAndSeasonsAndEpisodes(show.trakt_id, show.poster_filename));
            }
            count++;
        });
        return Promise.all(promisesToRun);
    });
}

function getCurrentShows() {
    var whereQuery = "SELECT trakt_id, poster_filename FROM gaze_shows ORDER BY title ASC";
    return gaze.all(whereQuery).then(function (rows) {
        return rows === undefined ? [] : rows;
    });
}

function addShowAndSeasonsAndEpisodes(showTraktID, showThumbFilename) {
    return moveShowThumbnail(showThumbFilename).then(function () {
        return mediaScraperModel.getShowByTraktID(showTraktID);
    }).then(function (showInfo) {
        return showsModel.addShow(showInfo, showThumbFilename);
    }).then(function (show) {
        return mediaScraperModel.getShowSeasonsList(show.trakt_id).then(function (seasons) {
            return showSeasonsModel.addArrayOfSeasons(seasons, show.id);
        }).then(function (addedSeasons) {
            var promisesToRun = [];
            addedSeasons.forEach(function (season) {
                var prom = mediaScraperModel.getEpisodesForSeason(show.trakt_id, season.season_number).then(function (episodesArr) {
                    return showSeasonEpisodesModel.addArrEpisodes(show.id, season.id, episodesArr);
                }).then(function (arrSeasonEpisodes) {
                    return addArrayOfFileInfo(arrSeasonEpisodes);
                });
                promisesToRun.push(prom);
            });
            return Promise.all(promisesToRun);
        });
    });
}

function addArrayOfFileInfo(arrSeasEpisodes) {
    var promisesToRun = [];
    arrSeasEpisodes.forEach(function (seasEp) {
        promisesToRun.push(addSingleFileInfo(seasEp));
    });
    return Promise.all(promisesToRun);
}

function addSingleFileInfo(epInfo) {
    return collateGazeFileDetails(epInfo.trakt_id).then(function (fileInfo) {
        if (fileInfo === undefined) {
            return false;
        }
        return filesModel.addFile(3, fileInfo.subpath, fileInfo.filename, "show");
    }).then(function (fileRow) {
        return fileToEpisodeModel.add(fileRow.id, epInfo.show_id, epInfo.season_id, epInfo.id);
    });
}

function collateGazeFileDetails(traktID) {
    return getGazeEpisodeByTraktID(traktID).then(function (episode) {
        if (episode === undefined) {
            return undefined;
        }
        return getGazeEpisodeFileByEpisodeID(episode.id);
    }).then(function (fileEpisodeInfo) {
        if (fileEpisodeInfo === undefined) {
            return undefined;
        }

        return getGazeFileDetails(fileEpisodeInfo.mediafile_id);
    });
}

function getGazeEpisodeByTraktID(traktID) {
    var whereQuery = "SELECT * FROM gaze_showseasonepisode WHERE trakt_id = ?";
    return gaze.get(whereQuery, traktID);
}

function getGazeEpisodeFileByEpisodeID(episodeID) {
    var whereQuery = "SELECT * FROM gaze_mediafileepisodeinfo WHERE showseasonepisode_id = ?";
    return gaze.get(whereQuery, episodeID);
}

function getGazeFileDetails(fileID) {
    var whereQuery = "SELECT * FROM gaze_mediafile WHERE id = ?";
    return gaze.get(whereQuery, fileID);
}

function moveShowThumbnail(filename) {
    var sourcePath = _path2.default.join(gazeShowPosterPath, filename);
    var destPath = _path2.default.join(_thumbnails2.default.shows, filename);
    _fsExtra2.default.copySync(sourcePath, destPath);
    return Promise.resolve(filename);
}