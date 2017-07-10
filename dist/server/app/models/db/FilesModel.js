"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FilesModel = function () {
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
                directory_setting_id: directory_setting_id, subpath: subpath, filename: filename, mediatype: mediatype
            };

            return this._ibdb.insert(data, this._tableName).then(function () {
                return _this.getSingle(category, key, value);
            });
        }
    }]);

    return FilesModel;
}();

exports.default = FilesModel;