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

    describe("Gets single by", ()=>{
        it("id [getSingleByID()]", ()=>{
            expect.assertions(2);
            return settingsModel.getSingleByID(3)
                    .then((res)=>{
                        expect(typeof res).toBe("object");
                        expect(res.key).toBe("Shows");
                    })
        });

        it("category and key [getSingle()]", ()=>{
            expect.assertions(2);
            return settingsModel.getSingle("directories", "Movies")
                    .then((res)=>{
                        expect(typeof res).toBe("object");
                        expect(res.key).toBe("Movies");
                    })
        })

        it("category and value [getSingleByCatAndVal(]", ()=>{
            expect.assertions(2);
            return settingsModel.getSingle("directories", "Downloads")
                    .then((res)=>{
                        expect(typeof res).toBe("object");
                        expect(res.key).toBe("Downloads");
                    })
        })
    })
    it("adds and a single setting [addSetting()]", ()=>{
        expect.assertions(3);
        return settingsModel.addSetting("sizes", "small", 42)
                .then((res)=>{
                    expect(res.category).toBe("sizes");
                    expect(res.key).toBe("small");
                    expect(res.value).toBe("42");
                });
    });

    
});