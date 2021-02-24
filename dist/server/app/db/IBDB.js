"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.IBDB = void 0;
var fs_1 = __importDefault(require("fs"));
var lodash_1 = __importDefault(require("lodash"));
var sqlite_1 = require("sqlite");
var sqlite3_1 = __importDefault(require("sqlite3"));
var error_1 = __importDefault(require("../error"));
var IBDB = /** @class */ (function () {
    function IBDB() {
        this._db = null;
        this._isConnected = false;
        this._paramCount = 0;
    }
    IBDB.prototype.connect = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var filename, _a, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        filename = "";
                        if (lodash_1["default"].has(config, "paths.db.sqlite")) {
                            if (!fs_1["default"].existsSync(config.paths.db.sqlite)) {
                                error_1["default"]("IBDB :: connect :: File does not exist.");
                                throw new Error("IBDB :: connect :: File does not exist. " + config.paths.db.sqlite);
                            }
                            filename = config.paths.db.sqlite;
                        }
                        else {
                            throw new Error("IBDB :: connect :: No filename config is set.");
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, sqlite_1.open({
                                filename: filename,
                                driver: sqlite3_1["default"].Database
                            })];
                    case 2:
                        _a._db = _b.sent();
                        this._isConnected = true;
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _b.sent();
                        throw new Error("IBDB :: connect :: sqlite error " + err_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    IBDB.prototype.isConnected = function () {
        return this._isConnected;
    };
    IBDB.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._isConnected) return [3 /*break*/, 2];
                        this._isConnected = false;
                        return [4 /*yield*/, this._db.close()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    IBDB.prototype.insert = function (columnsAndValues, tablename) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, columns, params, insertColumns, insertValueVariables, query, res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this._resetParamCount();
                        _a = this._getColumnsAndParams(columnsAndValues), columns = _a[0], params = _a[1];
                        insertColumns = columns.join(", ");
                        insertValueVariables = Object.keys(params).join(",");
                        query = "INSERT INTO " +
                            tablename +
                            " (" +
                            insertColumns +
                            ") VALUES (" +
                            insertValueVariables +
                            ")";
                        return [4 /*yield*/, this._db.run(query, params)];
                    case 1:
                        res = _b.sent();
                        return [2 /*return*/, res.lastID];
                }
            });
        });
    };
    IBDB.prototype.update = function (dataColumnsAndValues, whereColumnsAndValues, tablename) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, dataDelim, dataParams, _b, whereDelim, whereParams, update, params, res;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this._resetParamCount();
                        _a = this._buildCommaDelimetedStatement(dataColumnsAndValues), dataDelim = _a[0], dataParams = _a[1];
                        _b = this._buildCommaDelimetedStatement(whereColumnsAndValues, " AND "), whereDelim = _b[0], whereParams = _b[1];
                        update = "UPDATE " +
                            tablename +
                            " SET " +
                            dataDelim +
                            " WHERE " +
                            whereDelim;
                        params = Object.assign({}, dataParams, whereParams);
                        return [4 /*yield*/, this._db.run(update, params)];
                    case 1:
                        res = _c.sent();
                        return [2 /*return*/, res.changes];
                }
            });
        });
    };
    IBDB.prototype["delete"] = function (whereColumnsAndValues, tablename) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, whereDelim, whereParams, update;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this._resetParamCount();
                        _a = this._buildCommaDelimetedStatement(whereColumnsAndValues, " AND "), whereDelim = _a[0], whereParams = _a[1];
                        update = "DELETE FROM " + tablename + " WHERE " + whereDelim;
                        return [4 /*yield*/, this._db.run(update, whereParams)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    IBDB.prototype.getRow = function (whereColumnsAndValues, tablename) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, query, params, row;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this._resetParamCount();
                        _a = this._buildSelectQuery(whereColumnsAndValues, tablename), query = _a[0], params = _a[1];
                        return [4 /*yield*/, this._db.get(query, params)];
                    case 1:
                        row = _b.sent();
                        return [2 /*return*/, row === undefined ? {} : row];
                }
            });
        });
    };
    IBDB.prototype.getAll = function (whereColumnsAndValues, tablename, orderBy) {
        if (orderBy === void 0) { orderBy = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, query, params, rows;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this._resetParamCount();
                        _a = this._buildSelectQuery(whereColumnsAndValues, tablename), query = _a[0], params = _a[1];
                        if (orderBy !== "") {
                            query = query + " ORDER BY " + orderBy;
                        }
                        return [4 /*yield*/, this._db.all(query, params)];
                    case 1:
                        rows = _b.sent();
                        return [2 /*return*/, rows === undefined ? [] : rows];
                }
            });
        });
    };
    IBDB.prototype.queryAll = function (sql, params) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._db.all(sql, params)];
                    case 1:
                        rows = _a.sent();
                        return [2 /*return*/, rows === undefined ? [] : rows];
                }
            });
        });
    };
    IBDB.prototype._buildSelectQuery = function (whereColumnsAndValues, tablename) {
        var _a = this._buildCommaDelimetedStatement(whereColumnsAndValues, " AND "), where = _a[0], params = _a[1];
        var query = "SELECT * FROM " + tablename;
        if (where !== "") {
            query = query + " WHERE " + where;
        }
        return [query, params];
    };
    // Build a comma delimited equals string (ie for where: "key = $var AND key1 = $var")
    IBDB.prototype._buildCommaDelimetedStatement = function (whereColumnsAndValues, separator) {
        if (separator === void 0) { separator = ", "; }
        var _a = this._getColumnsAndParams(whereColumnsAndValues), columns = _a[0], params = _a[1], paramKeys = _a[2];
        var whereParts = [];
        columns.forEach(function (columnName, index) {
            whereParts.push(columnName + " = " + paramKeys[index]);
        });
        var where = whereParts.join(separator);
        return [where, params];
    };
    IBDB.prototype._getColumnsAndParams = function (columnsAndValues) {
        var _this = this;
        var columns = Object.keys(columnsAndValues);
        var params = {};
        var paramKeys = [];
        columns.forEach(function (columnName) {
            _this._paramCount++;
            var key = "$" + columnName + _this._paramCount;
            paramKeys.push(key);
            params[key] = columnsAndValues[columnName];
        });
        return [columns, params, paramKeys];
    };
    IBDB.prototype._resetParamCount = function () {
        this._paramCount = 0;
    };
    return IBDB;
}());
exports.IBDB = IBDB;
var ibdb = new IBDB();
exports["default"] = ibdb;
//# sourceMappingURL=IBDB.js.map