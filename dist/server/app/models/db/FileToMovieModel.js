"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FileToMovieModel = function () {
    function FileToMovieModel(ibdb) {
        _classCallCheck(this, FileToMovieModel);

        this._ibdb = ibdb;
        this._tableName = "file_to_movie";
    }

    _createClass(FileToMovieModel, [{
        key: "add",
        value: function add(fileID, movieID) {
            var _this = this;

            return this.getSingleForMovie(movieID).then(function (row) {
                if ('file_id' in row) {
                    return row;
                }
                var data = {
                    file_id: fileID,
                    movie_id: movieID
                };

                return _this._ibdb.insert(data, _this._tableName);
            }).then(function () {
                return _this.getSingle(fileID, movieID);
            });
        }
    }, {
        key: "getSingle",
        value: function getSingle(fileID, movieID) {
            var where = {
                file_id: fileID,
                movie_id: movieID
            };
            return this._ibdb.getRow(where, this._tableName);
        }
    }, {
        key: "getSingleForMovie",
        value: function getSingleForMovie(movieID) {
            var where = {
                movie_id: movieID
            };
            return this._ibdb.getRow(where, this._tableName);
        }
    }]);

    return FileToMovieModel;
}();

exports.default = FileToMovieModel;