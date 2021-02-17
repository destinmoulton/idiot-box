import { IBDB } from "../../db/IBDB";

export default class FilesModel {
    _ibdb: IBDB;
    _tableName: string;
    constructor(ibdb) {
        this._ibdb = ibdb;

        this._tableName = "files";
    }

    async addFile(directory_setting_id, subpath, filename, mediatype) {
        const data = {
            directory_setting_id,
            subpath,
            filename,
            mediatype,
        };

        try {
            await this._ibdb.insert(data, this._tableName);
            return this.getSingleByDirectoryAndFilename(
                directory_setting_id,
                subpath,
                filename
            );
        } catch (err) {
            throw new Error(
                `FilesModel :: addFile :: failed to insert the file ${filename}. ${err}`
            );
        }
    }

    getSingle(fileID) {
        const where = {
            id: fileID,
        };

        return this._ibdb.getRow(where, this._tableName);
    }

    async getSingleByDirectoryAndFilename(
        directory_setting_id,
        subpath,
        filename
    ) {
        const query = {
            directory_setting_id,
            subpath,
            filename,
        };
        return await this._ibdb.getRow(query, this._tableName);
    }

    async getAllForDirectory(directory_setting_id, subpath) {
        const query = {
            directory_setting_id,
            subpath,
        };
        return await this._ibdb.getAll(query, this._tableName, "filename ASC");
    }

    async deleteSingle(fileID) {
        const where = {
            id: fileID,
        };

        return await this._ibdb.delete(where, this._tableName);
    }
}
