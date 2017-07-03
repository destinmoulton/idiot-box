'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = error;
exports.doesErrorExist = doesErrorExist;

var _eventBus = require('./eventBus');

var _eventBus2 = _interopRequireDefault(_eventBus);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var errors = [];
_eventBus2.default.on("error", function (msg) {
    errors.push(msg);
    _logger2.default.error("ERROR::" + msg);
});

function error(message) {
    errors.push(message);
    _eventBus2.default.emit("error", message);
}

function doesErrorExist(msg) {
    return errors.includes(msg);
}