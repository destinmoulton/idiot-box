"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _logger = require("../logger");

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EpisodeAPI = function () {
    function EpisodeAPI(models) {
        _classCallCheck(this, EpisodeAPI);

        this._showSeasonEpisodesModel = models.showSeasonEpisodesModel;
        this._filesModel = models.filesModel;
        this._fileToEpisodeModel = models.fileToEpisodeModel;
    }

    _createClass(EpisodeAPI, [{
        key: "getAllEpisodesWithFileInfo",
        value: function getAllEpisodesWithFileInfo(showID, seasonNum) {
            var _this = this;

            return this._showSeasonEpisodesModel.getEpisodesForSeasonNum(showID, seasonNum).then(function (episodes) {
                var promisesToRun = [];

                episodes.forEach(function (ep) {
                    var data = Object.assign({}, ep);
                    data["file_info"] = {};

                    var cmd = _this._fileToEpisodeModel.getSingleForEpisode(ep.id).then(function (fileEp) {
                        if (!fileEp.hasOwnProperty("file_id")) {
                            return Promise.resolve(data);
                        }

                        return _this._collectFileInfo(fileEp, data);
                    });
                    promisesToRun.push(cmd);
                });

                return Promise.all(promisesToRun);
            });
        }

        /**
         * Add File info to the episode object if it exists.
         *
         * @param FileToEpisode fileEp
         * @param ShowSeasonEpisode episode
         */

    }, {
        key: "_collectFileInfo",
        value: function _collectFileInfo(fileEp, episode) {
            return this._filesModel.getSingle(fileEp.file_id).then(function (file) {
                if (!file.hasOwnProperty("id")) {
                    return Promise.resolve(episode);
                }
                episode.file_info = file;
                return Promise.resolve(episode);
            });
        }
    }]);

    return EpisodeAPI;
}();

exports.default = EpisodeAPI;