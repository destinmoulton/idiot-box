// Convert shows from Gaze to Idiot Box

import path from 'path';

import fs from 'fs-extra';
import sqlite from 'sqlite';
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


let gaze = {};

const gazeShowPosterPath = "/home/destin/Downloads/show_posters";
const gazePath = "/home/destin/Downloads/djanggazedb.sqlite3";

Promise.resolve()
    .then(()=> {
        return connectToDBs();
    })
    .then(()=>{
        return processShows();
        //return collateGazeFileDetails(918431)
        
    })
//    .then((row)=>{
        //console.log(row);
    //})
    .catch((err)=>console.log(err));

function connectToDBs(){
    return ibdb.connect(dbconfig)
            .then(()=> {
                return sqlite.open(gazePath);
            })
            .then((newDB)=>{
                gaze = newDB;
                return Promise.resolve(true);
            });
}

function processShows(){
    return getCurrentShows()
            .then((shows)=>{
                let promisesToRun = [];
                let count = 0;
                shows.forEach((show)=>{
                    //if(count < 2){
                        promisesToRun.push(addShowAndSeasonsAndEpisodes(show.trakt_id, show.poster_filename));
                    //}
                    count++;
                });
                return Promise.all(promisesToRun);
            })
}

function getCurrentShows(){
    const whereQuery = "SELECT trakt_id, poster_filename FROM gaze_shows ORDER BY title ASC";
    return gaze.all(whereQuery)
                .then((rows)=>{
                    return (rows===undefined) ? [] : rows;
                });
}

function addShowAndSeasonsAndEpisodes(showTraktID, showThumbFilename){
    return moveShowThumbnail(showThumbFilename)
            .then(()=>{
                return mediaScraperModel.getShowByTraktID(showTraktID);
            })
            .then((showInfo)=>{
                return showsModel.addShow(showInfo, showThumbFilename);
            })
            .then((show)=>{
                return mediaScraperModel.getShowSeasonsList(show.trakt_id)
                        .then((seasons)=>{
                            return showSeasonsModel.addArrayOfSeasons(seasons, show.id);
                        })
                        .then((addedSeasons)=>{
                            let promisesToRun = [];
                            addedSeasons.forEach((season)=>{
                                const prom = mediaScraperModel.getEpisodesForSeason(show.trakt_id, season.season_number)
                                                .then((episodesArr)=>{
                                                    return showSeasonEpisodesModel.addArrEpisodes(show.id, season.id, episodesArr);
                                                })
                                                .then((arrSeasonEpisodes)=>{
                                                    return addArrayOfFileInfo(arrSeasonEpisodes);
                                                })
                                promisesToRun.push(prom);
                            });
                            return Promise.all(promisesToRun);
                        })
            });
}

function addArrayOfFileInfo(arrSeasEpisodes){
    const promisesToRun = [];
    arrSeasEpisodes.forEach((seasEp)=>{
        promisesToRun.push(addSingleFileInfo(seasEp));
    });
    return Promise.all(promisesToRun);
}

function addSingleFileInfo(epInfo){
    return collateGazeFileDetails(epInfo.trakt_id)
            .then((fileInfo)=>{
                if(fileInfo === undefined){
                    return false;
                }
                return filesModel.addFile(3, fileInfo.subpath, fileInfo.filename, "show")
            })
            .then((fileRow)=>{
                return fileToEpisodeModel.add(fileRow.id, epInfo.show_id, epInfo.season_id, epInfo.id);
            })
}

function collateGazeFileDetails(traktID){
    return getGazeEpisodeByTraktID(traktID)
            .then((episode)=>{
                if(episode === undefined){
                    return undefined;
                }
                return getGazeEpisodeFileByEpisodeID(episode.id);
            })
            .then((fileEpisodeInfo)=>{
                if(fileEpisodeInfo === undefined){
                    return undefined;
                }

                return getGazeFileDetails(fileEpisodeInfo.mediafile_id);
            })
}

function getGazeEpisodeByTraktID(traktID){
    const whereQuery = "SELECT * FROM gaze_showseasonepisode WHERE trakt_id = ?";
    return gaze.get(whereQuery, traktID);
}

function getGazeEpisodeFileByEpisodeID(episodeID){
    const whereQuery = "SELECT * FROM gaze_mediafileepisodeinfo WHERE showseasonepisode_id = ?";
    return gaze.get(whereQuery, episodeID);
}

function getGazeFileDetails(fileID){
    const whereQuery = "SELECT * FROM gaze_mediafile WHERE id = ?";
    return gaze.get(whereQuery, fileID);
}

function moveShowThumbnail(filename){
    const sourcePath = path.join(gazeShowPosterPath, filename);
    const destPath = path.join(thumbconfig.shows, filename);
    fs.copySync(sourcePath, destPath);
    return Promise.resolve(filename);
}