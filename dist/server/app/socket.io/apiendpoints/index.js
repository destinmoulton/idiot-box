"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const files_api_1 = __importDefault(require("./files.api"));
const filesystem_api_1 = __importDefault(require("./filesystem.api"));
const id_api_1 = __importDefault(require("./id.api"));
const imdb_api_1 = __importDefault(require("./imdb.api"));
const mediascraper_api_1 = __importDefault(require("./mediascraper.api"));
const movies_api_1 = __importDefault(require("./movies.api"));
const settings_api_1 = __importDefault(require("./settings.api"));
const shows_api_1 = __importDefault(require("./shows.api"));
//import videoplayer from './videoplayer.api';
const endpoints = {
    files: files_api_1.default,
    filesystem: filesystem_api_1.default,
    id: id_api_1.default,
    imdb: imdb_api_1.default,
    mediascraper: mediascraper_api_1.default,
    movies: movies_api_1.default,
    settings: settings_api_1.default,
    shows: shows_api_1.default,
    // videoplayer,
};
exports.default = endpoints;
//# sourceMappingURL=index.js.map