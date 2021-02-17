import { IBDB } from "../../db/IBDB";
export default class FileToMovieModel {
    _ibdb: IBDB;
    _tableName: string;
    constructor(ibdb) {
        this._ibdb = ibdb;
        this._tableName = "file_to_movie";
    }

    async add(fileID, movieID) {
        const row = await this.getSingleForMovie(movieID);
        if ("file_id" in row) {
            return row;
        }
        const data = {
            file_id: fileID,
            movie_id: movieID,
        };

        await this._ibdb.insert(data, this._tableName);
        return await this.getSingle(fileID, movieID);
    }

    async getSingle(fileID, movieID) {
        const where = {
            file_id: fileID,
            movie_id: movieID,
        };
        return await this._ibdb.getRow(where, this._tableName);
    }

    async getSingleForMovie(movieID) {
        const where = {
            movie_id: movieID,
        };
        return await this._ibdb.getRow(where, this._tableName);
    }

    async getSingleForFile(fileID) {
        const where = {
            file_id: fileID,
        };
        return await this._ibdb.getRow(where, this._tableName);
    }

    async deleteSingle(fileID, movieID) {
        const where = {
            file_id: fileID,
            movie_id: movieID,
        };
        return await this._ibdb.delete(where, this._tableName);
    }
}
