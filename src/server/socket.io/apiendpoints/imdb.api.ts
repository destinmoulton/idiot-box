import IMDBScraperModel from "../../models/IMDBScraperModel";

const imdbScraperModel = new IMDBScraperModel();

const imdb = {
    image: {
        get: {
            params: ["imdb_id"],
            func: async (imdbID) => await imdbScraperModel.getPosterURL(imdbID),
        },
    },
};

export default imdb;
