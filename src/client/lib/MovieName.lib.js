class MovieNameLib {
    getMovieFilename(movieFilename, movie) {
        const ext = movieFilename.split(".").pop();

        const movieName = this._getMovieTitleAndYear(movie);

        return movieName + "." + ext;
    }

    getMovieTitleAndYear(movie) {
        const movieName = this._getCleanMovieName(movie);

        return movieName + "." + movie.year.toString();
    }

    _getCleanMovieName(movie) {
        // Replace current periods
        let newName = movie.title.replace(/\./g, "");

        // Replace spaces and dashes with periods
        newName = newName.replace(/(\s|\-)/g, ".");

        // Replace everything else with blank
        return newName.replace(/[^\.a-zA-Z0-9]/g, "");
    }
}

export default MovieNameLib;
