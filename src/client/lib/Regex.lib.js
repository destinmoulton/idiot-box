
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
     * Get the S##E## from an episode filename.
     * 
     * ie. Desperate.Housewives.S01E04.mp4
     *     will return S01E04 
     *
     * @param string episodeFilename 
     */
    parseSeasonEpisodeDoublet(episodeFilename){
        let possibleIndex = episodeFilename.search(/S\d\dE\d\d/);

        if(possibleIndex > -1){
            return episodeFilename.substr(possibleIndex, 6);
        }
        return "";
    }
}

export default new Regex();