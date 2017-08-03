import logger from '../logger';

export default class EpisodeAPIModel {

    constructor(models){
        this._showSeasonEpisodesModel = models.showSeasonEpisodesModel;
        this._filesModel = models.filesModel;
        this._fileToEpisodeModel = models.fileToEpisodeModel;
    }

    getAllEpisodesWithFileInfo(showID, seasonNum){
        return this._showSeasonEpisodesModel.getEpisodesForSeasonNum(showID, seasonNum)
                .then((episodes)=>{
                    let promisesToRun = [];
                    
                    episodes.forEach((ep)=>{
                        let data = Object.assign({}, ep);
                        data['file_info'] = {};
                        
                        const cmd = this._fileToEpisodeModel.getSingleForEpisode(ep.id)
                                        .then((fileEp)=>{
                                            if(!fileEp.hasOwnProperty('file_id')){
                                                return Promise.resolve(data);
                                            }
                                            return this._filesModel.getSingle(fileEp.file_id)
                                                    .then((file)=>{
                                                        if(!file.hasOwnProperty('id')){
                                                            return Promise.resolve(data);
                                                        }
                                                        data.file_info = file;
                                                        return Promise.resolve(data);
                                                    });
                                        });
                        promisesToRun.push(cmd);
                    });

                    return Promise.all(promisesToRun);
                });
    }
}