import filesystem from './filesystem.api';
import id from './id.api';
import imdb from './imdb.api';
import mediascraper from './mediascraper.api';
import movies from './movies.api';
import settings from './settings.api';
import shows from './shows.api';
import videoplayer from './videoplayer.api';

const endpoints = {
    filesystem,
    id,
    imdb,
    mediascraper,
    movies,
    settings,
    shows,
    videoplayer
}

export default endpoints;