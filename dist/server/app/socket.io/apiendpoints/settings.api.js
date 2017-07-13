'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _IBDB = require('../../db/IBDB');

var _IBDB2 = _interopRequireDefault(_IBDB);

var _SettingsModel = require('../../models/db/SettingsModel');

var _SettingsModel2 = _interopRequireDefault(_SettingsModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var settingsModel = new _SettingsModel2.default(_IBDB2.default);

exports.default = settings = {
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
};