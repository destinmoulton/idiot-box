'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _filesystem = require('./filesystem.api');

var _filesystem2 = _interopRequireDefault(_filesystem);

var _id = require('./id.api');

var _id2 = _interopRequireDefault(_id);

var _imdb = require('./imdb.api');

var _imdb2 = _interopRequireDefault(_imdb);

var _mediascraper = require('./mediascraper.api');

var _mediascraper2 = _interopRequireDefault(_mediascraper);

var _movies = require('./movies.api');

var _movies2 = _interopRequireDefault(_movies);

var _settings = require('./settings.api');

var _settings2 = _interopRequireDefault(_settings);

var _shows = require('./shows.api');

var _shows2 = _interopRequireDefault(_shows);

var _videoplayer = require('./videoplayer.api');

var _videoplayer2 = _interopRequireDefault(_videoplayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var endpoints = {
    filesystem: _filesystem2.default,
    id: _id2.default,
    imdb: _imdb2.default,
    mediascraper: _mediascraper2.default,
    movies: _movies2.default,
    settings: _settings2.default,
    shows: _shows2.default,
    videoplayer: _videoplayer2.default
};

exports.default = endpoints;