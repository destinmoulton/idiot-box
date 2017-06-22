'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var PORT = 3000;

app.use(_express2.default.static(_path2.default.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(_path2.default.join(__dirname + '/public/index.html'));
});

app.listen(PORT, function () {
    console.log("------------------------");
    console.log("Idiot Box Server running on port " + PORT);
    console.log("------------------------");
});