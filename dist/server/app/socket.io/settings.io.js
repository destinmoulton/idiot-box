'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = settingsIOListeners;

var _error = require('../error');

var _error2 = _interopRequireDefault(_error);

var _IBDB = require('../db/IBDB');

var _IBDB2 = _interopRequireDefault(_IBDB);

var _io = require('./io');

var _io2 = _interopRequireDefault(_io);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _SettingsModel = require('../db/SettingsModel');

var _SettingsModel2 = _interopRequireDefault(_SettingsModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function settingsIOListeners(socket) {
    var settingsModel = new _SettingsModel2.default(_IBDB2.default);
    socket.on('settings.get.category', function (options) {
        settingsModel.getAllForCategory(options.category).then(function (settings) {
            socket.emit('settings.data.category', settings);
        }).catch(function (err) {
            return (0, _error2.default)(err);
        });
    });

    socket.on('settings.add.request', function (options) {
        settingsModel.addSetting(options.category, options.category, options.value).then(function () {
            socket.emit('settings.add.complete', { status: "success" });
        }).catch(function (err) {
            return (0, _error2.default)(err);
        });
    });

    socket.on('settings.update.request', function (options) {
        settingsModel.updateSetting(options.id, options.category, options.key, options.value).then(function () {
            socket.emit('settings.update.complete', { status: "success" });
        }).catch(function (err) {
            return (0, _error2.default)(err);
        });
    });
}