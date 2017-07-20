import Trakt from 'trakt.tv';

import traktConfig from '../../config/trakt.config';

import ibdb from '../../db/IBDB';
import MediaScraperModel from '../../models/MediaScraperModel';
import SettingsModel from '../../models/db/SettingsModel';

const settingsModel = new SettingsModel(ibdb);

const mediaScraperModel = new MediaScraperModel(new Trakt(traktConfig), settingsModel);

const mediascraper = {
    movies: {
        search: {
            params: ['search_string'],
            func: (searchString)=> mediaScraperModel.searchMovies(searchString)
        }
    },
    shows: {
        search: {
            params: ['search_string'],
            func: (searchString)=> mediaScraperModel.searchShows(searchString)
        }
    }
};

export default mediascraper;