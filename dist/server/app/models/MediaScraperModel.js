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
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var config_1 = __importDefault(require("../config"));
var MediaScraperModel = /** @class */ (function () {
    function MediaScraperModel(traktInstance, settingsModel) {
        this._trakt = traktInstance;
        this._settingsModel = settingsModel;
    }
    MediaScraperModel.prototype.searchMovies = function (movieQuery) {
        return __awaiter(this, void 0, void 0, function () {
            var options, results, res, _i, results_1, item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            query: movieQuery,
                            type: "movie",
                            extended: "full"
                        };
                        return [4 /*yield*/, this._trakt.search.text(options)];
                    case 1:
                        results = _a.sent();
                        res = [];
                        for (_i = 0, results_1 = results; _i < results_1.length; _i++) {
                            item = results_1[_i];
                            res.push(item.movie);
                        }
                        return [2 /*return*/, res];
                }
            });
        });
    };
    MediaScraperModel.prototype.searchShows = function (tvQuery) {
        return __awaiter(this, void 0, void 0, function () {
            var options, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            query: tvQuery,
                            type: "show",
                            extended: "full"
                        };
                        return [4 /*yield*/, this._trakt.search.text(options)];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, results.map(function (item) {
                                return item.show;
                            })];
                }
            });
        });
    };
    MediaScraperModel.prototype.getShowByTraktID = function (traktID) {
        return __awaiter(this, void 0, void 0, function () {
            var options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            id: traktID,
                            extended: "full"
                        };
                        return [4 /*yield*/, this._trakt.shows.summary(options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MediaScraperModel.prototype.getShowSeasonsList = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._trakt.seasons.summary({
                            id: id,
                            extended: "full"
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MediaScraperModel.prototype.getEpisodesForSeason = function (showID, seasonNumber) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._trakt.seasons.season({
                            id: showID,
                            season: seasonNumber,
                            extended: "full"
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MediaScraperModel.prototype.downloadThumbnail = function (typeOfMedia, fileURL, destFilenameMinusExt) {
        return __awaiter(this, void 0, void 0, function () {
            var origFilename, origFileExt, destFilename, camelCaseType, res, imagepaths, finalPath, dest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        origFilename = fileURL.split("/").pop();
                        origFileExt = origFilename.split(".").pop();
                        destFilename = this._sanitizeThumbFilename(destFilenameMinusExt) +
                            "." +
                            origFileExt;
                        camelCaseType = typeOfMedia[0].toUpperCase() + typeOfMedia.slice(1);
                        return [4 /*yield*/, node_fetch_1["default"](fileURL, {})];
                    case 1:
                        res = _a.sent();
                        imagepaths = config_1["default"].paths.images;
                        finalPath = path_1["default"].join(imagepaths.base, imagepaths[typeOfMedia], destFilename);
                        dest = fs_1["default"].createWriteStream(finalPath);
                        res.body.pipe(dest);
                        return [2 /*return*/, destFilename];
                }
            });
        });
    };
    MediaScraperModel.prototype._sanitizeThumbFilename = function (originalFilename) {
        // Replace current periods
        var newThumbFilename = originalFilename.replace(/\./g, "");
        // Replace spaces and dashes with periods
        newThumbFilename = newThumbFilename.replace(/(\s|\-)/g, ".");
        // Replace everything else with blank
        return newThumbFilename.replace(/[^\.a-zA-Z0-9]/g, "");
    };
    return MediaScraperModel;
}());
exports["default"] = MediaScraperModel;
//# sourceMappingURL=MediaScraperModel.js.map