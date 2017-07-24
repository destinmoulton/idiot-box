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

    idMovie(movieInfo, fileInfo, imageInfo){
        const imageFilename = this._buildThumbFilename(movieInfo);
        return this._mediaScraperModel.downloadThumbnail("Movie", imageInfo.url, imageFilename)
                .then((imageFilename)=>{
                    return this._moviesModel.addMovie(movieInfo, imageFilename)
                })
                .then((movieRow)=>{
                    return this._filesModel.addFile(fileInfo.setting_id, fileInfo.subpath, fileInfo.filename, "movie")
                        .then((fileRow)=>{
                            return this._fileToMovieModel.add(fileRow.id, movieRow.id);
                        })
                })
    }

    idAndArchiveEpisode(epInfo, sourceInfo, destInfo){
        return this._filesystemModel.move(sourceInfo, destInfo)
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

    addShow(showInfo, imageInfo){
        const imageFilename = this._buildThumbFilename(showInfo);
        return this._mediaScraperModel.downloadThumbnail("Show", imageInfo.url, imageFilename)
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

    findID(fileInfo){
        const subpath = fileInfo.fullPath.slice(fileInfo.basePath.length + 1);
        return this._settingsModel.getSingleByCatAndVal("directories", fileInfo.basePath)
                .then((setting)=>{
                    if(!'id' in setting){
                        return {}
                    }
                    return this._filesModel.getSingleByDirectoryAndFilename(setting.id, subpath, fileInfo.filename)
                })
                .then((file)=>{
                    if(!'id' in file){
                        return {};
                    }

                    if(file.mediatype === "movie"){
                        return this._fileToMovieModel.getSingleForFile(file.id)
                                .then((fileToMovie)=>{
                                    return this._moviesModel.getSingle(fileToMovie.movie_id);
                                });
                    } else {
                        return {};
                    }
                })
    }

}