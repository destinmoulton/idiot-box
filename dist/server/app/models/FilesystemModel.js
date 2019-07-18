"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _mkdirp = _interopRequireDefault(require("mkdirp"));

var _logger = _interopRequireDefault(require("../logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FilesystemModel =
/*#__PURE__*/
function () {
  function FilesystemModel(models) {
    _classCallCheck(this, FilesystemModel);

    this._filesModel = models.filesModel;
    this._fileToEpisodeModel = models.fileToEpisodeModel;
    this._fileToMovieModel = models.fileToMovieModel;
    this._moviesModel = models.moviesModel;
    this._settingsModel = models.settingsModel;
    this._showSeasonEpisodesModel = models.showSeasonEpisodesModel;
  }

  _createClass(FilesystemModel, [{
    key: "getDirList",
    value: function getDirList(basePath, fullPath) {
      var _this = this;

      if (!_fs["default"].existsSync(fullPath)) {
        return Promise.reject("FilesystemModel Error: ".concat(fullPath, " does not exist."));
      }

      var contents = _fs["default"].readdirSync(fullPath);

      var dirList = [];
      var promisesToRun = [];
      contents.forEach(function (filename) {
        promisesToRun.push(_this._collateFileInformation(basePath, fullPath, filename));
      });
      return Promise.all(promisesToRun);
    }
  }, {
    key: "_collateFileInformation",
    value: function _collateFileInformation(basePath, fullPath, filename) {
      var _this2 = this;

      var subpath = fullPath.slice(basePath.length + 1);

      var info = _fs["default"].statSync(_path["default"].join(fullPath, filename));

      var isDirectory = info.isDirectory();
      var fileData = {
        name: filename,
        atime: info.atime,
        birthtime: info.birthtime,
        size: info.size,
        isDirectory: isDirectory,
        assocData: {}
      };

      if (isDirectory) {
        return Promise.resolve(fileData);
      }

      return this._settingsModel.getSingleByCatAndVal("directories", basePath).then(function (setting) {
        if (!setting.hasOwnProperty("id")) {
          return Promise.resolve(fileData);
        }

        return _this2._filesModel.getSingleByDirectoryAndFilename(setting.id, subpath, filename);
      }).then(function (file) {
        if (!file.hasOwnProperty("id")) {
          return Promise.resolve(fileData);
        }

        if (file.mediatype === "movie") {
          return _this2._getMovieFileInfo(file, fileData);
        } else {
          return _this2._getEpisodeFileInfo(file, fileData);
        }
      });
    }
    /**
     * Get the movie file information for collation
     * @param object FilesModel file row.
     * @param object Object to append collation
     */

  }, {
    key: "_getMovieFileInfo",
    value: function _getMovieFileInfo(file, fileCollate) {
      var _this3 = this;

      return this._fileToMovieModel.getSingleForFile(file.id).then(function (fileToMovie) {
        if (!fileToMovie.hasOwnProperty("movie_id")) {
          return Promise.resolve(fileCollate);
        }

        return _this3._moviesModel.getSingle(fileToMovie.movie_id);
      }).then(function (movieInfo) {
        var assocData = {
          movie_id: movieInfo.id,
          file_id: file.id,
          title: movieInfo.title,
          type: "movie"
        };
        fileCollate.assocData = assocData;
        return Promise.resolve(fileCollate);
      });
    }
    /**
     * Get the episode-file information for collation.
     * @param Object FilesModel file row.
     * @param Object Object to append collation
     */

  }, {
    key: "_getEpisodeFileInfo",
    value: function _getEpisodeFileInfo(file, fileCollate) {
      var _this4 = this;

      return this._fileToEpisodeModel.getSingleForFile(file.id).then(function (fileToEpisode) {
        if (!fileToEpisode.hasOwnProperty("episode_id")) {
          return Promise.resolve(fileCollate);
        }

        return _this4._showSeasonEpisodesModel.getSingle(fileToEpisode.episode_id);
      }).then(function (episodeInfo) {
        var assocData = {
          episode_id: episodeInfo.id,
          file_id: file.id,
          title: episodeInfo.title,
          type: "show"
        };
        fileCollate.assocData = assocData;
        return Promise.resolve(fileCollate);
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
     *     subpath
     *     filename
     *
     * @param object sourceInfo
     * @param object destInfo
     */

  }, {
    key: "moveInSetDir",
    value: function moveInSetDir(sourceInfo, destInfo, destDirType) {
      var _this5 = this;

      return this._settingsModel.getSingleByID(sourceInfo.setting_id).then(function (sourceSetting) {
        var fullSourcePath = _path["default"].join(sourceSetting.value, sourceInfo.subpath, sourceInfo.filename);

        if (!_fs["default"].existsSync(fullSourcePath)) {
          return Promise.reject("FilesystemModel :: moveInSetDir() :: source path ".concat(fullSourcePath, " does not exist"));
        }

        return _this5._settingsModel.getSingle("directories", destDirType).then(function (destSetting) {
          var baseDestDir = destSetting.value;

          if (!_fs["default"].existsSync(baseDestDir)) {
            return Promise.reject("FilesystemModel :: moveInSetDir() :: destination path ".concat(baseDestDir, " does not exist"));
          }

          var destPath = _path["default"].join(baseDestDir, destInfo.subpath);

          if (!_fs["default"].existsSync(destPath)) {
            if (!_mkdirp["default"].sync(destPath)) {
              return Promise.reject("FilesystemModel :: moveInSetDir() :: unable to make the destination dir ".concat(destPath));
            }
          }

          var fullDestPath = _path["default"].join(destPath, destInfo.filename);

          _fs["default"].renameSync(fullSourcePath, fullDestPath);

          if (!_fs["default"].existsSync(fullDestPath)) {
            return Promise.reject("FilesystemModel :: moveInSetDir() :: unable to move file '".concat(fullSourcePath, "' to '").concat(fullDestPath, "'"));
          }

          return {
            original_path: fullSourcePath,
            new_path: fullDestPath
          };
        });
      });
    }
    /**
     * Perform a direct move (ie between setting dirs)
     * on multiple items (files or dirs);
     *
     * @param string sourcePath
     * @param string destPath
     * @param object itemsToRename
     */

  }, {
    key: "directMoveMultiple",
    value: function directMoveMultiple(sourcePath, destPath, itemsToRename) {
      var _this6 = this;

      var promisesToRun = [];
      var originalNames = Object.keys(itemsToRename);
      originalNames.forEach(function (sourceName) {
        var cmd = _this6.directMoveSingle(sourcePath, destPath, sourceName, itemsToRename[sourceName]);

        promisesToRun.push(cmd);
      });
      return Promise.all(promisesToRun);
    }
    /**
     * Perform a "direct" move -- possibly between two
     * setting directories.
     *
     * To move within a setting directory, use moveInSetDir()
     *
     * @param string sourcePath
     * @param string destPath
     * @param string sourceName
     * @param string destName
     */

  }, {
    key: "directMoveSingle",
    value: function directMoveSingle(sourcePath, destPath, sourceName, destName) {
      return new Promise(function (resolve, reject) {
        var fullSource = _path["default"].join(sourcePath, sourceName);

        if (!_fs["default"].existsSync(fullSource)) {
          reject("FilesystemModel :: directMoveSingle() :: source does not exist '".concat(fullSource, "'"));
        }

        var fullDest = _path["default"].join(destPath, destName);

        _fs["default"].renameSync(fullSource, fullDest);

        if (!_fs["default"].existsSync(fullDest)) {
          reject("FilesystemModel :: directMoveSingle() :: unable to rename '".concat(fullSource, "' to ").concat(fullDest));
        }

        resolve(fullDest);
      });
    }
  }, {
    key: "trash",
    value: function trash(sourcePath, filenames) {
      var _this7 = this;

      return new Promise(function (resolve, reject) {
        if (!_fs["default"].existsSync(sourcePath)) {
          reject("FilesystemModel :: trash() :: sourcePath: ".concat(sourcePath, " does not exist."));
        }

        return _this7._settingsModel.getSingle("directories", "Trash").then(function (row) {
          var trashPath = row.value;

          if (!_fs["default"].existsSync(trashPath)) {
            reject("FilesystemModel :: trash() :: trash directory: ".concat(trashPath, " does not exist."));
          }

          var succeeded = [];
          var failures = [];
          filenames.forEach(function (filename) {
            var origFilePath = _path["default"].join(sourcePath, filename);

            var trashFilePath = _path["default"].join(trashPath, filename);

            if (_fs["default"].renameSync(origFilePath, trashFilePath)) {
              succeeded.push(filename);
            } else {
              failures.push(filename);
            }
          });
          resolve({
            succeeded: succeeded,
            failures: failures
          });
        })["catch"](function (err) {
          reject(err);
        });
      });
    }
  }]);

  return FilesystemModel;
}();

exports["default"] = FilesystemModel;