"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var filesystem_api_1 = __importDefault(require("./filesystem.api"));
var id_api_1 = __importDefault(require("./id.api"));
var imdb_api_1 = __importDefault(require("./imdb.api"));
var mediascraper_api_1 = __importDefault(require("./mediascraper.api"));
var movies_api_1 = __importDefault(require("./movies.api"));
var settings_api_1 = __importDefault(require("./settings.api"));
var shows_api_1 = __importDefault(require("./shows.api"));
//import videoplayer from './videoplayer.api';
var endpoints = {
    filesystem: filesystem_api_1["default"],
    id: id_api_1["default"],
    imdb: imdb_api_1["default"],
    mediascraper: mediascraper_api_1["default"],
    movies: movies_api_1["default"],
    settings: settings_api_1["default"],
    shows: shows_api_1["default"]
};
exports["default"] = endpoints;
//# sourceMappingURL=index.js.map