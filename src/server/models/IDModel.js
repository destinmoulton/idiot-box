import logger from '../logger';

export default class IDModel {
    constructor(models){
        this._filesystemModel = models.filesystemModel,
        this._filesModel = models.filesModel;
        this._fileToEpisodeModel = models.fileToEpisodeModel;
        this._fileToMovieModel = models.fileToMovieModel;
        this._mediaScraperModel = models.mediaScraperModel;
        this._moviesModel = models.moviesModel;
        this._settingsModel = models.settingsModel;
        this._showsModel = models.showsModel;
        this._showSeasonsModel = models.showSeasonsModel;
        this._showSeasonEpisodesModel = models.showSeasonEpisodesModel;
    }

    idAndArchiveMovie(movieInfo, imageURL, sourceInfo, destInfo){
        const imageFilename = this._buildThumbFilename(movieInfo);
        return this._filesystemModel.moveInSetDir(sourceInfo, destInfo, "Movies")
                .then(()=>{
                    if( imageURL !== ""){
                        return this._mediaScraperModel.downloadThumbnail("movies", imageURL, imageFilename)
                    }
                    return Promise.resolve("");
                })
                .then((imageFilename)=>{
                    return this._moviesModel.addMovie(movieInfo, imageFilename)
                })
                .then((movieRow)=>{
                    return this._settingsModel.getSingle("directories", "Movies")
                            .then((destSetting)=>{
                                return this._filesModel.addFile(destSetting.id, destInfo.subpath, destInfo.filename, "movie");
                            })
                            .then((fileRow)=>{
                                return this._fileToMovieModel.add(fileRow.id, movieRow.id);
                            });
                });
    }

    idAndArchiveEpisode(epInfo, sourceInfo, destInfo){
        return this._filesystemModel.moveInSetDir(sourceInfo, destInfo, "Shows")
                .then(()=>{
                    return this._settingsModel.getSingle("directories", "Shows")
                })
                .then((destSetting)=>{
                    return this._filesModel.addFile(destSetting.id, destInfo.subpath, destInfo.filename, "show");
                })
                .then((fileRow)=>{
                    return this._fileToEpisodeModel.add(fileRow.id, epInfo.show_id, epInfo.season_id, epInfo.episode_id);
                })
    }

    idAndArchiveMultipleEpisodes(sourcePathInfo, destSubpath, idInfo){
        const episodesToMove = idInfo.episodes;
        const filenames = Object.keys(episodesToMove);

        let promisesToRun = [];

        filenames.forEach((filename)=>{
            const episode = episodesToMove[filename];
            const dest = {
                filename: episode.newFilename,
                subpath: destSubpath
            };

            const source = {
                setting_id: sourcePathInfo.setting_id,
                subpath: sourcePathInfo.subpath,
                filename
            };

            const epInfo = {
                show_id: idInfo.show_id,
                season_id: idInfo.season_id,
                episode_id: episode.selectedEpisodeID
            }

            promisesToRun.push(this.idAndArchiveEpisode(epInfo, source, dest));
        });

        return Promise.all(promisesToRun);
    }

    removeMultipleIDs(itemsToRemove){
        let promisesToRun = [];
        itemsToRemove.forEach((item)=>{
            promisesToRun.push(this.removeSingleID(item.assocData));
        });

        return Promise.all(promisesToRun);
    }

    removeSingleID(idInfo){
        if(idInfo.type === "movie"){
            return this._filesModel.deleteSingle(idInfo.file_id)
                    .then(()=>{
                        return this._fileToMovieModel.deleteSingle(idInfo.file_id, idInfo.movie_id);
                    })
                    .then(()=>{
                        return this._moviesModel.deleteSingle(idInfo.movie_id);
                    })
        } else if (idInfo.type === "show"){
            return this._filesModel.deleteSingle(idInfo.file_id)
                    .then(()=>{
                        return this._fileToEpisodeModel.deleteSingle(idInfo.file_id, idInfo.episode_id);
                    })
        }
    }

    addShow(showInfo, imageInfo){
        const imageFilename = this._buildThumbFilename(showInfo);
        return this._mediaScraperModel.downloadThumbnail("shows", imageInfo.url, imageFilename)
                .then((imageFilename)=>{
                    return this._showsModel.addShow(showInfo, imageFilename)
                })
                .then((show)=>{
                    return this._mediaScraperModel.getShowSeasonsList(show.trakt_id)
                            .then((seasons)=>{
                                return this._showSeasonsModel.addArrayOfSeasons(seasons, show.id)
                            })
                            .then((addedSeasons)=>{
                                let promisesToRun = [];
                                addedSeasons.forEach((season)=>{
                                    const prom = this._mediaScraperModel.getEpisodesForSeason(show.trakt_id, season.season_number)
                                                    .then((episodesArr)=>{
                                                        return this._showSeasonEpisodesModel.addArrEpisodes(show.id, season.id, episodesArr)
                                                    })
                                    promisesToRun.push(prom);
                                });
                                return Promise.all(promisesToRun);
                            })
                });
    }
    
    _buildThumbFilename(mediaInfo){
        return mediaInfo.title + "." + mediaInfo.year;
    }
}