import Trakt from 'trakt.tv';

import ibdb from '../db/IBDB';

import FilesModel from '../models/db/FilesModel';
import FileToEpisodeModel from '../models/db/FileToEpisodeModel';
import MediaScraperModel from '../models/MediaScraperModel';
import SettingsModel from '../models/db/SettingsModel';
import ShowsModel from '../models/db/ShowsModel';
import ShowSeasonsModel from '../models/db/ShowSeasonsModel';
import ShowSeasonEpisodesModel from '../models/db/ShowSeasonEpisodesModel';

import dbconfig from '../config/db.config';
import thumbconfig from '../config/thumbnails.config';
import traktConfig from '../config/trakt.config';

const settingsModel = new SettingsModel(ibdb);
const filesModel = new FilesModel(ibdb);
const fileToEpisodeModel = new FileToEpisodeModel(ibdb);
const mediaScraperModel = new MediaScraperModel(new Trakt(traktConfig), settingsModel);
const showsModel = new ShowsModel(ibdb);
const showSeasonsModel = new ShowSeasonsModel(ibdb);
const showSeasonEpisodesModel = new ShowSeasonEpisodesModel(ibdb);

Promise.resolve()
    .then(()=> {
        return ibdb.connect(dbconfig);
    })
    .then(()=>{
        return compareShows();
    })
    .catch((err)=>console.error(err));


function compareShows(){
    return showsModel.getAll()
            .then((shows)=>{
                let promisesToRun = [];
                shows.forEach((show)=>{
                    const cmd = compareSeasons(show.id, show.trakt_id);
                    promisesToRun.push(cmd);
                });
                Promise.all(promisesToRun);
            });
}

function compareSeasons(showID, showTraktID){
    return mediaScraperModel.getShowSeasonsList(showTraktID)
            .then((traktSeasons)=>{
                let promisesToRun = [];
                traktSeasons.forEach((traktSeason)=>{
                    const cmd = processSeason(traktSeason, showID, showTraktID);
                    promisesToRun.push(cmd);
                });
                return Promise.all(promisesToRun);
            });
}

function processSeason(traktSeason, showID, showTraktID){
    return showSeasonsModel.getSingleByTraktID(traktSeason.ids.trakt)
            .then((showSeason)=>{
                
                if(!showSeason.hasOwnProperty('id')){
                    // Add the season
                    return showSeasonsModel.addShowSeason(showID, traktSeason);
                }
                return Promise.resolve(showSeason);
            })
            .then((showSeason)=>{
                if(showSeason.locked !== 1){
                    return compareEpisodes(showID, showSeason.id, showTraktID, showSeason.season_number);
                }
                return Promise.resolve(true);
            });
}

function compareEpisodes(showID, seasonID, showTraktID, seasonNum){
    return mediaScraperModel.getEpisodesForSeason(showTraktID, seasonNum)
            .then((traktEpisodes)=>{
                let promisesToRun = [];
                traktEpisodes.forEach((traktEpisode)=>{
                    const cmd = processEpisode(showID, seasonID, traktEpisode);
                    promisesToRun.push(cmd);
                });
                return Promise.all(promisesToRun);
            });
}

function processEpisode(showID, seasonID, traktEpisode){
    return showSeasonEpisodesModel.getSingleByTraktID(traktEpisode.ids.trakt)
            .then((seasonEpisode)=>{
                if(!seasonEpisode.hasOwnProperty('id')){
                    // Add the episode
                    return showSeasonEpisodesModel.addEpisode(showID, seasonID, traktEpisode);
                } else {
                    return showSeasonEpisodesModel.updateEpisode(showID, seasonID, seasonEpisode.id, traktEpisode);
                }
            });
}