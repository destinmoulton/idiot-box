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
exports.__esModule = true;
var logger = require("../logger");
var IDModel = /** @class */ (function () {
    function IDModel(models) {
        this._filesystemModel = models.filesystemModel;
        this._filesModel = models.filesModel;
        this._fileToEpisodeModel = models.fileToEpisodeModel;
        this._fileToMovieModel = models.fileToMovieModel;
        this._mediaScraperModel = models.mediaScraperModel;
        this._moviesModel = models.moviesModel;
        this._settingsModel = models.settingsModel;
        this._showsModel = models.showsModel;
        this._showSeasonsModel = models.showSeasonsModel;
        this._showSeasonEpisodesModel = models.showSeasonEpisodesModel;
    }
    IDModel.prototype.idAndArchiveMovie = function (movieInfo, imageURL, sourceInfo, destInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var imageFilename, newFilename, movieRow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        imageFilename = this._buildThumbFilename(movieInfo);
                        return [4 /*yield*/, this._filesystemModel.moveInSetDir(sourceInfo, destInfo, "Movies")];
                    case 1:
                        _a.sent();
                        newFilename = "";
                        if (!(imageURL !== "")) return [3 /*break*/, 3];
                        return [4 /*yield*/, this._mediaScraperModel.downloadThumbnail("movies", imageURL, imageFilename)];
                    case 2:
                        newFilename = _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this._moviesModel.addMovie(movieInfo, newFilename)];
                    case 4:
                        movieRow = _a.sent();
                        return [4 /*yield*/, this._addMovieFileAssociations(movieRow, destInfo)];
                    case 5: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Add the file info to the db and the movie-to-file
     * association using that info.
     *
     * @param Movie movie
     * @param object destInfo
     */
    IDModel.prototype._addMovieFileAssociations = function (movie, destInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var destSetting, possibleExisting, fileRow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._settingsModel.getSingle("directories", "Movies")];
                    case 1:
                        destSetting = _a.sent();
                        return [4 /*yield*/, this._fileToMovieModel.getSingleForMovie(movie.id)];
                    case 2:
                        possibleExisting = _a.sent();
                        if (!("file_id" in possibleExisting)) return [3 /*break*/, 6];
                        if (!(possibleExisting.file_id !== null)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._filesModel.deleteSingle(possibleExisting.file_id)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this._fileToMovieModel.deleteSingle(possibleExisting.file_id, movie.id)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [4 /*yield*/, this._filesModel.addFile(destSetting.id, destInfo.subpath, destInfo.filename, "movie")];
                    case 7:
                        fileRow = _a.sent();
                        return [4 /*yield*/, this._fileToMovieModel.add(fileRow.id, movie.id)];
                    case 8: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    IDModel.prototype.idAndArchiveEpisode = function (epInfo, sourceInfo, destInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var destSetting, fileRow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Setup the directory
                    return [4 /*yield*/, this._filesystemModel.moveInSetDir(sourceInfo, destInfo, "Shows")];
                    case 1:
                        // Setup the directory
                        _a.sent();
                        return [4 /*yield*/, this._settingsModel.getSingle("directories", "Shows")];
                    case 2:
                        destSetting = _a.sent();
                        // Remove possible existing files and associations
                        return [4 /*yield*/, this._removeExistingEpisodeAssoc(epInfo.episode_id, destSetting.id, destInfo.subpath, destInfo.filename)];
                    case 3:
                        // Remove possible existing files and associations
                        _a.sent();
                        return [4 /*yield*/, this._filesModel.addFile(destSetting.id, destInfo.subpath, destInfo.filename, "show")];
                    case 4:
                        fileRow = _a.sent();
                        return [4 /*yield*/, this._fileToEpisodeModel.add(fileRow.id, epInfo.show_id, epInfo.season_id, epInfo.episode_id)];
                    case 5: 
                    // Create the new association
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    IDModel.prototype.idAndArchiveMultipleEpisodes = function (sourcePathInfo, destSubpath, idInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var episodesToMove, filenames, res, _i, filenames_1, filename, episode, dest, source, epInfo, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        episodesToMove = idInfo.episodes;
                        filenames = Object.keys(episodesToMove);
                        res = [];
                        _i = 0, filenames_1 = filenames;
                        _c.label = 1;
                    case 1:
                        if (!(_i < filenames_1.length)) return [3 /*break*/, 4];
                        filename = filenames_1[_i];
                        episode = episodesToMove[filename];
                        dest = {
                            filename: episode.newFilename,
                            subpath: destSubpath
                        };
                        source = {
                            setting_id: sourcePathInfo.setting_id,
                            subpath: sourcePathInfo.subpath,
                            filename: filename
                        };
                        epInfo = {
                            show_id: idInfo.show_id,
                            season_id: idInfo.season_id,
                            episode_id: episode.selectedEpisodeID
                        };
                        _b = (_a = res).push;
                        return [4 /*yield*/, this.idAndArchiveEpisode(epInfo, source, dest)];
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
    IDModel.prototype.removeMultipleIDs = function (itemsToRemove) {
        return __awaiter(this, void 0, void 0, function () {
            var res, _i, itemsToRemove_1, item, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        res = [];
                        _i = 0, itemsToRemove_1 = itemsToRemove;
                        _c.label = 1;
                    case 1:
                        if (!(_i < itemsToRemove_1.length)) return [3 /*break*/, 4];
                        item = itemsToRemove_1[_i];
                        _b = (_a = res).push;
                        return [4 /*yield*/, this.removeSingleID(item.assocData)];
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
    IDModel.prototype.removeSingleID = function (idInfo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(idInfo.type === "movie")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._removeMovie(idInfo)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        if (!(idInfo.type === "show")) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._removeEpisodeFileAssociations(idInfo)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Remove any existing file-to-episodes and files
     * for an episode.
     *
     * @param episode_id
     * @param dest_setting_id
     * @param dest_subpath
     * @param dest_filename
     */
    IDModel.prototype._removeExistingEpisodeAssoc = function (episode_id, dest_setting_id, dest_subpath, dest_filename) {
        return __awaiter(this, void 0, void 0, function () {
            var possibleLinks, _i, possibleLinks_1, link, possibleFiles, _a, possibleFiles_1, file;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._fileToEpisodeModel.getAllForEpisode(episode_id)];
                    case 1:
                        possibleLinks = _b.sent();
                        _i = 0, possibleLinks_1 = possibleLinks;
                        _b.label = 2;
                    case 2:
                        if (!(_i < possibleLinks_1.length)) return [3 /*break*/, 7];
                        link = possibleLinks_1[_i];
                        if (!(link.file_id !== null)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._filesModel.deleteSingle(link.file_id)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4: return [4 /*yield*/, this._fileToEpisodeModel.deleteSingleForEpisode(link.episode_id)];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7: return [4 /*yield*/, this._filesModel.getAllForDirectoryAndFilename(dest_setting_id, dest_subpath, dest_filename)];
                    case 8:
                        possibleFiles = _b.sent();
                        _a = 0, possibleFiles_1 = possibleFiles;
                        _b.label = 9;
                    case 9:
                        if (!(_a < possibleFiles_1.length)) return [3 /*break*/, 13];
                        file = possibleFiles_1[_a];
                        return [4 /*yield*/, this._fileToEpisodeModel.deleteSingleByFileID(file.id)];
                    case 10:
                        _b.sent();
                        return [4 /*yield*/, this._filesModel.deleteSingle(file.id)];
                    case 11:
                        _b.sent();
                        _b.label = 12;
                    case 12:
                        _a++;
                        return [3 /*break*/, 9];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Remove a movie and the file-to-movie associated with it.
     *
     * The movie is deleted because movies are 1:1 with files.
     *
     * @param object idInfo
     */
    IDModel.prototype._removeMovie = function (idInfo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._filesModel.deleteSingle(idInfo.file_id)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this._fileToMovieModel.deleteSingle(idInfo.file_id, idInfo.movie_id)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this._moviesModel.deleteSingle(idInfo.movie_id)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Remove the file and file-to-episode associating for a show episode.
     *
     * This does not remove the show as Shows are not directly tied to episodes.
     *
     * @param object idInfo
     */
    IDModel.prototype._removeEpisodeFileAssociations = function (idInfo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._filesModel.deleteSingle(idInfo.file_id)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this._fileToEpisodeModel.deleteSingle(idInfo.file_id, idInfo.episode_id)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    IDModel.prototype.addShow = function (showInfo, imageInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var imageFilename, newFilename, show;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        imageFilename = this._buildThumbFilename(showInfo);
                        return [4 /*yield*/, this._mediaScraperModel.downloadThumbnail("shows", imageInfo.url, imageFilename)];
                    case 1:
                        newFilename = _a.sent();
                        return [4 /*yield*/, this._showsModel.addShow(showInfo, newFilename)];
                    case 2:
                        show = _a.sent();
                        return [4 /*yield*/, this._scrapeAndAddSeasonsForShow(show)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    IDModel.prototype._buildThumbFilename = function (mediaInfo) {
        return mediaInfo.title + "." + mediaInfo.year;
    };
    /**
     * Scrape and add the seasons (and episodes)
     * for a show.
     *
     * @param Show show
     */
    IDModel.prototype._scrapeAndAddSeasonsForShow = function (show) {
        return __awaiter(this, void 0, void 0, function () {
            var seasons, addedSeasons;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._mediaScraperModel.getShowSeasonsList(show.trakt_id)];
                    case 1:
                        seasons = _a.sent();
                        return [4 /*yield*/, this._showSeasonsModel.addArrayOfSeasons(seasons, show.id)];
                    case 2:
                        addedSeasons = _a.sent();
                        return [4 /*yield*/, this._scrapeAndAddEpisodesForSeasons(show, addedSeasons)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Scrape the episodes for an array of seasons and
     * add them to the db.
     *
     * @param Show show
     * @param ShowSeasons seasons for a show
     */
    IDModel.prototype._scrapeAndAddEpisodesForSeasons = function (show, seasons) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, seasons_1, season, episodesArr, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, seasons_1 = seasons;
                        _a.label = 1;
                    case 1:
                        if (!(_i < seasons_1.length)) return [3 /*break*/, 7];
                        season = seasons_1[_i];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, this._mediaScraperModel.getEpisodesForSeason(show.trakt_id, season.season_number)];
                    case 3:
                        episodesArr = _a.sent();
                        return [4 /*yield*/, this._showSeasonEpisodesModel.addArrEpisodes(show.id, season.id, episodesArr)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _a.sent();
                        throw new Error("IDModel :: _scrapeAndAddEpisodesForSeasons + " + err_1);
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return IDModel;
}());
exports["default"] = IDModel;
//# sourceMappingURL=IDModel.js.map