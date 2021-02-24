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
var config_1 = __importDefault(require("../../config"));
var IBDB_1 = __importDefault(require("../../db/IBDB"));
var IDModel_1 = __importDefault(require("../../models/IDModel"));
var FilesystemModel_1 = __importDefault(require("../../models/FilesystemModel"));
var FilesModel_1 = __importDefault(require("../../models/db/FilesModel"));
var FileToEpisodeModel_1 = __importDefault(require("../../models/db/FileToEpisodeModel"));
var FileToMovieModel_1 = __importDefault(require("../../models/db/FileToMovieModel"));
var GenresModel_1 = __importDefault(require("../../models/db/GenresModel"));
var MediaScraperModel_1 = __importDefault(require("../../models/MediaScraperModel"));
var MoviesModel_1 = __importDefault(require("../../models/db/MoviesModel"));
var MovieToGenreModel_1 = __importDefault(require("../../models/db/MovieToGenreModel"));
var SettingsModel_1 = __importDefault(require("../../models/db/SettingsModel"));
var ShowsModel_1 = __importDefault(require("../../models/db/ShowsModel"));
var ShowSeasonsModel_1 = __importDefault(require("../../models/db/ShowSeasonsModel"));
var ShowSeasonEpisodesModel_1 = __importDefault(require("../../models/db/ShowSeasonEpisodesModel"));
var settingsModel = new SettingsModel_1["default"](IBDB_1["default"]);
var filesModel = new FilesModel_1["default"](IBDB_1["default"]);
var fileToEpisodeModel = new FileToEpisodeModel_1["default"](IBDB_1["default"]);
var fileToMovieModel = new FileToMovieModel_1["default"](IBDB_1["default"]);
var genresModel = new GenresModel_1["default"](IBDB_1["default"]);
var mediaScraperModel = new MediaScraperModel_1["default"](new trakt_tv_1["default"](config_1["default"].trakt), settingsModel);
var movieToGenreModel = new MovieToGenreModel_1["default"](IBDB_1["default"], genresModel);
var moviesModel = new MoviesModel_1["default"](IBDB_1["default"], movieToGenreModel);
var showsModel = new ShowsModel_1["default"](IBDB_1["default"]);
var showSeasonsModel = new ShowSeasonsModel_1["default"](IBDB_1["default"]);
var showSeasonEpisodesModel = new ShowSeasonEpisodesModel_1["default"](IBDB_1["default"]);
var filesystemConstructionModels = {
    filesModel: filesModel,
    fileToEpisodeModel: fileToEpisodeModel,
    fileToMovieModel: fileToMovieModel,
    moviesModel: moviesModel,
    settingsModel: settingsModel,
    showSeasonEpisodesModel: showSeasonEpisodesModel
};
var filesystemModel = new FilesystemModel_1["default"](filesystemConstructionModels);
var idConstructionModels = {
    filesystemModel: filesystemModel,
    filesModel: filesModel,
    fileToEpisodeModel: fileToEpisodeModel,
    fileToMovieModel: fileToMovieModel,
    mediaScraperModel: mediaScraperModel,
    moviesModel: moviesModel,
    settingsModel: settingsModel,
    showsModel: showsModel,
    showSeasonsModel: showSeasonsModel,
    showSeasonEpisodesModel: showSeasonEpisodesModel
};
var idModel = new IDModel_1["default"](idConstructionModels);
var id = {
    // file: {
    //     search: {
    //         params: ['file_info'],
    //         func: async(fileInfo) =>await idModel.findID(fileInfo)
    //     }
    // },
    movie_or_episode: {
        remove_ids: {
            params: ["items_to_remove"],
            func: function (itemsToRemove) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, idModel.removeMultipleIDs(itemsToRemove)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); }
        }
    },
    movie: {
        id_and_archive: {
            params: ["movie_info", "image_url", "source_info", "dest_info"],
            func: function (movieInfo, imageURL, sourceInfo, destInfo) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, idModel.idAndArchiveMovie(movieInfo, imageURL, sourceInfo, destInfo)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); }
        }
    },
    show: {
        add: {
            params: ["show_info", "image_info"],
            func: function (showInfo, imageInfo) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, idModel.addShow(showInfo, imageInfo)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); }
        }
    },
    episode: {
        id_and_archive: {
            params: ["episode_info", "source_info", "dest_info"],
            func: function (epInfo, sourceInfo, destInfo) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, idModel.idAndArchiveEpisode(epInfo, sourceInfo, destInfo)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }
        }
    },
    multiple_episodes: {
        id_and_archive: {
            params: ["source_path_info", "dest_subpath", "id_info"],
            func: function (sourcePathInfo, destSubpath, idInfo) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, idModel.idAndArchiveMultipleEpisodes(sourcePathInfo, destSubpath, idInfo)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); }
        }
    }
};
exports["default"] = id;
//# sourceMappingURL=id.api.js.map