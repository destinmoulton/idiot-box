import Trakt from 'trakt.tv';

import ibdb from '../db/IBDB';
import traktConfig from '../config/trakt.config';

import FilesystemModel from '../models/FilesystemModel';
import IMDBScraperModel from '../models/IMDBScraperModel';
import MediaScraperModel from '../models/MediaScraperModel';
import SettingsModel from '../models/db/SettingsModel';

const filesystemModel = new FilesystemModel();
const imdbScraperModel = new IMDBScraperModel();
const mediaScraperModel = new MediaScraperModel(new Trakt(traktConfig));
const settingsModel = new SettingsModel(ibdb);

export default {
    filesystem: {
        dir: {
            get: {
                params: ['path'],
                func: (pathToList)=> filesystemModel.getDirList(pathToList)
            }
        }
    },
    imdb: {
        image: {
            get: {
                params: ['imdb_id'],
                func: (imdbID)=> imdbScraperModel.getPosterURL(imdbID)
            }
        }
    },
    mediascraper: {
        movies: {
            search: {
                params: ['search_string'],
                func: (searchString)=> mediaScraperModel.searchMovies(searchString)
            }
        }
    },
    settings: {
        category: {
            get: {
                params: ['category'],
                func: (category)=>settingsModel.getAllForCategory(category)
            },
        },
        editor: {
            add: {
                params: ['category', 'key', 'value'],
                func: (category, key, value)=> settingsModel.addSetting(category, key, value)
            },
            update: {
                params: ['id', 'category', 'key', 'value'],
                func: (id, category, key, value)=> settingsModel.updateSetting(id, category, key, value)
            },
            delete: {
                params: ['id'],
                func: (id)=>settingsModel.deleteSetting(id)
            }
        }
    },
    
}