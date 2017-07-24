export default class FileToEpisodeModel {
    constructor(ibdb){
        this._ibdb = ibdb;
        this._tableName = "file_to_episode";
    }

    add(fileID, showID, seasonID, episodeID){
        return this.getSingleForEpisode(episodeID)
            .then((row)=>{
                if('file_id' in row){
                    return row;
                }
                const data = {
                    file_id: fileID,
                    show_id: showID,
                    season_id: seasonID,
                    episode_id: episodeID
                };

                return this._ibdb.insert(data, this._tableName);
            })
            .then(()=>{
                return this.getSingle(fileID, showID, seasonID, episodeID);
            })
        
    }
    
    getSingle(fileID, showID, seasonID, episodeID){
        const where = {
            file_id: fileID,
            show_id: showID,
            season_id: seasonID,
            episode_id: episodeID
        };
        return this._ibdb.getRow(where, this._tableName);
    }

    getSingleForEpisode(episodeID){
        const where = {
            episode_id: episodeID
        };
        return this._ibdb.getRow(where, this._tableName);
    }

    getSingleForFile(fileID){
        const where = {
            file_id: fileID
        };
        return this._ibdb.getRow(where, this._tableName);
    }
}