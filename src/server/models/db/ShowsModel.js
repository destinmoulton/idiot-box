import moment from 'moment';

export class ShowsModel {
    constructor(ibdb){
        this._ibdb = ibdb;

        this._tableName = "shows";
    }

    _prepareData(apiData, imageFilename){
        return {
            title: apiData.title,
            year: apiData.year,
            overview: apiData.overview,
            first_aired: moment(apiData.first_aired).format('X'),
            runtime: apiData.runtime,
            network: apiData.network,
            status: apiData.status,
            rating: apiData.rating,
            updated_at: moment(apiData.updated_at).format('X'),
            slug: apiData.slug,
            trakt_id: apiData.ids.trakt,
            tvdb_id: apiData.ids.tvdb,
            imdb_id: apiData.ids.imdb,
            tmdb_id: apiData.ids.tmdb,
            tvrage_id: apiData.ids.tvrage,
            image_filename: imageFilename
        };
    }

    addShow(apiData, imageFilename){
        const data = this._prepareData(apiData, imageFilename);

        return this._ibdb.insert(data, this._tableName)
            .then(()=>{
                return this.getSingleByTraktID(data.trakt_id);
            });
    }

    getSingleByTraktID(traktID){
        const where = {
            trakt_id: traktID
        };

        return this._ibdb.getRow(where, this._tableName);
    }

}