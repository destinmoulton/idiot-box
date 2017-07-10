'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _sqlite = require('sqlite');

var _sqlite2 = _interopRequireDefault(_sqlite);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _error = require('../error');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IBDB = function () {
    function IBDB() {
        _classCallCheck(this, IBDB);

        this._db = {};
        this._isConnected = false;
        this._paramCount = 0;
    }

    _createClass(IBDB, [{
        key: 'connect',
        value: function connect(config) {
            var _this = this;

            var filename = "";
            if (config.hasOwnProperty('filename')) {
                if (!_fs2.default.existsSync(config.filename)) {
                    (0, _error2.default)("IBDB :: connect :: File does not exist.");
                    return new _bluebird2.default.reject('IBDB :: connect :: File does not exist. ' + config.filename);
                }
                filename = config.filename;
            } else if (config.hasOwnProperty('inMemory')) {
                filename = ":memory:";
            } else {
                return new _bluebird2.default.reject("IBDB :: connect :: No filename config is set.");
            }

            return _bluebird2.default.resolve().then(function () {
                return _sqlite2.default.open(filename, { Promise: _bluebird2.default });
            }).then(function (newDB) {
                _this._isConnected = true;
                _this._db = newDB;
                return newDB;
            }).catch(function (err) {
                (0, _error2.default)('IBDB :: connect :: sqlite error ' + err);
            });
        }
    }, {
        key: 'isConnected',
        value: function isConnected() {
            return this._isConnected;
        }
    }, {
        key: 'close',
        value: function close() {
            if (this._isConnected) {
                this._isConnected = false;
                return this._db.close();
            }
        }
    }, {
        key: 'insert',
        value: function insert(columnsAndValues, tablename) {
            this._resetParamCount();

            var _getColumnsAndParams2 = this._getColumnsAndParams(columnsAndValues),
                _getColumnsAndParams3 = _slicedToArray(_getColumnsAndParams2, 2),
                columns = _getColumnsAndParams3[0],
                params = _getColumnsAndParams3[1];

            var insertColumns = columns.join(', ');
            var insertValueVariables = Object.keys(params).join(',');

            var query = "INSERT INTO " + tablename + " (" + insertColumns + ") VALUES (" + insertValueVariables + ")";
            return this._db.run(query, params);
        }
    }, {
        key: 'update',
        value: function update(dataColumnsAndValues, whereColumnsAndValues, tablename) {
            this._resetParamCount();

            var _buildCommaDelimetedS = this._buildCommaDelimetedStatement(dataColumnsAndValues),
                _buildCommaDelimetedS2 = _slicedToArray(_buildCommaDelimetedS, 2),
                dataDelim = _buildCommaDelimetedS2[0],
                dataParams = _buildCommaDelimetedS2[1];

            var _buildCommaDelimetedS3 = this._buildCommaDelimetedStatement(whereColumnsAndValues, " AND "),
                _buildCommaDelimetedS4 = _slicedToArray(_buildCommaDelimetedS3, 2),
                whereDelim = _buildCommaDelimetedS4[0],
                whereParams = _buildCommaDelimetedS4[1];

            var update = "UPDATE " + tablename + " SET " + dataDelim + " WHERE " + whereDelim;
            var params = Object.assign({}, dataParams, whereParams);

            return this._db.run(update, params);
        }
    }, {
        key: 'delete',
        value: function _delete(whereColumnsAndValues, tablename) {
            this._resetParamCount();

            var _buildCommaDelimetedS5 = this._buildCommaDelimetedStatement(whereColumnsAndValues, " AND "),
                _buildCommaDelimetedS6 = _slicedToArray(_buildCommaDelimetedS5, 2),
                whereDelim = _buildCommaDelimetedS6[0],
                whereParams = _buildCommaDelimetedS6[1];

            var update = "DELETE FROM " + tablename + " WHERE " + whereDelim;
            return this._db.run(update, whereParams);
        }
    }, {
        key: 'getRow',
        value: function getRow(whereColumnsAndValues, tablename) {
            this._resetParamCount();

            var _buildSelectQuery2 = this._buildSelectQuery(whereColumnsAndValues, tablename),
                _buildSelectQuery3 = _slicedToArray(_buildSelectQuery2, 2),
                query = _buildSelectQuery3[0],
                params = _buildSelectQuery3[1];

            return this._db.get(query, params).then(function (row) {
                return row === undefined ? {} : row;
            });
        }
    }, {
        key: 'getAll',
        value: function getAll(whereColumnsAndValues, tablename) {
            var orderBy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

            this._resetParamCount();

            var _buildSelectQuery4 = this._buildSelectQuery(whereColumnsAndValues, tablename),
                _buildSelectQuery5 = _slicedToArray(_buildSelectQuery4, 2),
                query = _buildSelectQuery5[0],
                params = _buildSelectQuery5[1];

            if (orderBy !== "") {
                query = query + " ORDER BY " + orderBy;
            }
            return this._db.all(query, params).then(function (rows) {
                return rows === undefined ? [] : rows;
            });
        }
    }, {
        key: '_buildSelectQuery',
        value: function _buildSelectQuery(whereColumnsAndValues, tablename) {
            var _buildCommaDelimetedS7 = this._buildCommaDelimetedStatement(whereColumnsAndValues, " AND "),
                _buildCommaDelimetedS8 = _slicedToArray(_buildCommaDelimetedS7, 2),
                where = _buildCommaDelimetedS8[0],
                params = _buildCommaDelimetedS8[1];

            var query = "SELECT * FROM " + tablename;

            if (where !== "") {
                query = query + " WHERE " + where;
            }

            return [query, params];
        }

        // Build a comma delimited equals string (ie for where: "key = $var AND key1 = $var")

    }, {
        key: '_buildCommaDelimetedStatement',
        value: function _buildCommaDelimetedStatement(whereColumnsAndValues) {
            var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ', ';

            var _getColumnsAndParams4 = this._getColumnsAndParams(whereColumnsAndValues),
                _getColumnsAndParams5 = _slicedToArray(_getColumnsAndParams4, 3),
                columns = _getColumnsAndParams5[0],
                params = _getColumnsAndParams5[1],
                paramKeys = _getColumnsAndParams5[2];

            var whereParts = [];
            columns.forEach(function (columnName, index) {
                whereParts.push(columnName + " = " + paramKeys[index]);
            });
            var where = whereParts.join(separator);
            return [where, params];
        }
    }, {
        key: '_getColumnsAndParams',
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
        key: '_resetParamCount',
        value: function _resetParamCount() {
            this._paramCount = 0;
        }
    }]);

    return IBDB;
}();

var ibdb = new IBDB();
exports.default = ibdb;