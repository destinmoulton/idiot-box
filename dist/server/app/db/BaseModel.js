"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _databaseConnection = require("./databaseConnection");

var _databaseConnection2 = _interopRequireDefault(_databaseConnection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseModel = function () {
    function BaseModel(db) {
        _classCallCheck(this, BaseModel);

        this._db = db;
        this._tableName = "";
    }

    _createClass(BaseModel, [{
        key: "_isConfigured",
        value: function _isConfigured() {
            if (this._tableName === "") {
                error("DatabaseModel :: Table is not configured.");
                return false;
            }
        }
    }, {
        key: "setTableName",
        value: function setTableName(newTableName) {
            this._tableName = newTableName;
        }
    }]);

    return BaseModel;
}();

exports.default = BaseModel;