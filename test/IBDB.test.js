import path from 'path';

import logger from '../dist/server/app/logger';

import ibdb from '../dist/server/app/db/IBDB';

import { doesErrorExist } from '../dist/server/app/error';

describe("IBDB",()=>{
    
    test("error on nonexistent database file", ()=>{
        const config = {
            filename: 'nonexistingFileName'
        }
        expect.assertions(1);
        return ibdb.connect(config)
            .then((newDB)=>{
                expect(ibdb.isConnected()).toBe(false);
                ibdb.close();
            })
            .catch((err)=>{
                expect(err).toBe("IBDB :: connect :: File does not exist.");
            });
    });

    test("connects to test database", ()=>{
        const config = {
            filename: path.join(__dirname, '/data/idiot-box-testdb.sqlite3')
        }
        expect.assertions(2);
        return ibdb.connect(config)
            .then((newDB)=>{
                expect(ibdb.isConnected()).toBe(true);
                ibdb.close();
                expect(ibdb.isConnected()).toBe(false);
            })
            .catch((err)=>{
                logger.error("connects to test database");
                logger.error(err);
                expect(err).toBeUndefined();
            });
    });

    test("connects to in memory database", ()=>{
        const config = {
            inMemory: true
        }
        expect.assertions(2);
        return ibdb.connect(config)
            .then((newDB)=>{
                expect(ibdb.isConnected()).toBe(true);
                ibdb.close();
                expect(ibdb.isConnected()).toBe(false);
            })
            .catch((err)=>{
                logger.error("connects to in memory database");
                logger.error(err);
                expect(err).toBeUndefined();
            });
    });

    describe("performs queries", ()=>{
        beforeEach(()=>{
            const dbConfig = {
                inMemory: true
            };

            const migConfig = {
                migrationsPath: path.resolve(__dirname, '../dist/server/migrations')
            };

            return ibdb.connect(dbConfig)
                    .then(()=>{
                        return ibdb._db.migrate(migConfig);
                    });
        });

        afterEach(()=>{
            ibdb.close();
        });

        test("insert single and query single", ()=>{
            const table = "settings";
            const data = {
                category: "testCat",
                key: "testKey",
                value: "testValue"
            };
            expect.hasAssertions();
            return ibdb.insert(data, table)
                    .then(()=>{
                        const query = {
                            key: "testKey"
                        };
                        return ibdb.getRow(query, "settings");
                    })
                    .then((row)=>{
                        expect(row.id).toBe(1);
                        expect(row.value).toBe("testValue");
                    });
        });

        test("insert multiple and query multiple", ()=>{
            const table = "settings";
            const dataOne = {
                category: "testCat",
                key: "testKey",
                value: "testValue"
            };
            const dataTwo = {
                category: "testCat",
                key: "testKey2",
                value: "testValue2"
            };
            expect.hasAssertions();
            return ibdb.insert(dataOne, table)
                    .then(()=>{
                        return ibdb.insert(dataTwo, table);
                    })
                    .then(()=>{
                        const query = {
                            category: "testCat"
                        };
                        return ibdb.getAll(query, "settings");
                    })
                    .then((rows)=>{
                        expect(rows.length).toBe(2);
                        expect(rows[1].value).toBe("testValue2");
                    });
        });

        test("insert multiple and update single", ()=>{
            const table = "settings";
            const dataOne = {
                category: "testCat",
                key: "testKey",
                value: "testValue"
            };
            const dataTwo = {
                category: "testCat",
                key: "testKey2",
                value: "testValue2"
            };
            expect.hasAssertions();
            return ibdb.insert(dataOne, table)
                    .then(()=>{
                        return ibdb.insert(dataTwo, table);
                    })
                    .then(()=>{
                        const newData = {
                            key: "testKeyNew",
                            value: "testValueNew"
                        }
                        const query = {
                            category: "testCat",
                            key: "testKey2"
                        };
                        return ibdb.update(newData, query, "settings");
                    })
                    .then(()=>{
                        const query = {
                            category: "testCat"
                        };
                        return ibdb.getAll(query, "settings");
                    })
                    .then((rows)=>{
                        expect(rows.length).toBe(2);
                        expect(rows[0].category).toBe("testCat");
                        expect(rows[0].key).toBe("testKey");
                        expect(rows[0].value).toBe("testValue");
                        expect(rows[1].category).toBe("testCat");
                        expect(rows[1].key).toBe("testKeyNew");
                        expect(rows[1].value).toBe("testValueNew");
                    });
        });

        test("insert multiple and delete single", ()=>{
            const table = "settings";
            const dataOne = {
                category: "testCat",
                key: "testKey",
                value: "testValue"
            };
            const dataTwo = {
                category: "testCat",
                key: "testKey2",
                value: "testValue2"
            };
            expect.hasAssertions();
            return ibdb.insert(dataOne, table)
                    .then(()=>{
                        return ibdb.insert(dataTwo, table);
                    })
                    .then(()=>{
                        const query = {
                            category: "testCat"
                        };
                        return ibdb.getAll(query, "settings");
                    })
                    .then((rows)=>{
                        expect(rows.length).toBe(2);
                        expect(rows[1].value).toBe("testValue2");
                    })
                    .then(()=>{
                        const query = {
                            category: "testCat",
                            key: "testKey2"
                        };
                        return ibdb.delete(query, "settings");
                    })
                    .then(()=>{
                        const query = {
                            category: "testCat"
                        };
                        return ibdb.getAll(query, "settings");
                    })
                    .then((rows)=>{
                        expect(rows.length).toBe(1);
                        expect(rows[0].value).toBe("testValue");
                    });
        });

        test("insert multiple and delete multiple", ()=>{
            const table = "settings";
            const dataOne = {
                category: "testCat",
                key: "testKey",
                value: "testValue"
            };
            const dataTwo = {
                category: "testCat",
                key: "testKey",
                value: "testValue2"
            };
            const dataThree = {
                category: "testCat",
                key: "testOtherKey",
                value: "testValue3"
            };
            expect.hasAssertions();
            return ibdb.insert(dataOne, table)
                    .then(()=>{
                        return ibdb.insert(dataTwo, table);
                    })
                    .then(()=>{
                        return ibdb.insert(dataThree, table);
                    })
                    .then(()=>{
                        const query = {
                            category: "testCat"
                        };
                        return ibdb.getAll(query, "settings");
                    })
                    .then((rows)=>{
                        expect(rows.length).toBe(3);
                        expect(rows[1].value).toBe("testValue2");
                        expect(rows[2].value).toBe("testValue3");
                    })
                    .then(()=>{
                        const query = {
                            key: "testKey"
                        };
                        return ibdb.delete(query, "settings");
                    })
                    .then(()=>{
                        const query = {
                            category: "testCat"
                        };
                        return ibdb.getAll(query, "settings");
                    })
                    .then((rows)=>{
                        expect(rows.length).toBe(1);
                        expect(rows[0].value).toBe("testValue3");
                    });
        });
    });
})