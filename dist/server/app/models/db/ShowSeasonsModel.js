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
var moment_1 = __importDefault(require("moment"));
var ShowSeasonsModel = /** @class */ (function () {
    function ShowSeasonsModel(ibdb) {
        this._ibdb = ibdb;
        this._tableName = "show_seasons";
    }
    ShowSeasonsModel.prototype._prepareData = function (showID, apiData) {
        return {
            show_id: showID,
            season_number: apiData.number,
            rating: apiData.rating,
            episode_count: apiData.episode_count,
            aired_episodes: apiData.aired_episodes,
            title: apiData.title,
            overview: apiData.overview,
            first_aired: moment_1["default"](apiData.first_aired).format("X"),
            trakt_id: apiData.ids.trakt,
            tvdb_id: apiData.ids.tvdb,
            tmdb_id: apiData.ids.tmdb,
            tvrage_id: apiData.ids.tvrage,
            locked: 0
        };
    };
    ShowSeasonsModel.prototype.addArrayOfSeasons = function (arrSeasons, showID) {
        return __awaiter(this, void 0, void 0, function () {
            var res, _i, arrSeasons_1, season, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        res = [];
                        _i = 0, arrSeasons_1 = arrSeasons;
                        _c.label = 1;
                    case 1:
                        if (!(_i < arrSeasons_1.length)) return [3 /*break*/, 4];
                        season = arrSeasons_1[_i];
                        _b = (_a = res).push;
                        return [4 /*yield*/, this.addShowSeason(showID, season)];
                    case 2:
                        _b.apply(_a, [_c.sent()]);
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, res];
                }
            });
        });
    };
    ShowSeasonsModel.prototype.addShowSeason = function (showID, apiData) {
        return __awaiter(this, void 0, void 0, function () {
            var data, season;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = this._prepareData(showID, apiData);
                        return [4 /*yield*/, this.getSingleByShowSeasonTrakt(showID, apiData.number, apiData.ids.trakt)];
                    case 1:
                        season = _a.sent();
                        if ("id" in season) {
                            return [2 /*return*/, season];
                        }
                        return [4 /*yield*/, this._ibdb.insert(data, this._tableName)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.getSingleByShowSeasonTrakt(showID, data.season_number, data.trakt_id)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ShowSeasonsModel.prototype.getSingle = function (seasonID) {
        return __awaiter(this, void 0, void 0, function () {
            var where;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        where = {
                            id: seasonID
                        };
                        return [4 /*yield*/, this._ibdb.getRow(where, this._tableName)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ShowSeasonsModel.prototype.getSingleByShowSeasonTrakt = function (showID, seasonNumber, traktID) {
        return __awaiter(this, void 0, void 0, function () {
            var where;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        where = {
                            show_id: showID,
                            season_number: seasonNumber,
                            trakt_id: traktID
                        };
                        return [4 /*yield*/, this._ibdb.getRow(where, this._tableName)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ShowSeasonsModel.prototype.getSingleByTraktID = function (traktID) {
        return __awaiter(this, void 0, void 0, function () {
            var where;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        where = {
                            trakt_id: traktID
                        };
                        return [4 /*yield*/, this._ibdb.getRow(where, this._tableName)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ShowSeasonsModel.prototype.getSeasonsForShow = function (showID) {
        return __awaiter(this, void 0, void 0, function () {
            var where;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        where = {
                            show_id: showID
                        };
                        return [4 /*yield*/, this._ibdb.getAll(where, this._tableName, "season_number ASC")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ShowSeasonsModel.prototype.getSeasonsByTraktID = function (traktID) {
        return __awaiter(this, void 0, void 0, function () {
            var where;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        where = {
                            trakt_id: traktID
                        };
                        return [4 /*yield*/, this._ibdb.getAll(where, this._tableName, "season_number ASC")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ShowSeasonsModel.prototype.deleteAllForShow = function (showID) {
        return __awaiter(this, void 0, void 0, function () {
            var where;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        where = {
                            show_id: showID
                        };
                        return [4 /*yield*/, this._ibdb["delete"](where, this._tableName)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ShowSeasonsModel.prototype.updateLock = function (seasonID, lockStatus) {
        return __awaiter(this, void 0, void 0, function () {
            var data, where;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            locked: lockStatus
                        };
                        where = {
                            id: seasonID
                        };
                        return [4 /*yield*/, this._ibdb.update(data, where, this._tableName)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ShowSeasonsModel.prototype.updateLockAllSeasons = function (showID, lockStatus) {
        return __awaiter(this, void 0, void 0, function () {
            var seasons, _i, seasons_1, season;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSeasonsForShow(showID)];
                    case 1:
                        seasons = _a.sent();
                        _i = 0, seasons_1 = seasons;
                        _a.label = 2;
                    case 2:
                        if (!(_i < seasons_1.length)) return [3 /*break*/, 5];
                        season = seasons_1[_i];
                        return [4 /*yield*/, this.updateLock(season.id, lockStatus)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return ShowSeasonsModel;
}());
exports["default"] = ShowSeasonsModel;
//# sourceMappingURL=ShowSeasonsModel.js.map