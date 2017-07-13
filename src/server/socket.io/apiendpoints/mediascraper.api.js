import Trakt from 'trakt.tv';

import traktConfig from '../../config/trakt.config';

import MediaScraperModel from '../../models/MediaScraperModel';

const mediaScraperModel = new MediaScraperModel(new Trakt(traktConfig));

export default mediascraper = {
    movies: {
        search: {
            params: ['search_string'],
            func: (searchString)=> mediaScraperModel.searchMovies(searchString)
        }
    }
};