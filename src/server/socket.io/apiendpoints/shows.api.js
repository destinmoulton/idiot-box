import ibdb from '../../db/IBDB';
import logger from '../../logger';

import EpisodeAPIModel from '../../models/EpisodeAPIModel';
import FilesModel from '../../models/db/FilesModel';
import FileToEpisodeModel from '../../models/db/FileToEpisodeModel';
import ShowsModel from '../../models/db/ShowsModel';
import ShowSeasonsModel from '../../models/db/ShowSeasonsModel';
import ShowSeasonEpisodesModel from '../../models/db/ShowSeasonEpisodesModel';

const filesModel = new FilesModel(ibdb);
const fileToEpisodeModel = new FileToEpisodeModel(ibdb);
const showsModel = new ShowsModel(ibdb);
const showSeasonsModel = new ShowSeasonsModel(ibdb);
const showSeasonEpisodesModel = new ShowSeasonEpisodesModel(ibdb);

const episodeAPIConfig = {
    filesModel,
    fileToEpisodeModel,
    showSeasonEpisodesModel
};

const episodeAPIModel = new EpisodeAPIModel(episodeAPIConfig);

const shows = {
    show: {
        get_for_slug: {
            params: ['slug'],
            func: (slug)=> showsModel.getSingleBySlug(slug)
        }
    },
    shows: {
        get: {
            params: [],
            func: ()=> showsModel.getAll()
        }
    },
    seasons: {
        get: {
            params: ['show_id'],
            func: (showID)=> showSeasonsModel.getSeasonsForShow(showID)
        }
    },
    episodes: {
        get: {
            params: ['show_id', 'season_id'],
            func: (showID, seasonID)=> showSeasonEpisodesModel.getEpisodesForSeason(showID, seasonID)
        },
        get_all_with_file_info: {
            params: ['show_id', 'season_id'],
            func: (showID, seasonID)=> episodeAPIModel.getAllEpisodesWithFileInfo(showID, seasonID)
        }
    },
    episode: {
        collate: {
            params: ['episode_info'],
            func: (episodeInfo)=> showSeasonEpisodesModel.collateEpisodeInfo(episodeInfo, showsModel, showSeasonsModel)
        }
    }
};

export default shows;