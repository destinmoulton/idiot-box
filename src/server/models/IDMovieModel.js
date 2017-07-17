class IDMovieModal {
    constructor(mediaScraperModal, moviesModal, filesModel, fileToMovieModel){
        this._moviesModal = moviesModal;
        this._filesModel = filesModel,
        this._fileToMovieModel = fileToMovieModel;
        this._mediaScraperModal = mediaScraperModal;
    }

    movie(movieInfo, pathInfo, imageInfo){
        const imageFilename = movieInfo.title + "." + movieInfo.year;
        return this._mediaScraperModal.downloadThumbnail("Movie", imageInfo.url, imageFilename)
                .then((imageFilename)=>{
                    return this._moviesModal.addMovie(movieInfo, imageFilename)
                })
                .then((movieRow)=>{
                    return this._filesModel.addFile(pathInfo.setting_id, pathInfo.subpath, pathInfo.filename, "movie")
                        .then((fileRow)=>{
                            return this._fileToMovieModel.add(fileRow.id, movieRow.id);
                        })
                })

        
    }
}