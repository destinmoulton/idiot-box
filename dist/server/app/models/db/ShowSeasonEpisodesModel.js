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
var ShowSeasonEpisodesModel = /** @class */ (function () {
    function ShowSeasonEpisodesModel(ibdb) {
        this._ibdb = ibdb;
        this._tableName = "show_season_episodes";
    }
    ShowSeasonEpisodesModel.prototype._prepareData = function (showID, seasonID, apiData) {
        return {
            show_id: showID,
            season_id: seasonID,
            season_number: apiData.season,
            episode_number: apiData.number,
            title: apiData.title,
            overview: apiData.overview,
            rating: apiData.rating,
            first_aired: moment_1["default"](apiData.first_aired).format("X"),
            updated_at: moment_1["default"](apiData.updated_at).format("X"),
            runtime: apiData.runtime,
            trakt_id: apiData.ids.trakt,
            tvdb_id: apiData.ids.tvdb,
            imdb_id: apiData.ids.imdb,
            tmdb_id: apiData.ids.tmdb,
            tvrage_id: apiData.ids.tvrage,
            watched: 0
        };
    };
    ShowSeasonEpisodesModel.prototype.addEpisode = function (showID, seasonID, apiData) {
        return __awaiter(this, void 0, void 0, function () {
            var data, episode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = this._prepareData(showID, seasonID, apiData);
                        return [4 /*yield*/, this.getSingleByShowSeasonTrakt(showID, seasonID, data.episode_number, data.trakt_id)];
                    case 1:
                        episode = _a.sent();
                        if ("id" in episode) {
                            return [2 /*return*/, episode];
                        }
                        return [4 /*yield*/, this._ibdb.insert(data, this._tableName)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.getSingleByShowSeasonTrakt(showID, seasonID, data.episode_number, data.trakt_id)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ShowSeasonEpisodesModel.prototype.addArrEpisodes = function (showID, seasonID, episodes) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, episodes_1, episode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, episodes_1 = episodes;
                        _a.label = 1;
                    case 1:
                        if (!(_i < episodes_1.length)) return [3 /*break*/, 4];
                        episode = episodes_1[_i];
                        return [4 /*yield*/, this.addEpisode(showID, seasonID, episode)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ShowSeasonEpisodesModel.prototype.updateEpisode = function (showID, seasonID, episodeID, apiData) {
        return __awaiter(this, void 0, void 0, function () {
            var data, where;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = this._prepareData(showID, seasonID, apiData);
                        where = {
                            id: episodeID,
                            show_id: showID,
                            season_id: seasonID
                        };
                        return [4 /*yield*/, this._ibdb.update(data, where, this._tableName)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ShowSeasonEpisodesModel.prototype.updateMultipleEpisodesWatchedStatus = function (episodeIDs, watchedStatus) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                episodeIDs.forEach(function (episodeID) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.updateEpisodeWatchedStatus(episodeID, watchedStatus)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    ShowSeasonEpisodesModel.prototype.updateEpisodeWatchedStatus = function (episodeID, newWatchedStatus) {
        return __awaiter(this, void 0, void 0, function () {
            var data, where;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            watched: newWatchedStatus
                        };
                        where = {
                            id: episodeID
                        };
                        return [4 /*yield*/, this._ibdb.update(data, where, this._tableName)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ShowSeasonEpisodesModel.prototype.getSingle = function (episodeID) {
        return __awaiter(this, void 0, void 0, function () {
            var where;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        where = {
                            id: episodeID
                        };
                        return [4 /*yield*/, this._ibdb.getRow(where, this._tableName)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ShowSeasonEpisodesModel.prototype.getSingleByShowSeasonTrakt = function (showID, seasonID, episodeNumber, traktID) {
        return __awaiter(this, void 0, void 0, function () {
            var where;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        where = {
                            show_id: showID,
                            season_id: seasonID,
                            episode_number: episodeNumber,
                            trakt_id: traktID
                        };
                        return [4 /*yield*/, this._ibdb.getRow(where, this._tableName)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ShowSeasonEpisodesModel.prototype.getSingleByTraktID = function (traktID) {
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
    ShowSeasonEpisodesModel.prototype.getEpisodesForSeason = function (showID, seasonID) {
        return __awaiter(this, void 0, void 0, function () {
            var where;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        where = {
                            show_id: showID,
                            season_id: seasonID
                        };
                        return [4 /*yield*/, this._ibdb.getAll(where, this._tableName, "episode_number ASC")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ShowSeasonEpisodesModel.prototype.getEpisodesForSeasonNum = function (showID, seasonNum) {
        return __awaiter(this, void 0, void 0, function () {
            var where;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        where = {
                            show_id: showID,
                            season_number: seasonNum
                        };
                        return [4 /*yield*/, this._ibdb.getAll(where, this._tableName, "episode_number ASC")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ShowSeasonEpisodesModel.prototype.getEpisodesForShow = function (showID) {
        return __awaiter(this, void 0, void 0, function () {
            var where;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        where = {
                            show_id: showID
                        };
                        return [4 /*yield*/, this._ibdb.getAll(where, this._tableName, "episode_number ASC")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ShowSeasonEpisodesModel.prototype.getBetweenUnixTimestamps = function (startUnixTimestamp, endUnixTimestamp) {
        return __awaiter(this, void 0, void 0, function () {
            var query, params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "SELECT * FROM " +
                            this._tableName +
                            " WHERE first_aired > ? AND first_aired < ? ORDER BY first_aired";
                        params = [startUnixTimestamp, endUnixTimestamp];
                        return [4 /*yield*/, this._ibdb.queryAll(query, params)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    ShowSeasonEpisodesModel.prototype.deleteSingle = function (episodeID) {
        return __awaiter(this, void 0, void 0, function () {
            var where;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        where = {
                            id: episodeID
                        };
                        return [4 /*yield*/, this._ibdb["delete"](where, this._tableName)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ShowSeasonEpisodesModel.prototype.deleteAllForShow = function (showID) {
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
    ShowSeasonEpisodesModel.prototype.collateEpisodeInfo = function (episodeInfo, showsModel, showSeasonsModel) {
        return __awaiter(this, void 0, void 0, function () {
            var show, season, episode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, showsModel.getSingle(episodeInfo.show_id)];
                    case 1:
                        show = _a.sent();
                        return [4 /*yield*/, showSeasonsModel.getSingle(episodeInfo.season_id)];
                    case 2:
                        season = _a.sent();
                        return [4 /*yield*/, this.getSingle(episodeInfo.episode_id)];
                    case 3:
                        episode = _a.sent();
                        return [2 /*return*/, {
                                show: show,
                                season: season,
                                episode: episode
                            }];
                }
            });
        });
    };
    return ShowSeasonEpisodesModel;
}());
exports["default"] = ShowSeasonEpisodesModel;
//# sourceMappingURL=ShowSeasonEpisodesModel.js.map