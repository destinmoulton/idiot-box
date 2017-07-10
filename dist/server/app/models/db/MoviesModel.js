"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MoviesModel = exports.MoviesModel = function () {
    function MoviesModel(ibdb) {
        _classCallCheck(this, MoviesModel);

        this._ibdb = ibdb;

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
                slug: apiData.slug,
                trakt_id: apiData.ids.trakt,
                imdb_id: apiData.ids.imdb,
                tmdb_id: apiData.ids.tmdb,
                image_filename: imageFilename
            };

            return this._ibdb.insert(data, this._tableName).then(function () {
                return _this.getSingle(category, key, value);
            });
        }
    }]);

    return MoviesModel;
}();