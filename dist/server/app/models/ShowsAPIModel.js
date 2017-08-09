'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShowsAPIModel = function () {
    function ShowsAPIModel(models) {
        _classCallCheck(this, ShowsAPIModel);

        this._showsModel = models.showsModel;
        this._showSeasonsModel = models.showSeasonsModel;
    }

    _createClass(ShowsAPIModel, [{
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
    }]);

    return ShowsAPIModel;
}();

exports.default = ShowsAPIModel;