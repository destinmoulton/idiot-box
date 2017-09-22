'use strict';

var _IBDB = require('../../db/IBDB');

var _IBDB2 = _interopRequireDefault(_IBDB);

var _ShowsModel = require('./ShowsModel');

var _ShowsModel2 = _interopRequireDefault(_ShowsModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("ShowsModel", function () {
    var showsModel = {};

    beforeEach(function () {
        var dbConfig = {
            inMemory: true
        };

        var migConfig = {
            migrationsPath: path.resolve(__dirname, '../../../migrations')
        };

        return _IBDB2.default.connect(dbConfig).then(function () {
            return _IBDB2.default._db.migrate(migConfig);
        }).then(function () {
            showsModel = new _ShowsModel2.default(_IBDB2.default);
        });
    });

    afterEach(function () {
        _IBDB2.default.close();
    });
});