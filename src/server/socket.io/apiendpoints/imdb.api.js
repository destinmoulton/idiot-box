import IMDBScraperModel from '../models/IMDBScraperModel';

const imdbScraperModel = new IMDBScraperModel();

export default imdb = {
    image: {
        get: {
            params: ['imdb_id'],
            func: (imdbID)=> imdbScraperModel.getPosterURL(imdbID)
        }
    }
};