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
var IBDB_1 = __importDefault(require("../../db/IBDB"));
var EpisodeAPI_1 = __importDefault(require("../../models/EpisodeAPI"));
var FilesModel_1 = __importDefault(require("../../models/db/FilesModel"));
var FileToEpisodeModel_1 = __importDefault(require("../../models/db/FileToEpisodeModel"));
var ShowsAPI_1 = __importDefault(require("../../models/ShowsAPI"));
var ShowsModel_1 = __importDefault(require("../../models/db/ShowsModel"));
var ShowSeasonsModel_1 = __importDefault(require("../../models/db/ShowSeasonsModel"));
var ShowSeasonEpisodesModel_1 = __importDefault(require("../../models/db/ShowSeasonEpisodesModel"));
var filesModel = new FilesModel_1["default"](IBDB_1["default"]);
var fileToEpisodeModel = new FileToEpisodeModel_1["default"](IBDB_1["default"]);
var showsModel = new ShowsModel_1["default"](IBDB_1["default"]);
var showSeasonsModel = new ShowSeasonsModel_1["default"](IBDB_1["default"]);
var showSeasonEpisodesModel = new ShowSeasonEpisodesModel_1["default"](IBDB_1["default"]);
var episodeAPIConfig = {
    filesModel: filesModel,
    fileToEpisodeModel: fileToEpisodeModel,
    showSeasonEpisodesModel: showSeasonEpisodesModel
};
var episodeAPI = new EpisodeAPI_1["default"](episodeAPIConfig);
var showsAPIConfig = {
    filesModel: filesModel,
    fileToEpisodeModel: fileToEpisodeModel,
    showsModel: showsModel,
    showSeasonEpisodesModel: showSeasonEpisodesModel,
    showSeasonsModel: showSeasonsModel
};
var showsAPI = new ShowsAPI_1["default"](showsAPIConfig);
var shows = {
    show: {
        get_for_slug: {
            params: ["slug"],
            func: function (slug) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, showsModel.getSingleBySlug(slug)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            }); }); }
        },
        "delete": {
            params: ["show_id"],
            func: function (showID) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, showsAPI.deleteSingleShow(showID)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            }); }); }
        }
    },
    shows: {
        get: {
            params: [],
            func: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, showsModel.getAll()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            }); }); }
        },
        get_all_with_locked_info: {
            params: [],
            func: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, showsAPI.getAllShowsWithSeasonLockedInfo()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            }); }); }
        }
    },
    season: {
        toggle_lock: {
            params: ["season_id", "lock_status"],
            func: function (seasonID, lockStatus) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, showSeasonsModel.updateLock(seasonID, lockStatus)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            }); }); }
        }
    },
    seasons: {
        get: {
            params: ["show_id"],
            func: function (showID) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, showSeasonsModel.getSeasonsForShow(showID)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); }
        },
        toggle_lock_all: {
            params: ["show_id", "lock_status"],
            func: function (showID, lockStatus) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, showSeasonsModel.updateLockAllSeasons(showID, lockStatus)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); }
        }
    },
    episodes: {
        get: {
            params: ["show_id", "season_id"],
            func: function (showID, seasonID) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, showSeasonEpisodesModel.getEpisodesForSeason(showID, seasonID)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); }
        },
        get_all_with_file_info: {
            params: ["show_id", "season_number"],
            func: function (showID, seasonNum) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, episodeAPI.getAllEpisodesWithFileInfo(showID, seasonNum)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); }
        },
        toggle_watched: {
            params: ["episode_ids", "watched_status"],
            func: function (episodeIDs, watchedStatus) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, showSeasonEpisodesModel.updateMultipleEpisodesWatchedStatus(episodeIDs, watchedStatus)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); }
        },
        get_between_unix_timestamps: {
            params: ["start_unix_timestamp", "end_unix_timestamp"],
            func: function (startUnixTimestamp, endUnixTimestamp) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, showsAPI.getEpisodesBetweenTimestamps(startUnixTimestamp, endUnixTimestamp)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); }
        }
    },
    episode: {
        collate: {
            params: ["episode_info"],
            func: function (episodeInfo) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, showSeasonEpisodesModel.collateEpisodeInfo(episodeInfo, showsModel, showSeasonsModel)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); }
        }
    }
};
exports["default"] = shows;
//# sourceMappingURL=shows.api.js.map