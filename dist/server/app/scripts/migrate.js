"use strict";

var _sqlite = _interopRequireDefault(require("sqlite"));

var _db = _interopRequireDefault(require("../config/db.config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Run the sqlite migrations
Promise.resolve().then(function () {
  return _sqlite["default"].open(_db["default"].filename);
}).then(function () {
  return _sqlite["default"].migrate({
    migrationsPath: _db["default"].migrationsPath
  });
})["catch"](function (err) {
  return console.log(err);
});