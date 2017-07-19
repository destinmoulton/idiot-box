export default class FileToMovieModel {
    constructor(ibdb){
        this._ibdb = ibdb;
        this._tableName = "file_to_movie";
    }

    add(fileID, movieID){
        return this.getSingleForMovie(movieID)
            .then((row)=>{
                if('file_id' in row){
                    return row;
                }
                const data = {
                    file_id: fileID,
                    movie_id: movieID
                };

                return this._ibdb.insert(data, this._tableName);
            })
            .then(()=>{
                return this.getSingle(fileID, movieID);
            })
        
    }
    
    getSingle(fileID, movieID){
        const where = {
            file_id: fileID,
            movie_id: movieID
        };
        return this._ibdb.getRow(where, this._tableName);
    }

    getSingleForMovie(movieID){
        const where = {
            movie_id: movieID
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