
class Regex {
    sanitizeShowTitle(showTitle){
        // Replace current periods
        let newTitle = showTitle.replace(/\./g, "");

        // Replace spaces and dashes with periods
        newTitle = newTitle.replace(/(\s|\-)/g, ".");

        // Replace everything else with blank
        return newTitle.replace(/[^\.a-zA-Z0-9]/g, "");
    }

    /**
     * Determine if a filename is a video.
     * 
     * @param string possibleVideoFilename 
     */
    isVideoFile(possibleVideoFilename){
        const regx = /(\.mp4|\.mkv|\.avi)$/;
        return ( possibleVideoFilename.search(regx) > -1 ) ? true: false;
    }
}

export default new Regex();