"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FilesModel =
/*#__PURE__*/
function () {
  function FilesModel(ibdb) {
    _classCallCheck(this, FilesModel);

    this._ibdb = ibdb;
    this._tableName = "files";
  }

  _createClass(FilesModel, [{
    key: "addFile",
    value: function addFile(directory_setting_id, subpath, filename, mediatype) {
      var _this = this;

      var data = {
        directory_setting_id: directory_setting_id,
        subpath: subpath,
        filename: filename,
        mediatype: mediatype
      };
      return this._ibdb.insert(data, this._tableName).then(function () {
        return _this.getSingleByDirectoryAndFilename(directory_setting_id, subpath, filename);
      });
    }
  }, {
    key: "getSingle",
    value: function getSingle(fileID) {
      var where = {
        id: fileID
      };
      return this._ibdb.getRow(where, this._tableName);
    }
  }, {
    key: "getSingleByDirectoryAndFilename",
    value: function getSingleByDirectoryAndFilename(directory_setting_id, subpath, filename) {
      var query = {
        directory_setting_id: directory_setting_id,
        subpath: subpath,
        filename: filename
      };
      return this._ibdb.getRow(query, this._tableName);
    }
  }, {
    key: "getAllForDirectory",
    value: function getAllForDirectory(directory_setting_id, subpath) {
      var query = {
        directory_setting_id: directory_setting_id,
        subpath: subpath,
        filename: filename
      };
      return this._ibdb.getAll(query, this._tableName, "filename ASC");
    }
  }, {
    key: "deleteSingle",
    value: function deleteSingle(fileID) {
      var where = {
        id: fileID
      };
      return this._ibdb["delete"](where, this._tableName);
    }
  }]);

  return FilesModel;
}();

exports["default"] = FilesModel;