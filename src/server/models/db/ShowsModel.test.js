
import ibdb from '../../db/IBDB';

import ShowsModel from './ShowsModel';

describe("ShowsModel", ()=>{
    let showsModel = {};
    
    beforeEach(() => {
        const dbConfig = {
            inMemory: true
        };

        const migConfig = {
            migrationsPath: path.resolve(__dirname, '../../../migrations')
        };

        return ibdb.connect(dbConfig)
            .then(() => {
                return ibdb._db.migrate(migConfig);
            })
            .then(()=>{
                showsModel = new ShowsModel(ibdb);
            });
    });

    afterEach(()=>{
        ibdb.close();
    });
});