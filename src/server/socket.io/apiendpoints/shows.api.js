import ibdb from '../../db/IBDB';
import logger from '../../logger';

import ShowsModel from '../../models/db/ShowsModel';
import ShowSeasonsModel from '../../models/db/ShowSeasonsModel';
import ShowSeasonEpisodesModel from '../../models/db/ShowSeasonEpisodesModel';

const showsModel = new ShowsModel(ibdb);
const showSeasonsModel = new ShowSeasonsModel(ibdb);
const showSeasonEpisodesModel = new ShowSeasonEpisodesModel(ibdb);

const shows = {
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