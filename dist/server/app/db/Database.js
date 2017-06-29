'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _sqlite = require('sqlite');

var _sqlite2 = _interopRequireDefault(_sqlite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Database = function Database(dbFileName) {
    _classCallCheck(this, Database);

    if (!_fs2.default.existsSync(dbFileName)) {
        throw new Error("Database :: File does not exist.");
    }

    this.db = _sqlite2.default.open(dbFileName);
};

exports.default = Database;