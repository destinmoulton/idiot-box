import logger from '../../logger';

export default class GenresModel {
    constructor(ibdb){
        this._ibdb = ibdb;

        this._tableName = "genres";
    }

    addGenreIfDoesntExist(slug){
        return this.getSingleBySlug(slug)
            .then((row)=>{
                logger.debug(typeof row);
                return row;
            });
    }

    addGenre(slug){
        const name = slug[0].toUpperCase() + slug.slice(1);
        const data = {
            slug,
            name
        };

        return this._ibdb.insert(data, this._tableName)
            .then(()=>{
                return this.getSingleBySlug(slug);
            });
    }

    getAll(){
        return this._ibdb.getAll({}, this._tableName, "slug ASC");
    }

    getSingleBySlug(slug){
        const where = {
            slug
        };
        return this._ibdb.getRow(where, this._tableName);
    }
}