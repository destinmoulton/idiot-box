'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

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

        /**
         * 
         * sourceInfo:
         *     setting_id
         *     subpath
         *     filename
         * 
         * destInfo:
         *     setting_id
         *     subpath
         *     filename
         * 
         * @param object sourceInfo 
         * @param object destInfo 
         */

    }, {
        key: 'move',
        value: function move(sourceInfo, destInfo) {
            var _this = this;

            return this._settingsModel.getSingleByID(sourceInfo.setting_id).then(function (sourceSetting) {
                var fullSourcePath = _path2.default.join(sourceSetting.value, sourceInfo.subpath, sourceInfo.filename);
                if (!_fs2.default.existsSync(fullSourcePath)) {
                    return Promise.reject('FilesystemModel :: move() :: source path ' + fullSourcePath + ' does not exist');
                }

                return _this._settingsModel.getSingle("directories", "Shows").then(function (destSetting) {
                    var baseDestDir = destSetting.value;
                    if (!_fs2.default.existsSync(baseDestDir)) {
                        return Promise.reject('FilesystemModel :: move() :: destination path ' + baseDestDir + ' does not exist');
                    }

                    var destPath = _path2.default.join(baseDestDir, destInfo.subpath);
                    if (!_fs2.default.existsSync(destPath)) {
                        if (!_mkdirp2.default.sync(destPath)) {
                            return Promise.reject('FilesystemModel :: move() :: unable to make the destination dir ' + destPath);
                        }
                    }

                    var fullDestPath = _path2.default.join(destPath, destInfo.filename);
                    _fs2.default.renameSync(fullSourcePath, fullDestPath);
                    if (!_fs2.default.existsSync(fullDestPath)) {
                        return Promise.reject('FilesystemModel :: move() :: unable to move file \'' + fullSourcePath + '\' to \'' + fullDestPath + '\'');
                    }
                    return {
                        original_path: fullSourcePath,
                        new_path: fullDestPath
                    };
                });
            });
        }
    }, {
        key: 'trash',
        value: function trash(sourcePath, filenames) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                if (!_fs2.default.existsSync(sourcePath)) {
                    reject('FilesystemModel :: trash() :: sourcePath: ' + sourcePath + ' does not exist.');
                }

                return _this2._settingsModel.getSingle("directories", "Trash").then(function (row) {
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