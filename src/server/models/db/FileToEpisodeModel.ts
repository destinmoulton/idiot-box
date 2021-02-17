import { IBDB } from "../../db/IBDB";
export default class FileToEpisodeModel {
    _ibdb: IBDB;
    _tableName: string;
    constructor(ibdb) {
        this._ibdb = ibdb;
        this._tableName = "file_to_episode";
    }

    async add(fileID, showID, seasonID, episodeID) {
        // Check if the file already exists
        const row = await this.getSingleForEpisode(episodeID);

        if ("file_id" in row) {
            return row;
        }
        const data = {
            file_id: fileID,
            show_id: showID,
            season_id: seasonID,
            episode_id: episodeID,
        };

        await this._ibdb.insert(data, this._tableName);
        return await this.getSingle(fileID, showID, seasonID, episodeID);
    }

    async getSingle(fileID, showID, seasonID, episodeID) {
        const where = {
            file_id: fileID,
            show_id: showID,
            season_id: seasonID,
            episode_id: episodeID,
        };
        return await this._ibdb.getRow(where, this._tableName);
    }

    async getSingleForEpisode(episodeID) {
        const where = {
            episode_id: episodeID,
        };
        return await this._ibdb.getRow(where, this._tableName);
    }

    async getSingleForFile(fileID) {
        const where = {
            file_id: fileID,
        };
        return await this._ibdb.getRow(where, this._tableName);
    }

    async deleteSingle(fileID, episodeID) {
        const where = {
            file_id: fileID,
            episode_id: episodeID,
        };

        return await this._ibdb.delete(where, this._tableName);
    }
    async deleteSingleForEpisode(episodeID) {
        const where = {
            episode_id: episodeID,
        };

        return await this._ibdb.delete(where, this._tableName);
    }
}
