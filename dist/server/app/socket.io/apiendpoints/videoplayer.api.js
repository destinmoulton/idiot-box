'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _nodeOmxplayer = require('node-omxplayer');

var _nodeOmxplayer2 = _interopRequireDefault(_nodeOmxplayer);

var _VideoPlayerModel = require('../../models/VideoPlayerModel');

var _VideoPlayerModel2 = _interopRequireDefault(_VideoPlayerModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var videoPlayerModel = new _VideoPlayerModel2.default(new _nodeOmxplayer2.default(), 'hdmi');

var videoplayer = {
    cmd: {
        start: {
            params: ['path', 'filename'],
            func: function func(path, filename) {
                return videoPlayerModel.start(path, filename);
            }
        },
        close: {
            params: [],
            func: function func() {
                return videoPlayerModel.close();
            }
        },
        isRunning: {
            params: [],
            func: function func() {
                return videoPlayerModel.isRunning();
            }
        },
        play: {
            params: [],
            func: function func() {
                return videoPlayerModel.play();
            }
        },
        pause: {
            params: [],
            func: function func() {
                return videoPlayerModel.pause();
            }
        },
        fastFwd: {
            params: [],
            func: function func() {
                return videoPlayerModel.fastFwd();
            }
        },
        rewind: {
            params: [],
            func: function func() {
                return videoPlayerModel.rewind();
            }
        },
        fwd30: {
            params: [],
            func: function func() {
                return videoPlayerModel.fwd30();
            }
        },
        back30: {
            params: [],
            func: function func() {
                return videoPlayerModel.back30();
            }
        },
        toggleSubtitles: {
            params: [],
            func: function func() {
                return videoPlayerModel.toggleSubtitle();
            }
        }
    }
};

exports.default = videoplayer;