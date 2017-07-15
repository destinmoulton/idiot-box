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
    function FilesystemModel(settingsModel) {
        _classCallCheck(this, FilesystemModel);

        this._settingsModel = settingsModel;
    }

    _createClass(FilesystemModel, [{
        key: 'getDirList',
        value: function getDirList(pathToList) {
            return new Promise(function (resolve, reject) {
                if (!_fs2.default.existsSync(pathToList)) {
                    reject('FilesystemModel Error: ' + pathToList + ' does not exist.');
                }
                var contents = _fs2.default.readdirSync(pathToList);
                var dirList = [];
                contents.forEach(function (name) {
                    var info = _fs2.default.statSync(_path2.default.join(pathToList, name));
                    var data = {
                        name: name,
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
    }, {
        key: 'trash',
        value: function trash(sourcePath, filenames) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                if (!_fs2.default.existsSync(sourcePath)) {
                    reject('FilesystemModel :: trash() :: sourcePath: ' + sourcePath + ' does not exist.');
                }

                return _this._settingsModel.getSingle("directories", "Trash").then(function (row) {
                    var trashPath = row.value;
                    if (!_fs2.default.existsSync(trashPath)) {
                        reject('FilesystemModel :: trash() :: trash directory: ' + trashPath + ' does not exist.');
                    }

                    var succeeded = [];
                    var failures = [];
                    filenames.forEach(function (filename) {
                        var origFilePath = _path2.default.join(sourcePath, filename);
                        var trashFilePath = _path2.default.join(trashPath, filename);

                        if (_fs2.default.renameSync(origFilePath, trashFilePath)) {
                            succeeded.push(filename);
                        } else {
                            failures.push(filename);
                        }
                    });
                    resolve({
                        succeeded: succeeded,
                        failures: failures
                    });
                }).catch(function (err) {
                    reject(err);
                });
            });
        }
    }]);

    return FilesystemModel;
}();

exports.default = FilesystemModel;