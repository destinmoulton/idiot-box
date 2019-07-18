"use strict";

var _path = _interopRequireDefault(require("path"));

var _express = _interopRequireDefault(require("express"));

var _IBDB = _interopRequireDefault(require("./db/IBDB"));

var _io = require("./socket.io/io");

var _logger = _interopRequireDefault(require("./logger"));

var _db = _interopRequireDefault(require("./config/db.config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var PORT = 3000;

var PUBLIC_PATH = _path["default"].resolve(__dirname, '../public');

app.use(_express["default"]["static"](PUBLIC_PATH)); // Allow all URI's; handle by react router

app.get('*', function (req, res) {
  res.sendFile(_path["default"].join(PUBLIC_PATH, '/index.html'));
});
Promise.resolve().then(function () {
  _IBDB["default"].connect(_db["default"]);
}).then(function () {
  try {
    return app.listen(PORT, function () {
      _logger["default"].log("\n---------------------------------------");

      _logger["default"].log("Idiot Box Server running on Port " + PORT);

      _logger["default"].log("---------------------------------------");
    });
  } catch (err) {
    return Promise.reject(err);
  }
}).then(function (server) {
  (0, _io.setupSocketIO)(server);
})["catch"](function (err) {
  _logger["default"].error(err);
});