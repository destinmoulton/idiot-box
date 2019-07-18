"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _logger = _interopRequireDefault(require("../../logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GenresModel =
/*#__PURE__*/
function () {
  function GenresModel(ibdb) {
    _classCallCheck(this, GenresModel);

    this._ibdb = ibdb;
    this._tableName = "genres";
  }

  _createClass(GenresModel, [{
    key: "addGenre",
    value: function addGenre(slug) {
      var _this = this;

      var name = slug[0].toUpperCase() + slug.slice(1);
      var data = {
        slug: slug,
        name: name
      };
      return this.getSingleBySlug(slug).then(function (row) {
        if (row.hasOwnProperty("slug")) {
          return row;
        }

        return _this._ibdb.insert(data, _this._tableName);
      }).then(function (row) {
        if (row.hasOwnProperty("slug")) {
          return row;
        }

        return _this.getSingleBySlug(slug);
      });
    }
  }, {
    key: "getAll",
    value: function getAll() {
      return this._ibdb.getAll({}, this._tableName, "slug ASC");
    }
  }, {
    key: "getSingleBySlug",
    value: function getSingleBySlug(slug) {
      var where = {
        slug: slug
      };
      return this._ibdb.getRow(where, this._tableName);
    }
  }, {
    key: "getSingle",
    value: function getSingle(genreID) {
      var where = {
        id: genreID
      };
      return this._ibdb.getRow(where, this._tableName);
    }
  }]);

  return GenresModel;
}();

exports["default"] = GenresModel;