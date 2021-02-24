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
var config_1 = __importDefault(require("../config"));
var MovieAPI = /** @class */ (function () {
    function MovieAPI(models) {
        this._filesModel = models.filesModel;
        this._fileToMovieModel = models.fileToMovieModel;
        this._moviesModel = models.moviesModel;
        this._movieToGenreModel = models.movieToGenreModel;
    }
    MovieAPI.prototype.getAllMoviesWithFileInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var movies, res, _i, movies_1, movie, data, fileToMovie, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this._moviesModel.getAll()];
                    case 1:
                        movies = _c.sent();
                        res = [];
                        _i = 0, movies_1 = movies;
                        _c.label = 2;
                    case 2:
                        if (!(_i < movies_1.length)) return [3 /*break*/, 6];
                        movie = movies_1[_i];
                        data = Object.assign({}, movie);
                        data["file_info"] = {};
                        return [4 /*yield*/, this._fileToMovieModel.getSingleForMovie(movie.id)];
                    case 3:
                        fileToMovie = _c.sent();
                        _b = (_a = res).push;
                        return [4 /*yield*/, this._collateMovieFileInfo(fileToMovie, data)];
                    case 4:
                        _b.apply(_a, [_c.sent()]);
                        _c.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6: return [2 /*return*/, res];
                }
            });
        });
    };
    MovieAPI.prototype.getMoviesStartingWith = function (startingLetter) {
        return __awaiter(this, void 0, void 0, function () {
            var movies, res, _i, movies_2, movie, data, fileToMovie, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this._moviesModel.getAllStartingWith(startingLetter)];
                    case 1:
                        movies = _c.sent();
                        res = [];
                        _i = 0, movies_2 = movies;
                        _c.label = 2;
                    case 2:
                        if (!(_i < movies_2.length)) return [3 /*break*/, 6];
                        movie = movies_2[_i];
                        data = Object.assign({}, movie);
                        data["file_info"] = {};
                        return [4 /*yield*/, this._fileToMovieModel.getSingleForMovie(movie.id)];
                    case 3:
                        fileToMovie = _c.sent();
                        _b = (_a = res).push;
                        return [4 /*yield*/, this._collateMovieFileInfo(fileToMovie, data)];
                    case 4:
                        _b.apply(_a, [_c.sent()]);
                        _c.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6: return [2 /*return*/, res];
                }
            });
        });
    };
    /**
     * Add file-to-movie information to the info object.
     *
     * @param FileToMovie fileToMovie
     * @param object infoObj for collation
     */
    MovieAPI.prototype._collateMovieFileInfo = function (fileToMovie, infoObj) {
        return __awaiter(this, void 0, void 0, function () {
            var file;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!fileToMovie.hasOwnProperty("file_id")) {
                            return [2 /*return*/, infoObj];
                        }
                        return [4 /*yield*/, this._filesModel.getSingle(fileToMovie.file_id)];
                    case 1:
                        file = _a.sent();
                        if (!file.hasOwnProperty("id")) {
                            return [2 /*return*/, infoObj];
                        }
                        infoObj.file_info = file;
                        return [2 /*return*/, infoObj];
                }
            });
        });
    };
    MovieAPI.prototype.deleteSingle = function (movieID) {
        return __awaiter(this, void 0, void 0, function () {
            var movie;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._moviesModel.getSingle(movieID)];
                    case 1:
                        movie = _a.sent();
                        if (!movie.hasOwnProperty("id")) {
                            return [2 /*return*/, Promise.reject("MovieAPI :: deleteSingle() :: Unable to find movie ${movieID}")];
                        }
                        return [4 /*yield*/, this._removeMovieThumbnail(movie)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this._movieToGenreModel.deleteForMovie(movieID)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this._removeFileAssociationForMovie(movieID)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this._moviesModel.deleteSingle(movieID)];
                    case 5: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MovieAPI.prototype._removeFileAssociationForMovie = function (movieID) {
        return __awaiter(this, void 0, void 0, function () {
            var fileToMovie;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._fileToMovieModel.getSingleForMovie(movieID)];
                    case 1:
                        fileToMovie = _a.sent();
                        if (!fileToMovie.hasOwnProperty("file_id")) {
                            // No file to remove
                            return [2 /*return*/, true];
                        }
                        return [4 /*yield*/, this._filesModel.deleteSingle(fileToMovie.file_id)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this._fileToMovieModel.deleteSingle(fileToMovie.file_id, movieID)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MovieAPI.prototype._removeMovieThumbnail = function (movie) {
        if (movie.image_filename === "") {
            return true;
        }
        var imagepaths = config_1["default"].paths.images;
        var fullPath = path_1["default"].join(imagepaths.base, imagepaths.movies, movie.image_filename);
        if (!fs_1["default"].existsSync(fullPath)) {
            return true;
        }
        var info = fs_1["default"].statSync(fullPath);
        if (info.isDirectory) {
            return true;
        }
        return fs_1["default"].unlinkSync(fullPath);
    };
    MovieAPI.prototype.updateStatusTags = function (movieID, statusTags) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._moviesModel.updateStatusTags(movieID, statusTags)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return MovieAPI;
}());
exports["default"] = MovieAPI;
//# sourceMappingURL=MovieAPI.js.map