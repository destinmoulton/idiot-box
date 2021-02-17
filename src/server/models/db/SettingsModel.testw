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

    describe("Adds multiple and", ()=>{
        beforeEach(()=>{
            return settingsModel.addSetting("crackers", "Nabisco", "Ritz")
                    .then(()=>{
                        return settingsModel.addSetting("crackers", "Keebler", "Cheez-It");
                    })
                    .then(()=>{
                        return settingsModel.addSetting("cookies", "Nabisco", "Oreos");
                    });
        });

        it("gets all [getAll()]", ()=>{
            expect.assertions(3);
            return settingsModel.getAll()
                    .then((res)=>{
                        expect(res.length).toBe(8);
                        expect(res[3].key).toBe("Trash");
                        expect(res[7].value).toBe("Oreos");
                    });
        });

        it("updates single [updateSetting()]", ()=>{
            expect.assertions(6);
            return settingsModel.updateSetting(7, "crackers", "Nabadsco", "Nachos")
                    .then((res)=>{
                        expect(res.key).toBe("Nabadsco");
                        expect(res.value).toBe("Nachos");
                        return settingsModel.getSingleByID(6);
                    })
                    .then((res)=>{
                        expect(res.key).toBe("Nabisco");
                        expect(res.value).toBe("Ritz");
                        return settingsModel.getSingleByID(8);
                    })
                    .then((res)=>{
                        expect(res.key).toBe("Nabisco");
                        expect(res.value).toBe("Oreos");
                    })
        });

        it("deletes single [deleteSetting()]", ()=>{
            expect.assertions(3);
            return settingsModel.deleteSetting(6)
                    .then(()=>{
                        return settingsModel.getAll();
                    })
                    .then((res)=>{
                        expect(res.length).toBe(7);
                        expect(res[5].key).toBe("Keebler");
                        expect(res[6].value).toBe("Oreos");
                    })
        });
    });
});