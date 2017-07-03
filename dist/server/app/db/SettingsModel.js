"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SettingsModel = function () {
    function SettingsModel(db) {
        _classCallCheck(this, SettingsModel);

        this._ibdb = db;
        this._tableName = "settings";
    }

    _createClass(SettingsModel, [{
        key: "addSetting",
        value: function addSetting(category, key, value) {
            var data = {
                category: category, key: key, value: value
            };

            this._ibdb.insert(data, this._tableName);
        }
    }, {
        key: "updateSetting",
        value: function updateSetting(id, category, key, value) {
            var where = {
                id: id
            };

            var data = {
                category: category, key: key, value: value
            };

            this._ibdb.update(where, data, this._tableName);
        }
    }, {
        key: "deleteSetting",
        value: function deleteSetting(id) {
            var where = {
                id: id
            };

            this._ibdb.delete(where, this._tableName);
        }
    }]);

    return SettingsModel;
}();

exports.default = SettingsModel;