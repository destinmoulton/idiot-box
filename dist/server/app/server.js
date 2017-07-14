'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _IBDB = require('./db/IBDB');

var _IBDB2 = _interopRequireDefault(_IBDB);

var _io = require('./socket.io/io');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _db = require('./config/db.config');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var PORT = 3000;

var PUBLIC_PATH = _path2.default.resolve(__dirname, '../public');
app.use(_express2.default.static(PUBLIC_PATH));

// Allow all URI's; handle by react router
app.get('*', function (req, res) {
    res.sendFile(_path2.default.join(PUBLIC_PATH, '/index.html'));
});

Promise.resolve().then(function () {
    _IBDB2.default.connect(_db2.default);
}).then(function () {
    try {
        return app.listen(PORT, function () {
            console.log("\n---------------------------------------");
            console.log("Idiot Box Server running on Port " + PORT);
            console.log("---------------------------------------");
        });
    } catch (err) {
        return Promise.reject(err);
    }
}).then(function (server) {
    (0, _io.setupSocketIO)(server);
}).catch(function (err) {
    _logger2.default.error(err);
});