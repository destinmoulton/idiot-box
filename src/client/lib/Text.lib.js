
class Text{
    /**
     * Truncate a string to length
     * followed by the suffix.
     * 
     * @param number length 
     * @param string suffix 
     */
    truncate(str, length, suffix = "..."){
        let shortString = str.substring(0, length);

        if(str.length > length){
            shortString += suffix;
        }

        return shortString;
    }
}

export default new Text();