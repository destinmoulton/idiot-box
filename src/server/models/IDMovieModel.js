export default class IDMovieModal {
    constructor(mediaScraperModal, moviesModal, filesModel, fileToMovieModel){
        this._moviesModal = moviesModal;
        this._filesModel = filesModel,
        this._fileToMovieModel = fileToMovieModel;
        this._mediaScraperModal = mediaScraperModal;
    }

    runID(movieInfo, fileInfo, imageInfo){
        const imageFilename = movieInfo.title + "." + movieInfo.year;
        return this._mediaScraperModal.downloadThumbnail("Movie", imageInfo.url, imageFilename)
                .then((imageFilename)=>{
                    return this._moviesModal.addMovie(movieInfo, imageFilename)
                })
                .then((movieRow)=>{
                    return this._filesModel.addFile(fileInfo.setting_id, fileInfo.subpath, fileInfo.filename, "movie")
                        .then((fileRow)=>{
                            return this._fileToMovieModel.add(fileRow.id, movieRow.id);
                        })
                })

        
    }
}