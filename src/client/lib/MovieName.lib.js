const FORMAT_NAMES = [
    "avi",
    "ac3",
    "aac",
    "hevc",
    "mkv",
    "mp3",
    "mp4",
    "x264",
    "x265"
];
const MEDIA_NAMES = [
    "bluray",
    "brrip",
    "dvd",
    "dvdr",
    "dvdscr",
    "hdrip",
    "web",
    "xvid"
];
const RESOLUTION_NAMES = ["480", "480p", "720", "720p", "1080", "1080p", "4k"];

class MovieNameLib {
    getMovieFilename(movieFilename, movie) {
        const ext = movieFilename.split(".").pop();

        const movieName = this.getMovieTitleAndYear(movie);

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

    /**
     * Convert the movie name into an array.
     * Spaces become periods. Periods are the split point.
     *
     * @param string filename
     */
    getUsefulMovieNameParts(filename) {
        // Make spaces into periods and split on periods
        const parts = filename
            .replace(/[^\w]/g, " ")
            .replace(/(\s+)/g, ".")
            .split(".");

        return this._filterUnwantedFilenameParts(parts);
    }

    /**
     * A movie file is frequently filled with words that
     * are not condusive to a search.
     *
     * ie. in the filename array: ['Transformers', 'BluRay', '1080p', 'mkv']
     *     the "BluRay", "1080p", and "mkv" are not useful for a search
     *
     * @param array filenameParts
     */
    _filterUnwantedFilenameParts(filenameParts) {
        const unwanted = [...FORMAT_NAMES, ...MEDIA_NAMES, ...RESOLUTION_NAMES];

        return filenameParts.filter(part => {
            return unwanted.indexOf(part.toLowerCase()) < 0;
        });
    }
}

export default MovieNameLib;
