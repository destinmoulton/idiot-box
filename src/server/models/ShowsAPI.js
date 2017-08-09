import fs from 'fs';
import path from 'path';

import thumbConfig from '../config/thumbnails.config';

class ShowsAPI {
    constructor(models){
        this._filesModel = models.filesModel;
        this._fileToEpisodeModel = models.fileToEpisodeModel;
        this._showsModel = models.showsModel;
        this._showSeasonEpisodesModel = models.showSeasonEpisodesModel;
        this._showSeasonsModel = models.showSeasonsModel;
    }

    getAllShowsWithSeasonLockedInfo(){
        return this._showsModel.getAll()
                .then((shows)=>{
                    let showsToReturn = [];
                    let promisesToRun = [];
                    shows.forEach((show)=>{
                        const cmd = this._getSeasonLockedInfo(show);
                        promisesToRun.push(cmd);
                    })
                    return Promise.all(promisesToRun);
                })
    }

    _getSeasonLockedInfo(show){
        return this._showSeasonsModel.getSeasonsForShow(show.id)
                    .then((seasons)=>{
                        const newShow = Object.assign({}, show);

                        let countLocked = 0;
                        let countUnLocked = 0;
                        seasons.forEach((season)=>{
                            if(season.locked === 1){
                                countLocked++;
                            } else {
                                countUnLocked++;
                            }
                        });
                        
                        newShow['num_seasons_locked'] = countLocked;
                        newShow['num_seasons_unlocked'] = countUnLocked;
                        return Promise.resolve(newShow);
                    });
    }

    deleteSingleShow(showID){
        return this._removeEpisodes(showID)
                .then(()=>{
                    return this._showSeasonsModel.deleteAllForShow(showID);
                })
                .then(()=>{
                    return this._removeShowThumbnail(showID);
                })
                .then(()=>{
                    return this._showsModel.deleteSingle(showID);
                });
    }

    _removeShowThumbnail(showID){
        return this._showsModel.getSingle(showID)
                .then((show)=>{
                    const fullPath = path.join(thumbConfig.shows, show.image_filename);
                    if(!fs.existsSync(fullPath)){
                        return Promise.resolve(true);
                    }
                    return Promise.resolve(fs.unlinkSync(fullPath));
                })

    }

    _removeEpisodes(showID){
        return this._showSeasonEpisodesModel.getEpisodesForShow(showID)
                .then((episodes)=>{
                    let promisesToRun = [];

                    episodes.forEach((episode)=>{
                        let cmd = this._removeFileAssociations(episode.id);
                        promisesToRun.push(cmd);
                    });
                    Promise.all(promisesToRun);
                })
                .then(()=>{
                    return this._showSeasonEpisodesModel.deleteAllForShow(showID);
                })
    }

    _removeFileAssociations(episodeID){
        return this._fileToEpisodeModel.getSingleForEpisode(episodeID)
                .then((fileToEpisode)=>{
                    return this._filesModel.deleteSingle(fileToEpisode.file_id)
                            .then(()=>{
                                return this._fileToEpisodeModel.deleteSingle(fileToEpisode.file_id, episodeID);
                            });
                })
    }
}

export default ShowsAPI;