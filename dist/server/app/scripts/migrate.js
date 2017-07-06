'use strict';

var _sqlite = require('sqlite');

var _sqlite2 = _interopRequireDefault(_sqlite);

var _db = require('../config/db.config');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Run the sqlite migrations
Promise.resolve().then(function () {
    return _sqlite2.default.open(_db2.default.filename);
}).then(function () {
    return _sqlite2.default.migrate({ migrationsPath: _db2.default.migrationsPath });
}).catch(function (err) {
    return console.log(err);
});