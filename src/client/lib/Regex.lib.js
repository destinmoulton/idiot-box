
class Regex {
    getShowName(showTitle){
        // Replace current periods
        let newTitle = showTitle.replace(/\./g, "");

        // Replace spaces and dashes with periods
        newTitle = newTitle.replace(/(\s|\-)/g, ".");

        // Replace everything else with blank
        return newTitle.replace(/[^\.a-zA-Z0-9]/g, "");
    }
}

export default new Regex();