'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _IMDBScraperModel = require('../models/IMDBScraperModel');

var _IMDBScraperModel2 = _interopRequireDefault(_IMDBScraperModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var imdbScraperModel = new _IMDBScraperModel2.default();

exports.default = imdb = {
    image: {
        get: {
            params: ['imdb_id'],
            func: function func(imdbID) {
                return imdbScraperModel.getPosterURL(imdbID);
            }
        }
    }
};