export default class FilesModel {
    constructor(ibdb){
        this._ibdb = ibdb;

        this._tableName = "files";
    }

    addFile(directory_setting_id, subpath, filename, mediatype){
        const data = {
            directory_setting_id, subpath, filename, mediatype
        };

        return this._ibdb.insert(data, this._tableName)
            .then(()=>{
                return this.getSingleByDirectoryAndFilename(directory_setting_id, subpath, filename);
            });
    }

    getSingleByDirectoryAndFilename(directory_setting_id, subpath, filename){
        const query = {
            directory_setting_id,
            subpath,
            filename
        };
        return this._ibdb.getRow(query, this._tableName);
    }

    getAllForDirectory(directory_setting_id, subpath){
        const query = {
            directory_setting_id,
            subpath,
            filename
        };
        return this._ibdb.getAll(query, this._tableName, "filename ASC");
    }
}