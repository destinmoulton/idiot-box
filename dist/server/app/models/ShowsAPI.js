'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _thumbnails = require('../config/thumbnails.config');

var _thumbnails2 = _interopRequireDefault(_thumbnails);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShowsAPI = function () {
    function ShowsAPI(models) {
        _classCallCheck(this, ShowsAPI);

        this._filesModel = models.filesModel;
        this._fileToEpisodeModel = models.fileToEpisodeModel;
        this._showsModel = models.showsModel;
        this._showSeasonEpisodesModel = models.showSeasonEpisodesModel;
        this._showSeasonsModel = models.showSeasonsModel;
    }

    _createClass(ShowsAPI, [{
        key: 'getAllShowsWithSeasonLockedInfo',
        value: function getAllShowsWithSeasonLockedInfo() {
            var _this = this;

            return this._showsModel.getAll().then(function (shows) {
                var showsToReturn = [];
                var promisesToRun = [];
                shows.forEach(function (show) {
                    var cmd = _this._getSeasonLockedInfo(show);
                    promisesToRun.push(cmd);
                });
                return Promise.all(promisesToRun);
            });
        }
    }, {
        key: '_getSeasonLockedInfo',
        value: function _getSeasonLockedInfo(show) {
            return this._showSeasonsModel.getSeasonsForShow(show.id).then(function (seasons) {
                var newShow = Object.assign({}, show);

                var countLocked = 0;
                var countUnLocked = 0;
                seasons.forEach(function (season) {
                    if (season.locked === 1) {
                        countLocked++;
                    } else {
                        countUnLocked++;
                    }
                });

                newShow['num_seasons_locked'] = countLocked;
                newShow['num_seasons_unlocked'] = countUnLocked;
                return Promise.resolve(newShow);
            });
        }
    }, {
        key: 'deleteSingleShow',
        value: function deleteSingleShow(showID) {
            var _this2 = this;

            return this._removeEpisodes(showID).then(function () {
                return _this2._showSeasonsModel.deleteAllForShow(showID);
            }).then(function () {
                return _this2._removeShowThumbnail(showID);
            }).then(function () {
                return _this2._showsModel.deleteSingle(showID);
            });
        }
    }, {
        key: '_removeShowThumbnail',
        value: function _removeShowThumbnail(showID) {
            return this._showsModel.getSingle(showID).then(function (show) {
                var fullPath = _path2.default.join(_thumbnails2.default.shows, show.image_filename);
                if (!_fs2.default.existsSync(fullPath)) {
                    return Promise.resolve(true);
                }
                return Promise.resolve(_fs2.default.unlinkSync(fullPath));
            });
        }
    }, {
        key: '_removeEpisodes',
        value: function _removeEpisodes(showID) {
            var _this3 = this;

            return this._showSeasonEpisodesModel.getEpisodesForShow(showID).then(function (episodes) {
                var promisesToRun = [];

                episodes.forEach(function (episode) {
                    var cmd = _this3._removeFileAssociations(episode.id);
                    promisesToRun.push(cmd);
                });
                Promise.all(promisesToRun);
            }).then(function () {
                return _this3._showSeasonEpisodesModel.deleteAllForShow(showID);
            });
        }
    }, {
        key: '_removeFileAssociations',
        value: function _removeFileAssociations(episodeID) {
            var _this4 = this;

            return this._fileToEpisodeModel.getSingleForEpisode(episodeID).then(function (fileToEpisode) {
                return _this4._filesModel.deleteSingle(fileToEpisode.file_id).then(function () {
                    return _this4._fileToEpisodeModel.deleteSingle(fileToEpisode.file_id, episodeID);
                });
            });
        }
    }]);

    return ShowsAPI;
}();

exports.default = ShowsAPI;