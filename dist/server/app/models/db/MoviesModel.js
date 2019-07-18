"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MoviesModel =
/*#__PURE__*/
function () {
  function MoviesModel(ibdb, movieToGenreModel) {
    _classCallCheck(this, MoviesModel);

    this._ibdb = ibdb;
    this._movieToGenreModel = movieToGenreModel;
    this._tableName = "movies";
  }

  _createClass(MoviesModel, [{
    key: "addMovie",
    value: function addMovie(apiData, imageFilename) {
      var _this = this;

      var data = {
        title: apiData.title,
        year: apiData.year,
        tagline: apiData.tagline,
        overview: apiData.overview,
        released: apiData.released,
        runtime: apiData.runtime,
        rating: apiData.rating,
        slug: apiData.ids.slug,
        trakt_id: apiData.ids.trakt,
        imdb_id: apiData.ids.imdb,
        tmdb_id: apiData.ids.tmdb,
        image_filename: imageFilename,
        has_watched: 0,
        status_tags: ""
      };
      return this._ibdb.insert(data, this._tableName).then(function () {
        return _this.getSingleByTraktID(data.trakt_id);
      }).then(function (movie) {
        return _this._movieToGenreModel.addMovieToArrayGenres(movie.id, apiData.genres).then(function () {
          return movie;
        });
      });
    }
  }, {
    key: "updateHasWatched",
    value: function updateHasWatched(movieID, hasWatched) {
      var _this2 = this;

      var where = {
        id: movieID
      };
      var data = {
        has_watched: hasWatched
      };
      return this._ibdb.update(data, where, this._tableName).then(function () {
        return _this2.getSingle(movieID);
      });
    }
  }, {
    key: "updateStatusTags",
    value: function updateStatusTags(movieID, statusTags) {
      var _this3 = this;

      var where = {
        id: movieID
      };
      var data = {
        status_tags: statusTags
      };
      return this._ibdb.update(data, where, this._tableName).then(function () {
        return _this3.getSingle(movieID);
      });
    }
  }, {
    key: "getAll",
    value: function getAll() {
      return this._ibdb.getAll({}, this._tableName, "title ASC");
    }
  }, {
    key: "getSingleByTraktID",
    value: function getSingleByTraktID(traktID) {
      var where = {
        trakt_id: traktID
      };
      return this._ibdb.getRow(where, this._tableName);
    }
  }, {
    key: "getSingle",
    value: function getSingle(movieID) {
      var where = {
        id: movieID
      };
      return this._ibdb.getRow(where, this._tableName);
    }
  }, {
    key: "deleteSingle",
    value: function deleteSingle(movieID) {
      var where = {
        id: movieID
      };
      return this._ibdb["delete"](where, this._tableName);
    }
  }]);

  return MoviesModel;
}();

exports["default"] = MoviesModel;