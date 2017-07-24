"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FileToEpisodeModel = function () {
    function FileToEpisodeModel(ibdb) {
        _classCallCheck(this, FileToEpisodeModel);

        this._ibdb = ibdb;
        this._tableName = "file_to_episode";
    }

    _createClass(FileToEpisodeModel, [{
        key: "add",
        value: function add(fileID, showID, seasonID, episodeID) {
            var _this = this;

            return this.getSingleForEpisode(episodeID).then(function (row) {
                if ('file_id' in row) {
                    return row;
                }
                var data = {
                    file_id: fileID,
                    show_id: showID,
                    season_id: seasonID,
                    episode_id: episodeID
                };

                return _this._ibdb.insert(data, _this._tableName);
            }).then(function () {
                return _this.getSingle(fileID, showID, seasonID, episodeID);
            });
        }
    }, {
        key: "getSingle",
        value: function getSingle(fileID, showID, seasonID, episodeID) {
            var where = {
                file_id: fileID,
                show_id: showID,
                season_id: seasonID,
                episode_id: episodeID
            };
            return this._ibdb.getRow(where, this._tableName);
        }
    }, {
        key: "getSingleForEpisode",
        value: function getSingleForEpisode(episodeID) {
            var where = {
                episode_id: episodeID
            };
            return this._ibdb.getRow(where, this._tableName);
        }
    }, {
        key: "getSingleForFile",
        value: function getSingleForFile(fileID) {
            var where = {
                file_id: fileID
            };
            return this._ibdb.getRow(where, this._tableName);
        }
    }]);

    return FileToEpisodeModel;
}();

exports.default = FileToEpisodeModel;