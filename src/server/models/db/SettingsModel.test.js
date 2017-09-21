import ibdb from '../../db/IBDB';

import SettingsModel from './SettingsModel';

describe("SettingsModel", ()=>{
    let settingsModel = {};
    beforeEach(()=>{
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
                settingsModel = new SettingsModel(ibdb);
            });
    });

    afterEach(()=>{
        ibdb.close();
    });
});