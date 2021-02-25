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
var trakt_tv_1 = __importDefault(require("trakt.tv"));
var IBDB_1 = __importDefault(require("../db/IBDB"));
var FilesModel_1 = __importDefault(require("../models/db/FilesModel"));
var FileToEpisodeModel_1 = __importDefault(require("../models/db/FileToEpisodeModel"));
var MediaScraperModel_1 = __importDefault(require("../models/MediaScraperModel"));
var SettingsModel_1 = __importDefault(require("../models/db/SettingsModel"));
var ShowsModel_1 = __importDefault(require("../models/db/ShowsModel"));
var ShowSeasonsModel_1 = __importDefault(require("../models/db/ShowSeasonsModel"));
var ShowSeasonEpisodesModel_1 = __importDefault(require("../models/db/ShowSeasonEpisodesModel"));
var config_1 = __importDefault(require("../config"));
var settingsModel = new SettingsModel_1["default"](IBDB_1["default"]);
var filesModel = new FilesModel_1["default"](IBDB_1["default"]);
var fileToEpisodeModel = new FileToEpisodeModel_1["default"](IBDB_1["default"]);
var mediaScraperModel = new MediaScraperModel_1["default"](new trakt_tv_1["default"](config_1["default"].trakt), settingsModel);
var showsModel = new ShowsModel_1["default"](IBDB_1["default"]);
var showSeasonsModel = new ShowSeasonsModel_1["default"](IBDB_1["default"]);
var showSeasonEpisodesModel = new ShowSeasonEpisodesModel_1["default"](IBDB_1["default"]);
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, IBDB_1["default"].connect(config_1["default"])];
            case 1:
                _a.sent();
                return [4 /*yield*/, compareShows()];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
function compareShows() {
    return __awaiter(this, void 0, void 0, function () {
        var shows;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, showsModel.getAll()];
                case 1:
                    shows = _a.sent();
                    return [2 /*return*/, shows.map(function (show) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, compareSeasons(show.id, show.trakt_id)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
            }
        });
    });
}
function compareSeasons(showID, showTraktID) {
    return __awaiter(this, void 0, void 0, function () {
        var traktSeasons;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mediaScraperModel.getShowSeasonsList(showTraktID)];
                case 1:
                    traktSeasons = _a.sent();
                    return [2 /*return*/, traktSeasons.map(function (traktSeason) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, processSeason(traktSeason, showID, showTraktID)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
            }
        });
    });
}
function processSeason(traktSeason, showID, showTraktID) {
    return __awaiter(this, void 0, void 0, function () {
        var showSeason;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, showSeasonsModel.getSingleByTraktID(traktSeason.ids.trakt)];
                case 1:
                    showSeason = _a.sent();
                    if (!!showSeason.hasOwnProperty("id")) return [3 /*break*/, 3];
                    return [4 /*yield*/, showSeasonsModel.addShowSeason(showID, traktSeason)];
                case 2:
                    // Add the season
                    showSeason = _a.sent();
                    _a.label = 3;
                case 3:
                    if (!(showSeason.locked !== 1)) return [3 /*break*/, 5];
                    return [4 /*yield*/, compareEpisodes(showID, showSeason.id, showTraktID, showSeason.season_number)];
                case 4: return [2 /*return*/, _a.sent()];
                case 5: return [2 /*return*/, true];
            }
        });
    });
}
function compareEpisodes(showID, seasonID, showTraktID, seasonNum) {
    return __awaiter(this, void 0, void 0, function () {
        var traktEpisodes;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mediaScraperModel.getEpisodesForSeason(showTraktID, seasonNum)];
                case 1:
                    traktEpisodes = _a.sent();
                    return [2 /*return*/, traktEpisodes.map(function (traktEpisode) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, processEpisode(showID, seasonID, traktEpisode)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
            }
        });
    });
}
function processEpisode(showID, seasonID, traktEpisode) {
    return __awaiter(this, void 0, void 0, function () {
        var seasonEpisode;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, showSeasonEpisodesModel.getSingleByTraktID(traktEpisode.ids.trakt)];
                case 1:
                    seasonEpisode = _a.sent();
                    if (!!seasonEpisode.hasOwnProperty("id")) return [3 /*break*/, 3];
                    return [4 /*yield*/, showSeasonEpisodesModel.addEpisode(showID, seasonID, traktEpisode)];
                case 2: 
                // Add the episode
                return [2 /*return*/, _a.sent()];
                case 3: return [4 /*yield*/, showSeasonEpisodesModel.updateEpisode(showID, seasonID, seasonEpisode.id, traktEpisode)];
                case 4: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
//# sourceMappingURL=daily_update.js.map