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
var FilesModel_1 = __importDefault(require("../../models/db/FilesModel"));
var FileToMovieModel_1 = __importDefault(require("../../models/db/FileToMovieModel"));
var GenresModel_1 = __importDefault(require("../../models/db/GenresModel"));
var MovieAPI_1 = __importDefault(require("../../models/MovieAPI"));
var MovieToGenreModel_1 = __importDefault(require("../../models/db/MovieToGenreModel"));
var MoviesModel_1 = __importDefault(require("../../models/db/MoviesModel"));
var filesModel = new FilesModel_1["default"](IBDB_1["default"]);
var fileToMovieModel = new FileToMovieModel_1["default"](IBDB_1["default"]);
var genresModel = new GenresModel_1["default"](IBDB_1["default"]);
var movieToGenreModel = new MovieToGenreModel_1["default"](IBDB_1["default"], genresModel);
var moviesModel = new MoviesModel_1["default"](IBDB_1["default"], movieToGenreModel);
var movieAPIModels = {
    filesModel: filesModel,
    fileToMovieModel: fileToMovieModel,
    movieToGenreModel: movieToGenreModel,
    moviesModel: moviesModel
};
var movieAPI = new MovieAPI_1["default"](movieAPIModels);
var movies = {
    movie: {
        "delete": {
            params: ["movie_id"],
            func: function (movieID) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, movieAPI.deleteSingle(movieID)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            }); }); }
        },
        update_status_tags: {
            params: ["movie_id", "status_tags"],
            func: function (movieID, statusTags) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, movieAPI.updateStatusTags(movieID, statusTags)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); }
        }
    },
    movies: {
        get_all: {
            params: [],
            func: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, moviesModel.getAll()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            }); }); }
        },
        get_all_with_file_info: {
            params: [],
            func: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, movieAPI.getAllMoviesWithFileInfo()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            }); }); }
        },
        get_all_starting_with: {
            params: ["starting_letter"],
            func: function (startingLetter) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, movieAPI.getMoviesStartingWith(startingLetter)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            }); }); }
        }
    }
};
exports["default"] = movies;
//# sourceMappingURL=movies.api.js.map