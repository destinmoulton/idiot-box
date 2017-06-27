'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _sqlite = require('sqlite');

var _sqlite2 = _interopRequireDefault(_sqlite);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var PORT = 3000;
var DB_PATH = _path2.default.resolve(__dirname, '../database/idiot-box.sqlite3');

var PUBLIC_PATH = _path2.default.resolve(__dirname, '../public');

app.use(_express2.default.static(PUBLIC_PATH));

app.get('/', function (req, res) {
    res.sendFile(_path2.default.join(PUBLIC_PATH, '/index.html'));
});

Promise.resolve().then(function () {
    _sqlite2.default.open(DB_PATH);
}).then(function () {
    app.listen(PORT, function () {
        console.log("\n---------------------------------------");
        console.log("Idiot Box Server running on Port " + PORT);
        console.log("---------------------------------------");
    });
}).catch(function (err) {
    _logger2.default.error(err);
});