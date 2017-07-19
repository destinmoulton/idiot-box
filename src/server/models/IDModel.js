export default class IDModel {
    constructor(models){
        this._filesModel = models.filesModel;
        this._fileToMovieModel = models.fileToMovieModel;
        this._mediaScraperModel = models.mediaScraperModel;
        this._moviesModel = models.moviesModel;
        this._settingsModel = models.settingsModel;
        
    }

    idMovie(movieInfo, fileInfo, imageInfo){
        const imageFilename = movieInfo.title + "." + movieInfo.year;
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