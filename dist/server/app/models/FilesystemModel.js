'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FilesystemModel = function () {
    function FilesystemModel() {
        _classCallCheck(this, FilesystemModel);
    }

    _createClass(FilesystemModel, [{
        key: 'getDirList',
        value: function getDirList(path) {
            return new Promise(function (resolve, reject) {
                if (!_fs2.default.existsSync(path)) {
                    reject('FilesystemModel Error: ' + path + ' does not exist.');
                }
                var contents = _fs2.default.readdirSync(path);
                var dirList = [];
                contents.forEach(function (name) {
                    var info = _fs2.default.statSync(path.join(path, name));
                    var data = {
                        name: name,
                        ino: info.ino,
                        atime: info.atime,
                        birthtime: info.birthtime,
                        size: info.size,
                        isDirectory: info.isDirectory()
                    };
                    dirList.push(data);
                });
                resolve(dirList);
            });
        }
    }]);

    return FilesystemModel;
}();

exports.default = FilesystemModel;