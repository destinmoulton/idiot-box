"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _sqlite = _interopRequireDefault(require("sqlite"));

var _logger = _interopRequireDefault(require("../logger"));

var _error = _interopRequireDefault(require("../error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var IBDB =
/*#__PURE__*/
function () {
  function IBDB() {
    _classCallCheck(this, IBDB);

    this._db = {};
    this._isConnected = false;
    this._paramCount = 0;
  }

  _createClass(IBDB, [{
    key: "connect",
    value: function connect(config) {
      var _this = this;

      var filename = "";

      if (config.hasOwnProperty('filename')) {
        if (!_fs["default"].existsSync(config.filename)) {
          (0, _error["default"])("IBDB :: connect :: File does not exist.");
          return new _bluebird["default"].reject("IBDB :: connect :: File does not exist. ".concat(config.filename));
        }

        filename = config.filename;
      } else if (config.hasOwnProperty('inMemory')) {
        filename = ":memory:";
      } else {
        return new _bluebird["default"].reject("IBDB :: connect :: No filename config is set.");
      }

      return _bluebird["default"].resolve().then(function () {
        return _sqlite["default"].open(filename, {
          Promise: _bluebird["default"]
        });
      }).then(function (newDB) {
        _this._isConnected = true;
        _this._db = newDB;
        return newDB;
      })["catch"](function (err) {
        (0, _error["default"])("IBDB :: connect :: sqlite error ".concat(err));
      });
    }
  }, {
    key: "isConnected",
    value: function isConnected() {
      return this._isConnected;
    }
  }, {
    key: "close",
    value: function close() {
      if (this._isConnected) {
        this._isConnected = false;
        return this._db.close();
      }
    }
  }, {
    key: "insert",
    value: function insert(columnsAndValues, tablename) {
      this._resetParamCount();

      var _this$_getColumnsAndP = this._getColumnsAndParams(columnsAndValues),
          _this$_getColumnsAndP2 = _slicedToArray(_this$_getColumnsAndP, 2),
          columns = _this$_getColumnsAndP2[0],
          params = _this$_getColumnsAndP2[1];

      var insertColumns = columns.join(', ');
      var insertValueVariables = Object.keys(params).join(',');
      var query = "INSERT INTO " + tablename + " (" + insertColumns + ") VALUES (" + insertValueVariables + ")";
      return this._db.run(query, params);
    }
  }, {
    key: "update",
    value: function update(dataColumnsAndValues, whereColumnsAndValues, tablename) {
      this._resetParamCount();

      var _this$_buildCommaDeli = this._buildCommaDelimetedStatement(dataColumnsAndValues),
          _this$_buildCommaDeli2 = _slicedToArray(_this$_buildCommaDeli, 2),
          dataDelim = _this$_buildCommaDeli2[0],
          dataParams = _this$_buildCommaDeli2[1];

      var _this$_buildCommaDeli3 = this._buildCommaDelimetedStatement(whereColumnsAndValues, " AND "),
          _this$_buildCommaDeli4 = _slicedToArray(_this$_buildCommaDeli3, 2),
          whereDelim = _this$_buildCommaDeli4[0],
          whereParams = _this$_buildCommaDeli4[1];

      var update = "UPDATE " + tablename + " SET " + dataDelim + " WHERE " + whereDelim;
      var params = Object.assign({}, dataParams, whereParams);
      return this._db.run(update, params);
    }
  }, {
    key: "delete",
    value: function _delete(whereColumnsAndValues, tablename) {
      this._resetParamCount();

      var _this$_buildCommaDeli5 = this._buildCommaDelimetedStatement(whereColumnsAndValues, " AND "),
          _this$_buildCommaDeli6 = _slicedToArray(_this$_buildCommaDeli5, 2),
          whereDelim = _this$_buildCommaDeli6[0],
          whereParams = _this$_buildCommaDeli6[1];

      var update = "DELETE FROM " + tablename + " WHERE " + whereDelim;
      return this._db.run(update, whereParams);
    }
  }, {
    key: "getRow",
    value: function getRow(whereColumnsAndValues, tablename) {
      this._resetParamCount();

      var _this$_buildSelectQue = this._buildSelectQuery(whereColumnsAndValues, tablename),
          _this$_buildSelectQue2 = _slicedToArray(_this$_buildSelectQue, 2),
          query = _this$_buildSelectQue2[0],
          params = _this$_buildSelectQue2[1];

      return this._db.get(query, params).then(function (row) {
        return row === undefined ? {} : row;
      });
    }
  }, {
    key: "getAll",
    value: function getAll(whereColumnsAndValues, tablename) {
      var orderBy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

      this._resetParamCount();

      var _this$_buildSelectQue3 = this._buildSelectQuery(whereColumnsAndValues, tablename),
          _this$_buildSelectQue4 = _slicedToArray(_this$_buildSelectQue3, 2),
          query = _this$_buildSelectQue4[0],
          params = _this$_buildSelectQue4[1];

      if (orderBy !== "") {
        query = query + " ORDER BY " + orderBy;
      }

      return this._db.all(query, params).then(function (rows) {
        return rows === undefined ? [] : rows;
      });
    }
  }, {
    key: "queryAll",
    value: function queryAll(sql, params) {
      return this._db.all(sql, params).then(function (rows) {
        return rows === undefined ? [] : rows;
      });
    }
  }, {
    key: "_buildSelectQuery",
    value: function _buildSelectQuery(whereColumnsAndValues, tablename) {
      var _this$_buildCommaDeli7 = this._buildCommaDelimetedStatement(whereColumnsAndValues, " AND "),
          _this$_buildCommaDeli8 = _slicedToArray(_this$_buildCommaDeli7, 2),
          where = _this$_buildCommaDeli8[0],
          params = _this$_buildCommaDeli8[1];

      var query = "SELECT * FROM " + tablename;

      if (where !== "") {
        query = query + " WHERE " + where;
      }

      return [query, params];
    } // Build a comma delimited equals string (ie for where: "key = $var AND key1 = $var")

  }, {
    key: "_buildCommaDelimetedStatement",
    value: function _buildCommaDelimetedStatement(whereColumnsAndValues) {
      var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ', ';

      var _this$_getColumnsAndP3 = this._getColumnsAndParams(whereColumnsAndValues),
          _this$_getColumnsAndP4 = _slicedToArray(_this$_getColumnsAndP3, 3),
          columns = _this$_getColumnsAndP4[0],
          params = _this$_getColumnsAndP4[1],
          paramKeys = _this$_getColumnsAndP4[2];

      var whereParts = [];
      columns.forEach(function (columnName, index) {
        whereParts.push(columnName + " = " + paramKeys[index]);
      });
      var where = whereParts.join(separator);
      return [where, params];
    }
  }, {
    key: "_getColumnsAndParams",
    value: function _getColumnsAndParams(columnsAndValues) {
      var _this2 = this;

      var columns = Object.keys(columnsAndValues);
      var params = {};
      var paramKeys = [];
      columns.forEach(function (columnName) {
        _this2._paramCount++;
        var key = "$" + columnName + _this2._paramCount;
        paramKeys.push(key);
        params[key] = columnsAndValues[columnName];
      });
      return [columns, params, paramKeys];
    }
  }, {
    key: "_resetParamCount",
    value: function _resetParamCount() {
      this._paramCount = 0;
    }
  }]);

  return IBDB;
}();

var ibdb = new IBDB();
var _default = ibdb;
exports["default"] = _default;