import path from 'path';

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

    it("adds and gets a single setting", ()=>{
        expect.assertions(3);
        return settingsModel.addSetting("sizes", "small", 42)
                .then((res)=>{
                    expect(res.category).toBe("sizes");
                    expect(res.key).toBe("small");
                    expect(res.value).toBe("42");
                });
    });
});