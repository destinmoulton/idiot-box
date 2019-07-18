"use strict";

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _sqlite = _interopRequireDefault(require("sqlite"));

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

// Convert shows from Gaze to Idiot Box
var settingsModel = new _SettingsModel["default"](_IBDB["default"]);
var filesModel = new _FilesModel["default"](_IBDB["default"]);
var fileToEpisodeModel = new _FileToEpisodeModel["default"](_IBDB["default"]);
var mediaScraperModel = new _MediaScraperModel["default"](new _trakt["default"](_trakt2["default"]), settingsModel);
var showsModel = new _ShowsModel["default"](_IBDB["default"]);
var showSeasonsModel = new _ShowSeasonsModel["default"](_IBDB["default"]);
var showSeasonEpisodesModel = new _ShowSeasonEpisodesModel["default"](_IBDB["default"]);
var gaze = {};
var gazeShowPosterPath = "/home/destin/Downloads/show_posters";
var gazePath = "/home/destin/Downloads/djanggazedb.sqlite3";
Promise.resolve().then(function () {
  return connectToDBs();
}).then(function () {
  return processShows(); //return collateGazeFileDetails(918431)
}) //    .then((row)=>{
//console.log(row);
//})
["catch"](function (err) {
  return console.log(err);
});

function connectToDBs() {
  return _IBDB["default"].connect(_db["default"]).then(function () {
    return _sqlite["default"].open(gazePath);
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
      //if(count < 2){
      promisesToRun.push(addShowAndSeasonsAndEpisodes(show.trakt_id, show.poster_filename)); //}

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
  var sourcePath = _path["default"].join(gazeShowPosterPath, filename);

  var destPath = _path["default"].join(_thumbnails["default"].shows, filename);

  _fsExtra["default"].copySync(sourcePath, destPath);

  return Promise.resolve(filename);
}