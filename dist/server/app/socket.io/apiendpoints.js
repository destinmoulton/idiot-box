'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _trakt = require('trakt.tv');

var _trakt2 = _interopRequireDefault(_trakt);

var _IBDB = require('../db/IBDB');

var _IBDB2 = _interopRequireDefault(_IBDB);

var _trakt3 = require('../config/trakt.config');

var _trakt4 = _interopRequireDefault(_trakt3);

var _FilesystemModel = require('../models/FilesystemModel');

var _FilesystemModel2 = _interopRequireDefault(_FilesystemModel);

var _IMDBScraperModel = require('../models/IMDBScraperModel');

var _IMDBScraperModel2 = _interopRequireDefault(_IMDBScraperModel);

var _MediaScraperModel = require('../models/MediaScraperModel');

var _MediaScraperModel2 = _interopRequireDefault(_MediaScraperModel);

var _SettingsModel = require('../models/db/SettingsModel');

var _SettingsModel2 = _interopRequireDefault(_SettingsModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var filesystemModel = new _FilesystemModel2.default();
var imdbScraperModel = new _IMDBScraperModel2.default();
var mediaScraperModel = new _MediaScraperModel2.default(new _trakt2.default(_trakt4.default));
var settingsModel = new _SettingsModel2.default(_IBDB2.default);

exports.default = {
    filesystem: {
        dir: {
            get: {
                params: ['path'],
                func: function func(pathToList) {
                    return filesystemModel.getDirList(pathToList);
                }
            }
        }
    },
    imdb: {
        image: {
            get: {
                params: ['imdb_id'],
                func: function func(imdbID) {
                    return imdbScraperModel.getPosterURL(imdbID);
                }
            }
        }
    },
    mediascraper: {
        movies: {
            search: {
                params: ['search_string'],
                func: function func(searchString) {
                    return mediaScraperModel.searchMovies(searchString);
                }
            }
        }
    },
    settings: {
        category: {
            get: {
                params: ['category'],
                func: function func(category) {
                    return settingsModel.getAllForCategory(category);
                }
            }
        },
        editor: {
            add: {
                params: ['category', 'key', 'value'],
                func: function func(category, key, value) {
                    return settingsModel.addSetting(category, key, value);
                }
            },
            update: {
                params: ['id', 'category', 'key', 'value'],
                func: function func(id, category, key, value) {
                    return settingsModel.updateSetting(id, category, key, value);
                }
            },
            delete: {
                params: ['id'],
                func: function func(id) {
                    return settingsModel.deleteSetting(id);
                }
            }
        }
    }

};