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
                return this.getSingle(category, key, value);
            });
    }
}