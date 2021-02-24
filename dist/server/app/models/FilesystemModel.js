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
var mkdirp_1 = __importDefault(require("mkdirp"));
var FilesystemModel = /** @class */ (function () {
    function FilesystemModel(models) {
        this._filesModel = models.filesModel;
        this._fileToEpisodeModel = models.fileToEpisodeModel;
        this._fileToMovieModel = models.fileToMovieModel;
        this._moviesModel = models.moviesModel;
        this._settingsModel = models.settingsModel;
        this._showSeasonEpisodesModel = models.showSeasonEpisodesModel;
    }
    FilesystemModel.prototype.getDirList = function (basePath, fullPath) {
        return __awaiter(this, void 0, void 0, function () {
            var contents, res, _i, contents_1, filename, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!fs_1["default"].existsSync(fullPath)) {
                            throw new Error("FilesystemModel :: getDirList :: " + fullPath + " does not exist.");
                        }
                        contents = fs_1["default"].readdirSync(fullPath);
                        res = [];
                        _i = 0, contents_1 = contents;
                        _c.label = 1;
                    case 1:
                        if (!(_i < contents_1.length)) return [3 /*break*/, 4];
                        filename = contents_1[_i];
                        _b = (_a = res).push;
                        return [4 /*yield*/, this._collateFileInformation(basePath, fullPath, filename)];
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
    FilesystemModel.prototype._collateFileInformation = function (basePath, fullPath, filename) {
        return __awaiter(this, void 0, void 0, function () {
            var subpath, info, isDirectory, fileData, setting, file;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        subpath = fullPath.slice(basePath.length + 1);
                        info = fs_1["default"].statSync(path_1["default"].join(fullPath, filename));
                        isDirectory = info.isDirectory();
                        fileData = {
                            name: filename,
                            atime: info.atime,
                            birthtime: info.birthtime,
                            size: info.size,
                            isDirectory: isDirectory,
                            assocData: {}
                        };
                        if (isDirectory) {
                            return [2 /*return*/, fileData];
                        }
                        return [4 /*yield*/, this._settingsModel.getSingleByCatAndVal("directories", basePath)];
                    case 1:
                        setting = _a.sent();
                        if (!setting.hasOwnProperty("id")) {
                            return [2 /*return*/, fileData];
                        }
                        return [4 /*yield*/, this._filesModel.getSingleByDirectoryAndFilename(setting.id, subpath, filename)];
                    case 2:
                        file = _a.sent();
                        if (!file.hasOwnProperty("id")) {
                            return [2 /*return*/, fileData];
                        }
                        if (!(file.mediatype === "movie")) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._getMovieFileInfo(file, fileData)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [4 /*yield*/, this._getEpisodeFileInfo(file, fileData)];
                    case 5: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Get the movie file information for collation
     * @param object FilesModel file row.
     * @param object Object to append collation
     */
    FilesystemModel.prototype._getMovieFileInfo = function (file, fileCollate) {
        return __awaiter(this, void 0, void 0, function () {
            var fileToMovie, movieInfo, assocData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._fileToMovieModel.getSingleForFile(file.id)];
                    case 1:
                        fileToMovie = _a.sent();
                        if (!fileToMovie.hasOwnProperty("movie_id")) {
                            return [2 /*return*/, fileCollate];
                        }
                        return [4 /*yield*/, this._moviesModel.getSingle(fileToMovie.movie_id)];
                    case 2:
                        movieInfo = _a.sent();
                        assocData = {
                            movie_id: movieInfo.id,
                            file_id: file.id,
                            title: movieInfo.title,
                            type: "movie",
                            year: movieInfo.year
                        };
                        fileCollate.assocData = assocData;
                        return [2 /*return*/, fileCollate];
                }
            });
        });
    };
    /**
     * Get the episode-file information for collation.
     * @param Object FilesModel file row.
     * @param Object Object to append collation
     */
    FilesystemModel.prototype._getEpisodeFileInfo = function (file, fileCollate) {
        return __awaiter(this, void 0, void 0, function () {
            var fileToEpisode, episodeInfo, assocData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._fileToEpisodeModel.getSingleForFile(file.id)];
                    case 1:
                        fileToEpisode = _a.sent();
                        if (!fileToEpisode.hasOwnProperty("episode_id")) {
                            return [2 /*return*/, fileCollate];
                        }
                        return [4 /*yield*/, this._showSeasonEpisodesModel.getSingle(fileToEpisode.episode_id)];
                    case 2:
                        episodeInfo = _a.sent();
                        assocData = {
                            episode_id: episodeInfo.id,
                            file_id: file.id,
                            title: episodeInfo.title,
                            type: "show"
                        };
                        fileCollate.assocData = assocData;
                        return [2 /*return*/, fileCollate];
                }
            });
        });
    };
    /**
     *
     * sourceInfo:
     *     setting_id
     *     subpath
     *     filename
     *
     * destInfo:
     *     subpath
     *     filename
     *
     * @param object sourceInfo
     * @param object destInfo
     */
    FilesystemModel.prototype.moveInSetDir = function (sourceInfo, destInfo, destDirType) {
        return __awaiter(this, void 0, void 0, function () {
            var sourceSetting, fullSourcePath, destSetting, baseDestDir, destPath, fullDestPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._settingsModel.getSingleByID(sourceInfo.setting_id)];
                    case 1:
                        sourceSetting = _a.sent();
                        fullSourcePath = path_1["default"].join(sourceSetting.value, sourceInfo.subpath, sourceInfo.filename);
                        if (!fs_1["default"].existsSync(fullSourcePath)) {
                            throw new Error("FilesystemModel :: moveInSetDir() :: source path " + fullSourcePath + " does not exist");
                        }
                        return [4 /*yield*/, this._settingsModel.getSingle("directories", destDirType)];
                    case 2:
                        destSetting = _a.sent();
                        baseDestDir = destSetting.value;
                        if (!fs_1["default"].existsSync(baseDestDir)) {
                            throw new Error("FilesystemModel :: moveInSetDir() :: destination path " + baseDestDir + " does not exist");
                        }
                        destPath = path_1["default"].join(baseDestDir, destInfo.subpath);
                        if (!fs_1["default"].existsSync(destPath)) {
                            if (!mkdirp_1["default"].sync(destPath)) {
                                throw new Error("FilesystemModel :: moveInSetDir() :: unable to make the destination dir " + destPath);
                            }
                        }
                        fullDestPath = path_1["default"].join(destPath, destInfo.filename);
                        fs_1["default"].renameSync(fullSourcePath, fullDestPath);
                        if (!fs_1["default"].existsSync(fullDestPath)) {
                            throw new Error("FilesystemModel :: moveInSetDir() :: unable to move file '" + fullSourcePath + "' to '" + fullDestPath + "'");
                        }
                        return [2 /*return*/, {
                                original_path: fullSourcePath,
                                new_path: fullDestPath
                            }];
                }
            });
        });
    };
    /**
     * Perform a direct move (ie between setting dirs)
     * on multiple items (files or dirs);
     *
     * @param string sourcePath
     * @param string destPath
     * @param object itemsToRename
     */
    FilesystemModel.prototype.directMoveMultiple = function (sourcePath, destPath, itemsToRename) {
        var _this = this;
        var promisesToRun = [];
        var originalNames = Object.keys(itemsToRename);
        originalNames.forEach(function (sourceName) {
            var cmd = _this.directMoveSingle(sourcePath, destPath, sourceName, itemsToRename[sourceName]);
            promisesToRun.push(cmd);
        });
        return Promise.all(promisesToRun);
    };
    /**
     * Perform a "direct" move -- possibly between two
     * setting directories.
     *
     * To move within a setting directory, use moveInSetDir()
     *
     * @param string sourcePath
     * @param string destPath
     * @param string sourceName
     * @param string destName
     */
    FilesystemModel.prototype.directMoveSingle = function (sourcePath, destPath, sourceName, destName) {
        return new Promise(function (resolve, reject) {
            var fullSource = path_1["default"].join(sourcePath, sourceName);
            if (!fs_1["default"].existsSync(fullSource)) {
                reject("FilesystemModel :: directMoveSingle() :: source does not exist '" + fullSource + "'");
            }
            var fullDest = path_1["default"].join(destPath, destName);
            fs_1["default"].renameSync(fullSource, fullDest);
            if (!fs_1["default"].existsSync(fullDest)) {
                reject("FilesystemModel :: directMoveSingle() :: unable to rename '" + fullSource + "' to " + fullDest);
            }
            resolve(fullDest);
        });
    };
    FilesystemModel.prototype.trash = function (sourcePath, filenames) {
        return __awaiter(this, void 0, void 0, function () {
            var row, trashPath, succeeded, failures;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!fs_1["default"].existsSync(sourcePath)) {
                            throw new Error("FilesystemModel :: trash() :: sourcePath: " + sourcePath + " does not exist.");
                        }
                        return [4 /*yield*/, this._settingsModel.getSingle("directories", "Trash")];
                    case 1:
                        row = _a.sent();
                        trashPath = row.value;
                        if (!fs_1["default"].existsSync(trashPath)) {
                            throw new Error("FilesystemModel :: trash() :: trash directory: " + trashPath + " does not exist.");
                        }
                        succeeded = [];
                        failures = [];
                        filenames.forEach(function (filename) {
                            var origFilePath = path_1["default"].join(sourcePath, filename);
                            var trashFilePath = path_1["default"].join(trashPath, filename);
                            fs_1["default"].renameSync(origFilePath, trashFilePath);
                            succeeded.push(filename);
                        });
                        return [2 /*return*/, {
                                succeeded: succeeded,
                                failures: failures
                            }];
                }
            });
        });
    };
    return FilesystemModel;
}());
exports["default"] = FilesystemModel;
//# sourceMappingURL=FilesystemModel.js.map