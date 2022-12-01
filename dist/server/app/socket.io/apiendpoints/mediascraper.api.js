"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const trakt_tv_1 = __importDefault(require("trakt.tv"));
const config_1 = __importDefault(require("../../config"));
const IBDB_1 = __importDefault(require("../../db/IBDB"));
const MediaScraperModel_1 = __importDefault(require("../../models/MediaScraperModel"));
const SettingsModel_1 = __importDefault(require("../../models/db/SettingsModel"));
const settingsModel = new SettingsModel_1.default(IBDB_1.default);
const mediaScraperModel = new MediaScraperModel_1.default(new trakt_tv_1.default(config_1.default.trakt), settingsModel);
const mediascraper = {
    movies: {
        search: {
            params: ["search_string"],
            func: async (searchString) => {
                return await mediaScraperModel.searchMovies(searchString);
            },
        },
    },
    shows: {
        search: {
            params: ["search_string"],
            func: async (searchString) => {
                return await mediaScraperModel.searchShows(searchString);
            },
        },
    },
};
exports.default = mediascraper;
//# sourceMappingURL=mediascraper.api.js.map