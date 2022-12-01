"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IMDBScraperModel_1 = __importDefault(require("../../models/IMDBScraperModel"));
const imdbScraperModel = new IMDBScraperModel_1.default();
const imdb = {
    image: {
        get: {
            params: ["imdb_id"],
            func: async (imdbID) => await imdbScraperModel.getPosterURL(imdbID),
        },
    },
};
exports.default = imdb;
//# sourceMappingURL=imdb.api.js.map