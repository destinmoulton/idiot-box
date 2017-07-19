"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VideoPlayerModel = function () {
    function VideoPlayerModel(omxPlayer, audioOutput) {
        _classCallCheck(this, VideoPlayerModel);

        this.player = {};
        this.audioOutput = "";

        this.player = omxPlayer;

        this.audioOutput = audioOutput;
    }

    _createClass(VideoPlayerModel, [{
        key: "start",
        value: function start(basePath, filename) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                var source = _path2.default.join(basePath, filename);
                _this.player.newSource(source, _this.audioOutput);
                resolve(true);
            });
        }
    }, {
        key: "close",
        value: function close() {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                _this2.player.quit();
                resolve(true);
            });
        }
    }, {
        key: "isRunning",
        value: function isRunning() {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                resolve(_this3.player.running);
            });
        }
    }, {
        key: "play",
        value: function play() {
            var _this4 = this;

            return new Promise(function (resolve, reject) {
                _this4.player.play();
                resolve(true);
            });
        }
    }, {
        key: "pause",
        value: function pause() {
            var _this5 = this;

            return new Promise(function (resolve, reject) {
                _this5.player.pause();
                resolve(true);
            });
        }
    }, {
        key: "fastFwd",
        value: function fastFwd() {
            var _this6 = this;

            return new Promise(function (resolve, reject) {
                _this6.player.fastFwd();
                resolve(true);
            });
        }
    }, {
        key: "rewind",
        value: function rewind() {
            var _this7 = this;

            return new Promise(function (resolve, reject) {
                _this7.player.rewind();
                resolve(true);
            });
        }
    }, {
        key: "fwd30",
        value: function fwd30() {
            var _this8 = this;

            return new Promise(function (resolve, reject) {
                _this8.player.fwd30();
                resolve(true);
            });
        }
    }, {
        key: "back30",
        value: function back30() {
            var _this9 = this;

            return new Promise(function (resolve, reject) {
                _this9.player.back30();
                resolve(true);
            });
        }
    }, {
        key: "toggleSubtitles",
        value: function toggleSubtitles() {
            var _this10 = this;

            return new Promise(function (resolve, reject) {
                _this10.player.subtitles();
                resolve(true);
            });
        }
    }]);

    return VideoPlayerModel;
}();

exports.default = VideoPlayerModel;