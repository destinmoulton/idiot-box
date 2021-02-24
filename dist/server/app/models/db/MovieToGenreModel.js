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
var MovieToGenreModel = /** @class */ (function () {
    function MovieToGenreModel(ibdb, genresModel) {
        this._ibdb = ibdb;
        this._genresModel = genresModel;
        this._tableName = "movie_to_genre";
    }
    MovieToGenreModel.prototype.addMovieToArrayGenres = function (movieID, genreArray) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                genreArray.forEach(function (genreSlug) { return __awaiter(_this, void 0, void 0, function () {
                    var genreInfo;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this._genresModel.addGenre(genreSlug)];
                            case 1:
                                genreInfo = _a.sent();
                                return [4 /*yield*/, this.addMovieToGenre(movieID, genreInfo.id)];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    MovieToGenreModel.prototype.addMovieToGenre = function (movieID, genreID) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            movie_id: movieID,
                            genre_id: genreID
                        };
                        return [4 /*yield*/, this._ibdb.insert(data, this._tableName)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getSingleByMovieAndGenre(movieID, genreID)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MovieToGenreModel.prototype.getAllGenresForMovie = function (movieID) {
        return __awaiter(this, void 0, void 0, function () {
            var where, movieToGenres, genres, _i, movieToGenres_1, link, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        where = {
                            movie_id: movieID
                        };
                        return [4 /*yield*/, this._ibdb.getAll(where, this._tableName)];
                    case 1:
                        movieToGenres = _c.sent();
                        genres = [];
                        _i = 0, movieToGenres_1 = movieToGenres;
                        _c.label = 2;
                    case 2:
                        if (!(_i < movieToGenres_1.length)) return [3 /*break*/, 5];
                        link = movieToGenres_1[_i];
                        _b = (_a = genres).push;
                        return [4 /*yield*/, this._genresModel.getSingle(link.genre_id)];
                    case 3:
                        _b.apply(_a, [_c.sent()]);
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, genres.sort(this._sortGenresByName)];
                }
            });
        });
    };
    MovieToGenreModel.prototype.getAllMoviesForGenre = function (genreID) {
        return __awaiter(this, void 0, void 0, function () {
            var where;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        where = {
                            genre_id: genreID
                        };
                        return [4 /*yield*/, this._ibdb.getAll(where, this._tableName)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MovieToGenreModel.prototype.getSingleByMovieAndGenre = function (movieID, genreID) {
        return __awaiter(this, void 0, void 0, function () {
            var where;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        where = {
                            movie_id: movieID,
                            genre_id: genreID
                        };
                        return [4 /*yield*/, this._ibdb.getRow(where, this._tableName)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MovieToGenreModel.prototype.deleteForMovie = function (movieID) {
        return __awaiter(this, void 0, void 0, function () {
            var where;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        where = {
                            movie_id: movieID
                        };
                        return [4 /*yield*/, this._ibdb["delete"](where, this._tableName)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Sort the array of genres by the 'name' property
    MovieToGenreModel.prototype._sortGenresByName = function (a, b) {
        if (a.slug < b.slug) {
            return -1;
        }
        if (a.slug > b.slug) {
            return 1;
        }
        return 0;
    };
    return MovieToGenreModel;
}());
exports["default"] = MovieToGenreModel;
//# sourceMappingURL=MovieToGenreModel.js.map