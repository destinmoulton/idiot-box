'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var emitter = new _events2.default();

emitter.on('uncaughtException', function (err) {
    _logger2.default.error(err);
});

exports.default = emitter;