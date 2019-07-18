"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _IBDB = _interopRequireDefault(require("../../db/IBDB"));

var _SettingsModel = _interopRequireDefault(require("../../models/db/SettingsModel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var settingsModel = new _SettingsModel["default"](_IBDB["default"]);
var settings = {
  all: {
    get: {
      params: [],
      func: function func() {
        return settingsModel.getAll();
      }
    }
  },
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
    "delete": {
      params: ['id'],
      func: function func(id) {
        return settingsModel.deleteSetting(id);
      }
    }
  }
};
var _default = settings;
exports["default"] = _default;