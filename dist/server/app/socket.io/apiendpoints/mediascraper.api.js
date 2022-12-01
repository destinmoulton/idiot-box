import Trakt from "trakt.tv";
import config from "../../config";
import ibdb from "../../db/IBDB";
import MediaScraperModel from "../../models/MediaScraperModel";
import SettingsModel from "../../models/db/SettingsModel";
const settingsModel = new SettingsModel(ibdb);
const mediaScraperModel = new MediaScraperModel(new Trakt(config.trakt), settingsModel);
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
export default mediascraper;
//# sourceMappingURL=mediascraper.api.js.map