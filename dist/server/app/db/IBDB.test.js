'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _IBDB = require('./IBDB');

var _IBDB2 = _interopRequireDefault(_IBDB);

var _error = require('../error');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("IBDB", function () {

    test("error on nonexistent database file", function () {
        var config = {
            filename: 'nonexistingFileName'
        };
        expect.assertions(1);
        return _IBDB2.default.connect(config).then(function (newDB) {
            expect(_IBDB2.default.isConnected()).toBe(false);
            _IBDB2.default.close();
        }).catch(function (err) {
            expect(err).toBe("IBDB :: connect :: File does not exist. nonexistingFileName");
        });
    });

    test("connects to test database", function () {
        var config = {
            filename: _path2.default.resolve(__dirname, '../../../../test/data/idiot-box-testdb.sqlite3')
        };
        expect.assertions(2);
        return _IBDB2.default.connect(config).then(function (newDB) {
            expect(_IBDB2.default.isConnected()).toBe(true);
            _IBDB2.default.close();
            expect(_IBDB2.default.isConnected()).toBe(false);
        }).catch(function (err) {
            _logger2.default.error("connects to test database");
            _logger2.default.error(err);
            expect(err).toBeUndefined();
        });
    });

    test("connects to in memory database", function () {
        var config = {
            inMemory: true
        };
        expect.assertions(2);
        return _IBDB2.default.connect(config).then(function (newDB) {
            expect(_IBDB2.default.isConnected()).toBe(true);
            _IBDB2.default.close();
            expect(_IBDB2.default.isConnected()).toBe(false);
        }).catch(function (err) {
            _logger2.default.error("connects to in memory database");
            _logger2.default.error(err);
            expect(err).toBeUndefined();
        });
    });

    describe("performs queries", function () {
        beforeEach(function () {
            var dbConfig = {
                inMemory: true
            };

            var migConfig = {
                migrationsPath: _path2.default.resolve(__dirname, '../../migrations')
            };

            return _IBDB2.default.connect(dbConfig).then(function () {
                return _IBDB2.default._db.migrate(migConfig);
            });
        });

        afterEach(function () {
            _IBDB2.default.close();
        });

        test("insert single and query single", function () {
            var table = "settings";
            var data = {
                category: "testCat",
                key: "testKey",
                value: "testValue"
            };
            expect.hasAssertions();
            return _IBDB2.default.insert(data, table).then(function () {
                var query = {
                    key: "testKey"
                };
                return _IBDB2.default.getRow(query, "settings");
            }).then(function (row) {
                expect(row.id).toBe(1);
                expect(row.value).toBe("testValue");
            });
        });

        test("insert multiple and query multiple", function () {
            var table = "settings";
            var dataOne = {
                category: "testCat",
                key: "testKey",
                value: "testValue"
            };
            var dataTwo = {
                category: "testCat",
                key: "testKey2",
                value: "testValue2"
            };
            expect.hasAssertions();
            return _IBDB2.default.insert(dataOne, table).then(function () {
                return _IBDB2.default.insert(dataTwo, table);
            }).then(function () {
                var query = {
                    category: "testCat"
                };
                return _IBDB2.default.getAll(query, "settings");
            }).then(function (rows) {
                expect(rows.length).toBe(2);
                expect(rows[1].value).toBe("testValue2");
            });
        });

        test("insert multiple and update single", function () {
            var table = "settings";
            var dataOne = {
                category: "testCat",
                key: "testKey",
                value: "testValue"
            };
            var dataTwo = {
                category: "testCat",
                key: "testKey2",
                value: "testValue2"
            };
            expect.hasAssertions();
            return _IBDB2.default.insert(dataOne, table).then(function () {
                return _IBDB2.default.insert(dataTwo, table);
            }).then(function () {
                var newData = {
                    key: "testKeyNew",
                    value: "testValueNew"
                };
                var where = {
                    category: "testCat",
                    key: "testKey2"
                };
                return _IBDB2.default.update(newData, where, "settings");
            }).then(function () {
                var where = {
                    category: "testCat"
                };
                return _IBDB2.default.getAll(where, "settings");
            }).then(function (rows) {
                expect(rows.length).toBe(2);
                expect(rows[0].category).toBe("testCat");
                expect(rows[0].key).toBe("testKey");
                expect(rows[0].value).toBe("testValue");
                expect(rows[1].category).toBe("testCat");
                expect(rows[1].key).toBe("testKeyNew");
                expect(rows[1].value).toBe("testValueNew");
            });
        });

        test("insert multiple and delete single", function () {
            var table = "settings";
            var dataOne = {
                category: "testCat",
                key: "testKey",
                value: "testValue"
            };
            var dataTwo = {
                category: "testCat",
                key: "testKey2",
                value: "testValue2"
            };
            expect.hasAssertions();
            return _IBDB2.default.insert(dataOne, table).then(function () {
                return _IBDB2.default.insert(dataTwo, table);
            }).then(function () {
                var query = {
                    category: "testCat"
                };
                return _IBDB2.default.getAll(query, "settings");
            }).then(function (rows) {
                expect(rows.length).toBe(2);
                expect(rows[1].value).toBe("testValue2");
            }).then(function () {
                var query = {
                    category: "testCat",
                    key: "testKey2"
                };
                return _IBDB2.default.delete(query, "settings");
            }).then(function () {
                var query = {
                    category: "testCat"
                };
                return _IBDB2.default.getAll(query, "settings");
            }).then(function (rows) {
                expect(rows.length).toBe(1);
                expect(rows[0].value).toBe("testValue");
            });
        });

        test("insert multiple and delete multiple", function () {
            var table = "settings";
            var dataOne = {
                category: "testCat",
                key: "testKey",
                value: "testValue"
            };
            var dataTwo = {
                category: "testCat",
                key: "testKey",
                value: "testValue2"
            };
            var dataThree = {
                category: "testCat",
                key: "testOtherKey",
                value: "testValue3"
            };
            expect.hasAssertions();
            return _IBDB2.default.insert(dataOne, table).then(function () {
                return _IBDB2.default.insert(dataTwo, table);
            }).then(function () {
                return _IBDB2.default.insert(dataThree, table);
            }).then(function () {
                var query = {
                    category: "testCat"
                };
                return _IBDB2.default.getAll(query, "settings");
            }).then(function (rows) {
                expect(rows.length).toBe(3);
                expect(rows[1].value).toBe("testValue2");
                expect(rows[2].value).toBe("testValue3");
            }).then(function () {
                var query = {
                    key: "testKey"
                };
                return _IBDB2.default.delete(query, "settings");
            }).then(function () {
                var query = {
                    category: "testCat"
                };
                return _IBDB2.default.getAll(query, "settings");
            }).then(function (rows) {
                expect(rows.length).toBe(1);
                expect(rows[0].value).toBe("testValue3");
            });
        });
    });
});